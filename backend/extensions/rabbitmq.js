const amqp = require("amqplib");
require("dotenv").config();

let connection = null;
let channel = null;

const connect = async () => {
  try {
    const rabbitMqUrl = process.env.RABBITMQ_URL || "amqp://guest:guest@localhost:5672";
    console.log(`Connecting to RabbitMQ at ${rabbitMqUrl}...`);
    
    connection = await amqp.connect(rabbitMqUrl);
    channel = await connection.createChannel();
    
    console.log("RabbitMQ Connected Successfully");

    connection.on("error", (err) => {
      console.error("RabbitMQ connection error:", err);
      setTimeout(connect, 5000); // Tự động kết nối lại sau 5s
    });

    connection.on("close", () => {
      console.warn("RabbitMQ connection closed. Attempting to reconnect...");
      setTimeout(connect, 5000);
    });

    return channel;
  } catch (error) {
    console.error("Failed to connect to RabbitMQ:", error.message);
    console.log("Retrying in 5 seconds...");
    setTimeout(connect, 5000);
  }
};

const getChannel = () => channel;

const close = async () => {
  try {
    if (channel) await channel.close();
    if (connection) await connection.close();
    console.log("RabbitMQ connection closed cleanly.");
  } catch (error) {
    console.error("Error closing RabbitMQ connection:", error);
  }
};

const publishToQueue = async (queueName, message) => {
  try {
    if (!channel) {
      throw new Error("RabbitMQ Channel is not initialized");
    }
    await channel.assertQueue(queueName, { durable: true });
    
    const msgBuffer = Buffer.from(JSON.stringify(message));
    const success = channel.sendToQueue(queueName, msgBuffer, { persistent: true });
    
    return success;
  } catch (error) {
    console.error(`Error publishing to queue ${queueName}:`, error);
    throw error;
  }
};

const consumeFromQueue = async (queueName, callback, prefetchCount = 1) => {
  try {
    if (!channel) {
      throw new Error("RabbitMQ Channel is not initialized");
    }
    await channel.assertQueue(queueName, { durable: true });
    await channel.prefetch(prefetchCount);

    console.log(`Waiting for messages in queue: ${queueName}`);

    channel.consume(queueName, async (msg) => {
      if (msg !== null) {
        try {
          const content = JSON.parse(msg.content.toString());
          const isSuccess = await callback(content);
          
          if (isSuccess) {
            channel.ack(msg);
          } else {
            const retryCount = content._retryCount || 0;
            if (retryCount < 3) {
              console.log(`[!] Tác vụ thất bại, thử lại lần (${retryCount + 1}/3)...`);
              content._retryCount = retryCount + 1;
              
              // Xóa tin nhắn cũ khỏi hàng đợi
              channel.ack(msg);
              
              // Gửi lại tin nhắn mới kèm theo biến đếm tăng lên 1
              channel.sendToQueue(queueName, Buffer.from(JSON.stringify(content)), { persistent: true });
            } else {
              console.error(`[X] Tác vụ thất bại quá 3 lần, loại bỏ hoàn toàn tin nhắn!`);
              // Bỏ qua hoàn toàn tin nhắn này để không kẹt hàng đợi
              channel.nack(msg, false, false);
            }
          }
        } catch (error) {
          console.error("Error processing message:", error);
          channel.nack(msg, false, false); // discard if hard error like parse error
        }
      }
    });
  } catch (error) {
    console.error(`Error consuming from queue ${queueName}:`, error);
    throw error;
  }
};

module.exports = {
  connect,
  getChannel,
  close,
  publishToQueue,
  consumeFromQueue,
};
