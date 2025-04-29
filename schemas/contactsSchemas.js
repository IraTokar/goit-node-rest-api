import Joi from "joi";
import { emailRegexp,phoneRegexp } from "../constants/contactConstans.js";

export const createContactSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().pattern(emailRegexp).required(),
    phone: Joi.string().pattern(phoneRegexp).required(),
    favorite: Joi.boolean(),
})

export const updateContactSchema = Joi.object({
    name: Joi.string(),
    email: Joi.string().pattern(emailRegexp),
    phone: Joi.string().pattern(phoneRegexp),
})

export const updateFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required(),
});