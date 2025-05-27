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
            required: true,
        },
        verify: {
            type: Boolean,
            default: false,
        },
        verificationToken: {
            type: String,
            required: [true, 'Verify token is required'],
            index: true,
          },
    }, { versionKey: false, timestamps: true }
);


userSchema.post('save', handleSaveError);
userSchema.post('findOneAndUpdate', handleSaveError);

const User = model('user', userSchema);

export default User;    