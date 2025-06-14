import User from "../models/user.js";
import HttpError from "../helpers/HttpError.js";
import ctrlWrapper from "../helpers/ctrlWrapper.js";
import sendEmail from "../helpers/sendEmail.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import fs from 'fs/promises';
import path from "path";
import gravatar from 'gravatar'; 
import { Jimp } from "jimp";
import { nanoid } from "nanoid";


const { SECRET_KEY, BASE_URL } = process.env;

const avatarsPath = path.resolve('public', 'avatars');

const register = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user) {
        throw HttpError(409, 'Email already in use')
    };

    const hashPassword = await bcrypt.hash(password, 10);
    
    const avatarURL = gravatar.url(email);

    const verificationToken = nanoid();

    const newUser = User.create({ ...req.body, password: hashPassword, avatarURL, verificationToken });

    const verifyEmail = {
        to: email,
        subject: 'Verify email',
        html: `<a href= "${BASE_URL}/api/auth/verify/${verificationToken}" target="_blank">Click to verify email</a>`
    };

    await sendEmail(verifyEmail);

    res.status(201).json({
        email: newUser.email,
        subscription: newUser.subscription,
    })
};

const verifyEmail = async (req, res) => {
    const { verificationToken } = req.params;
    const user = await User.findOne({ verificationToken });
    if (!user) {
        throw HttpError (404, 'User not found')
    };

    await User.findByIdAndUpdate(user._id, { verify: true, verificationToken: "" });
    res.status(200).json({ message: "Verification successful" });
};

const resendVerifyEmail = async (req, res) => {
    const { email } = req.body;
    const user = User.findOne({ email });
    if (!user) {
        throw HttpError(400, 'Missing required field email')
    }
    if (user.verify) {
        throw HttpError(400, 'Verification has already been passed')
    }

    const verifyEmail = {
        to: email,
        subject: 'Verify email',
        html: `<a href= "${BASE_URL}/api/auth/verify/${user.verificationToken}" target="_blank">Click to verify email</a>`
    };

    await sendEmail(mail);

    res.status(200).json({
        message: "Verification email sent",
      });
}

const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        throw ctrlWrapper(401, 'Email or password is wrong');
    };

    if (!user.verify) {
        throw ctrlWrapper(401, 'Email not verified');
    }

    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) {
        throw ctrlWrapper(401, 'Email or password is wrong');
    };

    const payload = {
        id: user._id,
    };

    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '23h' });

    await User.findByIdAndUpdate(user._id, { token });


    res.json({
        token,
        user: {
            email: user.email,
            subscription: user.subscription,
        },
    })
};

const getCurrent = async (req, res) => {
    const { email, subscription } = req.user;
    res.json({
        email,
        subscription,
    })
};

const logout = async (req, res) => {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: '' });

    res.status(204).json();
};

const updateAvatar = async (req, res) => {
    const { _id } = req.user;
    const { path: oldPath, originalname } = req.file;

    const filename = `${_id}_${originalname}`;

    const newPath = path.join(avatarsPath, filename);

    Jimp.read(oldPath, (err, img) => {
    if (err) throw err;
        img
            .resize(250, 250)
            .write(newPath);
    });
    await fs.rename(oldPath, newPath);

    const avatarURL = path.join('avatars', filename);
    await User.findByIdAndUpdate(_id, { avatarURL });
    return res.json({ avatarURL });
}


export default {
    register: ctrlWrapper(register),
    verifyEmail: ctrlWrapper(verifyEmail),
    resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
    login: ctrlWrapper(login),
    getCurrent: ctrlWrapper(getCurrent),
    logout: ctrlWrapper(logout),
    updateAvatar: ctrlWrapper(updateAvatar), 
};


