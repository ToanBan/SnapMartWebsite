const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const { Server } = require("socket.io");
const http = require("http");
const jwt = require("jsonwebtoken");
const app = express();
const server = http.createServer(app);
const fs = require("fs");
require("dotenv").config();
const { CheckUserAuthencation } = require("./middleware/checkAuthencation");
const { CheckAdmin } = require("./middleware/checkAdmin");
const errorLogger = require("./middleware/errorLogger");
const {
  InsertProducts,
  exportProductsJson,
  RecommendByCBF,
  SuggestionProduct,
} = require("./controllers/SuggestionController");

const io = new Server(server, {
  cors: {
    origin: `${process.env.FRONTEND_URL || "http://localhost:3000"}`,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = "uploads/";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ImageTime = Date.now();
    cb(null, ImageTime + "-" + file.originalname);
  },
});

io.use((socket, next) => {
  const cookieHeader = socket.handshake.headers.cookie;
  if (!cookieHeader) return next(new Error("No cookie"));

  const cookies = {};
  cookieHeader.split(";").forEach((c) => {
    const [k, v] = c.trim().split("=");
    cookies[k] = v;
  });

  const token = cookies.token;
  if (!token) return next(new Error("No token"));
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);
    socket.user = { id: decoded.id, email: decoded.email };
    next();
  } catch (err) {
    return next(new Error("Invalid token"));
  }
});

const upload = multer({ storage });

const {
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
  RefreshToken,
  CheckRoleUser
} = require("./controllers/AuthencationController");
const {
  GetProfileDetail,
  SearchProfile,
} = require("./controllers/ProfileController");
const {
  AddPost,
  GetPost,
  GetPostOtherUser,
  DeletePostUser,
  EditPostUser,
  GetPostsFollow,
  FakePostForUser,
  SharePost,
  GetSharePost,
  ReportPost,
} = require("./controllers/PostController");
const {
  FollowUser,
  CheckFollow,
  CountFollow,
  GetFriend,
} = require("./controllers/FollowController");
const {
  ToggleReaction,
  GetCountLikeForPost,
  CheckDisplayReaction,
} = require("./controllers/ReactionController");
const {
  AddComment,
  GetCommentByPostId,
  SendMessage,
  GetMessageByUserId,
  SendMessageBusiness,
  GetMessageBusiness,
  UploadFile,
  DownloadFile,
  HandleNotification,
  ReadNotification,
  GetNotification,
} = require("./controllers/RealtimeController");

const {
  RegisterBusiness,
  CheckTeacherId,
  AddProduct,
  GetAllProducts,
  DeleteProductById,
  EditProductById,
  GetOrders,
  ChangeStatusOrder,
  GetUserProducts,
  GetRevenue,
  GetUnsoldProduct,
  GetUserSentMessageToBusiness,
  GetProductsByBusiness,
} = require("./controllers/BusinessController");
const {
  VerifyBusiness,
  GetVerifyBusinesses,
  GetProductsPending,
  VerifyProduct,
  GetProductsApproved,
  GetProductDetails,
  GetBusinesses,
  GetRevenueAdmin,
  GetUserAdmin,
  ChangeRoleUser,
  GetPostsAdmin,
  GetAllUsersAdmin,
  ChangeStatusUsers,
  GetOrdersAdmin,
  ChangeStatusPost,
  GetErrors,
} = require("./controllers/AdminController");

const {
  CreateCheckoutController,
  HandleSuccessTransaction,
  CreateCheckoutCOD,
} = require("./controllers/TransactionController");

const {
  AddCartItem,
  DeleteCartItem,
  GetCartItems,
} = require("./controllers/CartController");

const {
  GetOrderByUser,
  GetOrderDetailByUser,
  ReceiveOrderByUser,
} = require("./controllers/OrderController");

const { ResponseToUser } = require("./controllers/ChatbotController");
const PORT = process.env.PORT || 5000;
app.post(
  "/api/webhook",
  express.raw({ type: "application/json" }),
  HandleSuccessTransaction,
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);
  console.log("User info:", socket.user);

  socket.on("joinPostRoom", (room) => {
    socket.join(room);
    console.log(`Socket ${socket.id} joined room: ${room}`);
  });

  socket.on("newComment", (data) => {
    AddComment(io, socket, data);
  });

  socket.join(`user-${socket.user.id}`);

  socket.on("sendMessage", (data) => {
    console.log("Joining room:", `user-${socket.user.id}`);
    SendMessage(io, socket, data);
  });

  socket.on("sendMessageBusiness", (data) => {
    console.log("chat business");
    SendMessageBusiness(io, socket, data);
  });

  socket.on("notification", (data) => {
    console.log("notification");
    HandleNotification(io, socket, data);
  });

  socket.on("readNotification", (data) => {
    ReadNotification(io, socket, data);
  });

  socket.on("leavePostRoom", (room) => {
    socket.leave(room);
  });
});

app.post("/api/register", upload.single(""), RegisterAccount);
app.post("/api/login", upload.single(""), LoginAccount);
app.get("/api/refresh-token", RefreshToken);
app.post("/api/verify-otp", VerifyOTP);
app.get("/api/user", CheckUserAuthencation, GetAccount);
app.post("/api/logout", LogoutAccount);
app.post("/api/forgot", ForgotAccount);
app.post("/api/reset-password", upload.single(""), ResetPasswordAccount);
app.get("/api/role", CheckRoleUser);
app.get("/api/google", RedirectGoogleLogin);
app.get("/api/auth/google/callback", GetDataLoginGoogle);
app.get("/api/check-step", CheckStepAuthencation);
app.post(
  "/api/user/edit",
  upload.single("avatar"),
  CheckUserAuthencation,
  EditProfile,
);
app.post(
  "/api/user/change-password",
  upload.single(""),
  CheckUserAuthencation,
  ChangePassword,
);
app.get("/api/profile/:id", GetProfileDetail);
app.get("/api/search/profile", CheckUserAuthencation, SearchProfile);
app.post(
  "/api/posts",
  upload.single("file_path"),
  CheckUserAuthencation,
  AddPost,
);
app.get("/api/posts", CheckUserAuthencation, GetPost);
app.get("/api/user/posts/:id", GetPostOtherUser);
app.delete("/api/posts/:id", CheckUserAuthencation, DeletePostUser);
app.put(
  "/api/posts/:id",
  upload.single("file_path"),
  CheckUserAuthencation,
  EditPostUser,
);
app.post("/api/follow/:id", CheckUserAuthencation, FollowUser);
app.get("/api/follow/:id", CheckUserAuthencation, CheckFollow);
app.get("/api/user/follow/:id", CheckUserAuthencation, CountFollow);
app.get("/api/posts/follow", CheckUserAuthencation, GetPostsFollow);
app.post("/api/post/reaction", CheckUserAuthencation, ToggleReaction);
app.get(
  "/api/post/check_reaction/:id",
  CheckUserAuthencation,
  CheckDisplayReaction,
);
app.get("/api/count_reaction/:id", GetCountLikeForPost);
app.get("/api/comments/:postId", GetCommentByPostId);
app.post("/api/posts/share", CheckUserAuthencation, SharePost);
app.get("/api/posts/share", GetSharePost);
app.get("/api/posts/share/:userid", GetSharePost);
app.get("/api/friends", CheckUserAuthencation, GetFriend);
app.get("/api/messages", CheckUserAuthencation, GetMessageByUserId);
app.post(
  "/api/business/register",
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "licence", maxCount: 1 },
  ]),
  RegisterBusiness,
);

app.get("/api/admin/verify-businesses", GetVerifyBusinesses);
app.post("/api/admin/verify-business", CheckAdmin, VerifyBusiness);
app.get("/api/check_teacher", CheckUserAuthencation, CheckTeacherId);
app.post(
  "/api/business/product/add",
  CheckUserAuthencation,
  upload.single("productImage"),
  AddProduct,
);
app.get("/api/business/product", CheckUserAuthencation, GetAllProducts);
app.get("/api/admin/business/products", CheckAdmin, GetProductsPending);
app.post("/api/admin/product/verify", CheckAdmin, VerifyProduct);
app.get("/api/products", GetProductsApproved);
app.get("/api/products/:id", GetProductDetails);
app.delete("/api/products/:id", CheckUserAuthencation, DeleteProductById);
app.post(
  "/api/products/:id",
  CheckUserAuthencation,
  upload.single("productImage"),
  EditProductById,
);
app.get("/api/businesses", CheckAdmin, GetBusinesses);
app.post("/api/carts", CheckUserAuthencation, AddCartItem);
app.delete("/api/carts/:cartItemId", CheckUserAuthencation, DeleteCartItem);
app.get("/api/carts", CheckUserAuthencation, GetCartItems);
app.post("/api/transaction", CheckUserAuthencation, CreateCheckoutController);
app.post("/api/transaction-cod", CheckUserAuthencation, CreateCheckoutCOD);
app.get("/api/orders", CheckUserAuthencation, GetOrders);
app.post("/api/orders/:id", CheckUserAuthencation, ChangeStatusOrder);
app.get("/api/user/orders", CheckUserAuthencation, GetOrderByUser);
app.get("/api/user/orders/:id", CheckUserAuthencation, GetOrderDetailByUser);
app.post("/api/user/receive-order", CheckUserAuthencation, ReceiveOrderByUser);
app.post("/api/chatbot", CheckUserAuthencation, ResponseToUser);
app.post("/api/products", SearchProductByUser);
app.post("/api/send-action", CheckUserAuthencation, RecommendByCBF);
app.get("/api/users/products", CheckUserAuthencation, GetUserProducts);
app.get("/api/business/revenue", CheckUserAuthencation, GetRevenue);
app.get(
  "/api/business/unsold-product",
  CheckUserAuthencation,
  GetUnsoldProduct,
);
app.get("/api/shop/:id", SeekBusiness);
app.get(
  "/api/users/messages",
  CheckUserAuthencation,
  GetUserSentMessageToBusiness,
);
app.get("/api/messages-business", CheckUserAuthencation, GetMessageBusiness);
app.get("/api/products/shop/:id", GetProductsByBusiness);
app.get("/api/admin/revenue", CheckAdmin, GetRevenueAdmin);
app.get("/api/admin/users", CheckAdmin, GetUserAdmin);
app.post("/api/admin/change-role", CheckAdmin, ChangeRoleUser);
app.get("/api/admin/posts", CheckAdmin, GetPostsAdmin);
app.get("/api/admin/all-users", CheckAdmin, GetAllUsersAdmin);
app.post("/api/admin/change-status", CheckAdmin, ChangeStatusUsers);
app.get("/api/admin/orders", CheckAdmin, GetOrdersAdmin);
app.post("/api/posts/report/:id", CheckUserAuthencation, ReportPost);
app.post("/api/admin/posts/change-status", CheckAdmin, ChangeStatusPost);
app.get("/api/admin/errors", CheckAdmin, GetErrors);
app.post("/api/hello", CheckUserAuthencation, SuggestionProduct);
app.post("/api/upload-file", upload.single("fileName"), UploadFile);
app.get("/uploads/api/download/:filename", DownloadFile);
app.get("/api/notifications", CheckUserAuthencation, GetNotification);
app.use(errorLogger);
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
