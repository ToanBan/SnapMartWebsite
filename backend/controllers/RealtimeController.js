const { Comment, User, Message, Business, Notification } = require("../models");
const { Op, where } = require("sequelize");
const path = require("path");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const message = require("../models/message");

const AddComment = async (io, socket, data) => {
  try {
    const { postId, text, parentId = null } = data;
    const userId = socket.user.id;

    const newComment = await Comment.create({
      postId,
      userId,
      content: text,
      parentId,
    });

    const user = await User.findByPk(userId, {
      attributes: ["id", "username", "avatar"],
    });

    io.to(`post-${postId}`).emit("receiveComment", {
      id: newComment.id,
      postId: newComment.postId,
      userId: user.id,
      User: {
        username: user.username,
        avatar: user.avatar,
      },
      content: newComment.content,
      parentId: newComment.parentId,
      createdAt: newComment.created_at,
    });
  } catch (error) {
    console.error("Lỗi lưu bình luận:", error);
    socket.emit("comment_error", {
      message: "Lỗi khi lưu bình luận",
      error: error.message,
    });
  }
};

const SendMessage = async (io, socket, data) => {
  try {
    const { recieveId, content, type } = data;

    const userId = socket.user.id;
    let newMessage;
    if (type == "file") {
      newMessage = await Message.create({
        senderId: userId,
        receiverId: recieveId,
        content,
        fileName: content,
        type,
      });
    } else {
      newMessage = await Message.create({
        senderId: userId,
        receiverId: recieveId,
        content,
      });
    }

    io.to(`user-${recieveId}`).emit("receiveMessage", {
      id: newMessage.id,
      senderId: newMessage.senderId,
      receiverId: newMessage.receiverId,
      content: newMessage.content,
      createdAt: newMessage.createdAt,
      type,
    });

    io.to(`user-${userId}`).emit("receiveMessage", {
      id: newMessage.id,
      senderId: newMessage.senderId,
      receiverId: newMessage.receiverId,
      content: newMessage.content,
      createdAt: newMessage.createdAt,
      type,
    });
  } catch (error) {
    console.error("Lỗi gửi tin nhắn:", error);
    socket.emit("message_error", {
      message: "Lỗi khi gửi tin nhắn",
      error: error.message,
    });
  }
};

const SendMessageBusiness = async (io, socket, data) => {
  try {
    const { receiverId, content, type = "business" } = data;
    const userId = socket.user.id;
    let finalReceiverId;
    let checkBusinessReceiver;
    if (type == "user") {
      checkBusinessReceiver = await Business.findOne({
        where: {
          id: receiverId,
          status: "approved",
        },
      });
    } else {
      checkBusinessReceiver = await Business.findOne({
        where: {
          userId: receiverId,
          status: "approved",
        },
      });
    }

    if (checkBusinessReceiver) {
      finalReceiverId = checkBusinessReceiver.userId;
    } else {
      finalReceiverId = receiverId;
    }

    const isSenderBusiness = await Business.findOne({
      where: {
        userId: userId,
        status: "approved",
      },
    });

    const isReceiverBusiness = await Business.findOne({
      where: {
        userId: finalReceiverId,
        status: "approved",
      },
    });

    let newMessage;
    if (isSenderBusiness && isReceiverBusiness) {
      newMessage = await Message.create({
        senderId: isSenderBusiness.userId,
        receiverId: isReceiverBusiness.userId,
        senderType: "business",
        receiverType: "business",
        content,
      });
    } else if (isSenderBusiness && !isReceiverBusiness) {
      newMessage = await Message.create({
        senderId: isSenderBusiness.userId,
        receiverId: finalReceiverId,
        senderType: "business",
        receiverType: "user",
        content,
      });
    } else if (!isSenderBusiness && isReceiverBusiness) {
      newMessage = await Message.create({
        senderId: userId,
        receiverId: isReceiverBusiness.userId,
        senderType: "user",
        receiverType: "business",
        content,
      });
    } else {
      newMessage = await Message.create({
        senderId: userId,
        receiverId: finalReceiverId,
        senderType: "user",
        receiverType: "user",
        content,
      });
    }

    io.to(`user-${userId}`).emit("receiveMessageBusiness", {
      id: newMessage.id,
      senderId: newMessage.senderId,
      receiverId: newMessage.receiverId,
      content: newMessage.content,
      createdAt: newMessage.createdAt,
    });

    io.to(`user-${finalReceiverId}`).emit("receiveMessageBusiness", {
      id: newMessage.id,
      senderId: newMessage.senderId,
      receiverId: newMessage.receiverId,
      content: newMessage.content,
      createdAt: newMessage.createdAt,
    });
  } catch (error) {
    console.error("Lỗi gửi tin nhắn:", error);
    socket.emit("message_error", {
      message: "Lỗi khi gửi tin nhắn",
      error: error.message,
    });
  }
};

const GetCommentByPostId = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const comments = await Comment.findAll({
      where: { postId },
      include: [
        {
          model: User,
          attributes: ["id", "username", "avatar"],
        },
      ],
      order: [["createdAt", "ASC"]],
    });
    return res.status(200).json({
      message: comments,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const GetMessageByUserId = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const messages = await Message.findAll({
      where: {
        [Op.or]: [{ senderId: userId }, { receiverId: userId }],
      },
      order: [["createdAt", "ASC"]],
    });

    if (!messages) {
      return res.status(404).json({
        messages: "Not Found",
      });
    }

    return res.status(200).json({
      message: messages,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const GetMessageBusiness = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const messages = await Message.findAll({
      where: {
        [Op.and]: [
          {
            [Op.or]: [{ senderId: userId }, { receiverId: userId }],
          },
          {
            [Op.or]: [{ senderType: "business" }, { receiverType: "business" }],
          },
        ],
      },
      order: [["createdAt", "ASC"]],
    });

    const formattedMessages = messages.map((msg) => ({
      id: msg.id,
      senderId: msg.senderId,
      receiverId: msg.receiverId,
      content: msg.content,
      createdAt: msg.createdAt,
    }));

    return res.status(200).json({
      message: formattedMessages,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const UploadFile = async (req, res, next) => {
  try {
    const file = req.file;
    if (file) {
      return res.status(200).json({
        success: true,
        fileName: req.file.filename,
      });
    } else {
      return res.status(200).json({
        message: "not found",
      });
    }
  } catch (error) {
    next(error);
  }
};

const DownloadFile = async (req, res, next) => {
  try {
    const filename = req.params.filename;
    path.join(__dirname, "../generate/encode_query.py");
    const filePath = path.join(__dirname, "../uploads", filename);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: filePath });
    }

    res.download(filePath, filename);
  } catch (error) {
    next(error);
  }
};

const HandleNotification = async (io, socket, data) => {
  try {
    let { receiver_id, type, title, content, is_read } = data;

    console.log(receiver_id, type, title, content, is_read);
    const senderId = socket.user.id;

    if (!receiver_id) {
      const admin = await User.findOne({ where: { role: "admin" } });
      console.log("dhajkshdjashdkashdjaksd", admin.id)
      if (!admin) return;
      receiver_id = admin.id;
    }

    console.log("dahsjdjhaskdhasdhjskad", receiver_id);

    
    const newNotification = await Notification.create({
      receiver_id,
      sender_id: senderId,
      type,
      title,
      content,
      is_read,
    });

    const notificationWithSender = await Notification.findOne({
      where: { id: newNotification.id },
      include: [
        {
          model: User,
          as: "sender",
          attributes: ["id", "username", "avatar"],
        },
      ],
    });

    io.to(`user-${receiver_id}`).emit("receiveNotification", {
      id: newNotification.id,
      sender: {
        id: notificationWithSender.sender.id,
        username: notificationWithSender.sender.username,
        avatar: notificationWithSender.sender.avatar,
      },
      type: newNotification.type,
      content: newNotification.content,
      createdAt: newNotification.createdAt,
      is_read: newNotification.is_read,
    });
  } catch (error) {
    console.error("HandleNotification error:", error);
  }
};

const ReadNotification = async (io, socket, data) => {
  try {
    const { id } = data;
    const notification = await Notification.findOne({
      where: {
        id,
      },
    });

    if (!notification) {
      return;
    }

    await notification.update({ is_read: true });
  } catch (error) {
    console.error(error);
    return;
  }
};

const GetNotification = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const notifications = await Notification.findAll({
      where: {
        receiver_id: userId,
        is_read: false,
      },
      include: [
        {
          model: User,
          as: "sender",
          attributes: ["id", "username", "avatar"],
        },
      ],
    });
    if (!notifications) {
      return res.status(404).json({
        message: "not found",
      });
    }

    return res.status(200).json({
      message: notifications,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
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
};
