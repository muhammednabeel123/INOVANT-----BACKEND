import multer from 'multer';
import cloudinary from 'cloudinary'

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'src/uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

export const upload = multer({ storage: storage }).array('images');
export const uploadSingle = multer({ storage: storage }).single('image');