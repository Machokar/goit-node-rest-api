import multer from "multer";
import path from "path";

const multerConfig = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join("tmp"));
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const update = multer({
  storage: multerConfig,
});

export default update;
