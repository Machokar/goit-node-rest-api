import multer from "multer";
import path from "path";

const tempDir = path.join(process.cwd(), "tmp");

const multerConfig = multer.diskStorage({
  destination: tempDir,
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const update = multer({
  storage: multerConfig,
});

export default update;
