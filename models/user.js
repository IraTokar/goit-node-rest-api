import { Schema, model } from "mongoose";

import handleSaveError from "./hooks.js";
import { emailRegexp } from "../constants/contactConstans.js";


const userSchema = new Schema(
    {
        password: {
            type: String,
            minlength: 6,
            required: [true, 'Password is required'],
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            match: emailRegexp,
            unique: true,
        },
        subscription: {
            type: String,
            enum: ["starter", "pro", "business"],
            default: "starter"
        },
        token: {
            type: String,
            default: null,
        },
        avatarURL: {
            type: String,
            // required: true,
        }
    }, { versionKey: false, timestamps: true }
);


userSchema.post('save', handleSaveError);
userSchema.post('findOneAndUpdate', handleSaveError);

const User = model('user', userSchema);

export default User;    


// const updateAvatar = async (req, res) => {
//     const { _id } = req.user;
//     const { path: oldPath, originalname } = req.file;

//     const filename = `${_id}_${originalname}`;
  
//     const newPath = path.join(avatarsPath, filename);
  
//     Jimp.read(oldPath, (err, img) => {
//       if (err) throw err;
//       img.resize(250, 250).write(newPath);
//     });
  
//     await fs.rename(oldPath, newPath);
  
//     const avatarURL = path.join('avatars', filename);
//     await User.findByIdAndUpdate(_id,{ avatarURL});
//     return res.json({ avatarURL });
//   };

  