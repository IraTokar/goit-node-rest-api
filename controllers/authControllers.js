import User from "../models/user.js";
import HttpError from "../helpers/HttpError.js";
import ctrlWrapper from "../helpers/ctrlWrapper.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import fs from 'fs/promises';
import path from "path";
import authRouter from "../routes/authRouter.js";
import gravatar from 'gravatar'; 


const { SECRET_KEY } = process.env;

const avatarsPath = path.resolve('public', 'avatars');

const register = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user) {
        throw HttpError(409, 'Email already in use')
    };

    const hashPassword = await bcrypt.hash(password, 10);
    
    const avatarURL = gravatar.url(email);

    const newUser = User.create({ ...req.body, password: hashPassword, avatarURL });

    res.status(201).json({
        email: newUser.email,
        subscription: newUser.subscription,
    })
};

const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        throw ctrlWrapper(401, 'Email or password is wrong');
    };

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

    await fs.rename(oldPath, newPath);

    const avatarURL = path.join('avatars', filename);
    await User.findByIdAndUpdate(_id, { avatarURL });
    return res.json({ avatarURL });
}


export default {
    register: ctrlWrapper(register),
    login: ctrlWrapper(login),
    getCurrent: ctrlWrapper(getCurrent),
    logout: ctrlWrapper(logout),
    updateAvatar: ctrlWrapper(updateAvatar),
};


