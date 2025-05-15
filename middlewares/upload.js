import multer from "multer";
import path from 'path';

// import HttpError from "../helpers/HttpError";

const destination = path.resolve('temp');

const multerStorage = multer.diskStorage({
    destination,
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({
    storage: multerStorage,
});

export default upload;