import { Schema, model } from "mongoose";
import handleSaveError from './hooks.js';

import { emailRegexp,phoneRegexp } from "../constants/contactConstans.js";

const contactSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Set name for contact'],
    },
    email: {
        type: String,
        match: emailRegexp,
    },
    phone: {
        type: String,
        match: phoneRegexp,
    },
    favorite: {
        type: Boolean,
        default: false,
    },
}, { versionKey: false, timestamps: true });

contactSchema.post('save', handleSaveError);
contactSchema.post('findOneAndDelete', handleSaveError);


const Contact = model('contact', contactSchema);

export default Contact;





