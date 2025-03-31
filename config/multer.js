import multer from "multer";

const storage = multer.memoryStorage(); // Store files in memory as buffers

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max file size
});

export { upload };
