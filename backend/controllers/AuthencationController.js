const { User, Product, Business } = require("../models");
const sendMail = require("../extensions/mail");
const bcrypt = require("bcrypt");
const redisClient = require("../extensions/redis");
const jwt = require("jsonwebtoken");
const { where, Op } = require("sequelize");
const path = require("path");
const fs = require("fs");
const GetAccount = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const user = await User.findOne({
      where: {
        id: userId,
        is_verified: true,
      },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ message: user.get({ plain: true }) });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const RegisterAccount = async (req, res, next) => {
  try {
    const { username, password, email, cfnpassword } = req.body;
    if (!username || !password || !email || !cfnpassword) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (password !== cfnpassword) {
      return res
        .status(400)
        .json({ message: "Password and Confirm Password do not match" });
    }
    const existingUser = await User.findOne({
      where: { email, is_verified: true },
    });
    if (existingUser) {
      return res.status(400).json({ message: "Account existed" });
    }

    const NonVerifiedUser = await User.findOne({
      where: { email, is_verified: false },
    });
    if (NonVerifiedUser) {
      await NonVerifiedUser.destroy();
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await redisClient.set("email", email);
    await redisClient.set("verifyregister", "true");
    await redisClient.set("step", "register", { EX: 300 });
    await redisClient.set(`otp:${email}`, otp, {
      EX: 300,
    });
    await sendMail(
      email,
      "Xác thực OTP đề đăng ký tài khoản",
      `Ma OTP của bạn là ${otp}`,
    );
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });
    return res.status(200).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const VerifyOTP = async (req, res, next) => {
  try {
    const { otp } = req.body;
    const email = await redisClient.get("email");
    const storedOtp = await redisClient.get(`otp:${email}`);
    if (otp !== storedOtp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    const feautes = await redisClient.get("verifyregister");

    if (!feautes) {
      const user = await User.findOne({ where: { email, is_verified: true } });
      if (!user) {
        return res
          .status(400)
          .json({ message: "User not found or already verified" });
      }
      await redisClient.del(`otp:${email}`);
      await redisClient.set("step", "verified", { EX: 300 });
      return res.status(200).json({ message: "Redirect ResetPassword" });
    } else {
      const user = await User.findOne({ where: { email, is_verified: false } });
      if (!user) {
        return res
          .status(400)
          .json({ message: "User not found or already verified" });
      }
      await user.update({ is_verified: true });
      await redisClient.del(`otp:${email}`);
      await redisClient.del("email");
      await redisClient.del("verifyregister");
      return res.status(200).json({
        message: "User verified successfully",
        feautes: "verifyRegister",
      });
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const LoginAccount = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = await User.findOne({
      where: { email, is_verified: true, status: "active" },
    });
    if (!user) {
      return res.status(400).json({ message: "Account does not exist" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      process.env.ACCESS_TOKEN,
      { expiresIn: "30m" },
    );
    const refreshToken = jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      process.env.REFRESH_TOKEN,
      { expiresIn: "7d" },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
      path: "/",
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
      path: "/",
    });
    return res
      .status(200)
      .json({ message: "Login successful", role: user.role, userId: user.id });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const RefreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(401);
    const decodedeToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN);
    if (!decodedeToken) return res.sendStatus(403);
    const newAccessToken = jwt.sign(
      {
        id: decodedeToken.id,
        username: decodedeToken.username,
        email: decodedeToken.email,
        role: decodedeToken.role,
      },
      process.env.ACCESS_TOKEN,
      { expiresIn: "30m" },
    );
    res.cookie("token", newAccessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
      path: "/",
    });
    return res.status(200).json({ message: newAccessToken });
  } catch (err) {
    next(err);
  }
};

const LogoutAccount = async (req, res, next) => {
  try {
    res.clearCookie("token");
    res.clearCookie("refreshToken");
    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Error during logout:", error);
    next(error);
  }
};

const ForgotAccount = async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ where: { email, is_verified: true } });
  if (!email) {
    return res.status(400).json({ message: "Email không được để trống" });
  }

  if (user.length < 1) {
    return res.status(400).json({ message: "Không Tìm Thấy Người Dùng" });
  }
  const token = jwt.sign(
    { id: user.id, username: user.username, email: user.email },
    process.env.ACCESS_TOKEN,
    { expiresIn: "30m" },
  );
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  await redisClient.set("email", email);
  await redisClient.set("step", "forgot", { EX: 300 });
  await redisClient.set(`otp:${email}`, otp, {
    EX: 300,
  });
  await sendMail(
    email,
    "Mã OTP của bạn",
    `Ma OTP để đặt lại mật khẩu là ${otp}`,
  );

  return res.status(200).json({
    message: "Gửi OTP thành công",
    otp,
  });
};

const ResetPasswordAccount = async (req, res, next) => {
  try {
    const email = await redisClient.get("email");
    const user = await User.findOne({ where: { email, is_verified: true } });
    const { password, confirmPassword } = req.body;
    if (password != confirmPassword) {
      return res.status(500).json({
        message: "Password is not match",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    await User.update({ password: hashPassword }, { where: { email } });
    await redisClient.del("email");
    await redisClient.del("step");
    return res.status(200).json({
      message: "Updated successfully",
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const CheckRoleUser = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);
    const user = await User.findOne({ where: { id: decoded.id} });
    return res.status(200).json({
      message: user.role,
    });
  } catch (error) {
    console.error(error);
  }
};

const RedirectGoogleLogin = async (req, res, next) => {
  try {
    const redirectUri = `https://accounts.google.com/o/oauth2/v2/auth
      ?client_id=${process.env.GOOGLE_CLIENT_ID}
      &redirect_uri=${process.env.GOOGLE_REDIRECT_URI}
      &response_type=code
      &scope=openid%20email%20profile
      &prompt=select_account`.replace(/\s+/g, "");

    return res.status(200).json({
      message: redirectUri,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const GetDataLoginGoogle = async (req, res, next) => {
  const code = req.query.code;
  try {
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenRes.ok) throw new Error("Failed to fetch token");

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;
    const userRes = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    if (!userRes.ok) throw new Error("Failed to fetch user info");

    const userInfo = await userRes.json();
    const { name, email, picture } = userInfo;

    let user = await User.findOne({ where: { email, status: "active" } });

    if (!user) {
      const fakePassword = await bcrypt.hash(Date.now().toString(), 10);
      user = await User.create({
        username: name,
        email: email,
        password: fakePassword,
        is_verified: true,
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      process.env.ACCESS_TOKEN,
      { expiresIn: "30m" },
    );

    const refreshToken = jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      process.env.REFRESH_TOKEN,
      { expiresIn: "7d" },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
      path: "/",
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
      path: "/",
    });

    res.redirect("http://localhost:3000");
  } catch (error) {
    console.error("Google OAuth error:", error.message);
    next(error);
  }
};

const CheckStepAuthencation = async (req, res, next) => {
  try {
    const step = await redisClient.get("step");
    return res.status(200).json({
      message: step,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const EditProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const { username, description } = req.body;
    const image = req.file;
    let imageName;
    if (image) {
      imageName = image.filename;
      if (user.avatar) {
        const imagePath = path.join(__dirname, "../uploads", user.avatar);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }
    }

    const updateUser = await user.update({
      username: username || user.username,
      description: description || user.description,
      avatar: imageName || user.avatar,
    });

    return res.status(200).json({ message: updateUser.get({ plain: true }) });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const ChangePassword = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const { currentPassword, newPassword, confirmNewPassword } = req.body;
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password,
    );
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }
    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ message: "New passwords do not match" });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await user.update({
      password: hashedNewPassword,
    });
    return res.status(200).json({ message: "Change password successful" });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const SearchProductByUser = async (req, res, next) => {
  try {
    const { query } = req.body;
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;
    if (!query || query.trim() === "") {
      return res.status(400).json({
        message: "Not Found",
      });
    }

    const products = await Product.findAll({
      where: {
        productName: {
          [Op.like]: `%${query}%`,
        },
      },
      limit,
      offset,
      include: [
        {
          model: Business,
          as: "business",
          attributes: ["id", "businessName"],
        },
      ],
    });

    return res.status(200).json({
      message: products,
      return: true,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const SeekBusiness = async (req, res, next) => {
  try {
    const { id } = req.params;
    const business = await Business.findOne({
      where: {
        id,
      },
    });
    if (!business) return res.status(404).json({ message: "Not Found" });
    return res.status(200).json({
      message: business,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const FakeUser = async () => {
  const password = "ToanBan@123";
  const hashedPassword = await bcrypt.hash(password, 10);

  const ids = [8, 10, 12];

  for (let i = 0; i < ids.length; i++) {
    await User.create({
      id: ids[i],
      username: `user${ids[i]}`,
      email: `user${ids[i]}@gmail.com`,
      password: hashedPassword,
      role: "user",
      status: "active",
      is_verified: 1,
    });
  }

  console.log("Fake users created successfully");
};

module.exports = {
  RegisterAccount,
  LoginAccount,
  VerifyOTP,
  GetAccount,
  LogoutAccount,
  ForgotAccount,
  ResetPasswordAccount,
  RedirectGoogleLogin,
  GetDataLoginGoogle,
  CheckStepAuthencation,
  EditProfile,
  ChangePassword,
  SearchProductByUser,
  SeekBusiness,
  FakeUser,
  RefreshToken,
  CheckRoleUser,
};
