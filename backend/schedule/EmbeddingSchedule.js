const { spawn } = require("child_process");
const path = require("path");
const { exportProductsJson } = require("../controllers/SuggestionController");

const generateEmbeddingsPyPath = path.join(__dirname, "../generate/generate_embeddings.py");
const generateRedisVectorPyPath = path.join(__dirname, "../generate/generate_redisvector.py");

const runPythonScript = (scriptPath) => {
  return new Promise((resolve, reject) => {
    console.log(`[Embedding] Đang chạy: ${path.basename(scriptPath)}...`);
    const python = spawn("python", [scriptPath]);
    let output = "";
    let errorOutput = "";

    python.stdout.on("data", (data) => {
      output += data.toString();
      process.stdout.write(data); // In log Python ra console Node.js
    });

    python.stderr.on("data", (data) => {
      errorOutput += data.toString();
      process.stderr.write(data);
    });

    python.on("close", (code) => {
      if (code !== 0) {
        console.error(`[Embedding] Script ${path.basename(scriptPath)} thất bại (exit code ${code})`);
        return reject(new Error(errorOutput));
      }
      console.log(`[Embedding] Script ${path.basename(scriptPath)} hoàn thành.`);
      resolve(output);
    });
  });
};

const EmbeddingSchedule = async () => {
  const startTime = Date.now();
  console.log("[Embedding] ===== Bắt đầu chạy Embedding Cronjob =====");

  try {
    // Bước 1: Lọc sản phẩm mới và ghi ra file JSON
    const newCount = await exportProductsJson();
    if (newCount === 0) {
      console.log("[Embedding] ===== Cronjob kết thúc sớm: không có gì cần xử lý =====");
      return;
    }

    // Bước 2: Chạy generate_embeddings.py để encode vector
    await runPythonScript(generateEmbeddingsPyPath);

    // Bước 3: Chạy generate_redisvector.py để đẩy vector vào Redis
    await runPythonScript(generateRedisVectorPyPath);

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`[Embedding] ===== Hoàn thành! Đã xử lý ${newCount} sản phẩm trong ${duration}s =====`);
  } catch (error) {
    console.error("[Embedding] ===== Cronjob thất bại:", error.message, "=====");
  }
};

module.exports = EmbeddingSchedule;
