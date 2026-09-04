const { v2: cloudinary } = require("cloudinary");
require("dotenv").config();

// Cấu hình Cloudinary — dùng chung cho toàn backend.
// Nếu có CLOUDINARY_URL thì cloudinary tự đọc config từ URL đó.
if (process.env.CLOUDINARY_URL) {
  cloudinary.config(true);
} else {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

/**
 * Phân tích public_id (kèm resource_type) từ một URL Cloudinary hoặc public_id trần.
 * Trả về { publicId, resourceType } hoặc null nếu không phải tài nguyên Cloudinary.
 */
const parseCloudinaryId = (value) => {
  if (!value || typeof value !== "string") return null;

  // Ví dụ: https://res.cloudinary.com/<cloud>/image/upload/v123/snapmart/abc.png
  const urlMatch = value.match(
    /res\.cloudinary\.com\/[^/]+\/([a-z]+)\/upload\/(?:v\d+\/)?(.+)$/i,
  );
  if (urlMatch) {
    const resourceType = urlMatch[1];
    const publicId = urlMatch[2].replace(/\.[^.]+$/, "");
    return { publicId, resourceType };
  }

  // public_id trần (vd: snapmart/abc) — loại bỏ các URL http/https không phải Cloudinary.
  if (/^https?:\/\//i.test(value)) return null;
  return { publicId: value.replace(/\.[^.]+$/, ""), resourceType: "auto" };
};

/**
 * Xóa tài nguyên trên Cloudinary một cách an toàn.
 * Chỉ xóa khi giá trị là URL Cloudinary hoặc public_id hợp lệ;
 * với giá trị khác (null, chuỗi rỗng, URL http khác...) sẽ bỏ qua và trả về null.
 */
const deleteCloudinaryAsset = async (value) => {
  const parsed = parseCloudinaryId(value);
  if (!parsed) return null;

  try {
    const result = await cloudinary.uploader.destroy(parsed.publicId, {
      resource_type: parsed.resourceType,
      invalidate: true,
    });
    return result;
  } catch (error) {
    console.error("Cloudinary delete error:", error.message);
    return null;
  }
};

module.exports = {
  cloudinary,
  parseCloudinaryId,
  deleteCloudinaryAsset,
};