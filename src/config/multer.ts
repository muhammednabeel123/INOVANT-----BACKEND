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

cloudinary.v2.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
})

// Function for to cloudinary
export const cloudinaryImageUploadMethod = async (file: any) => {
  return new Promise(resolve => {
    cloudinary.v2.uploader.upload(file, (_err: any, res: any) => {
      resolve(res.secure_url)
    })
  })
}

export const upload = multer({ storage: storage }).array('images');