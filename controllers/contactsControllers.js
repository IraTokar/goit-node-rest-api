import * as contactsService from '../services/contactsServices.js';
import HttpError from '../helpers/HttpError.js';

export const getAllContacts = async (req, res, next ) => {
    try {
      const result = await contactsService.listContacts();
        if (!result) {
            throw HttpError(404);
        }
        res.status(200).json(result);
    } catch (error) {
        next(error);
    };
    
};

export const getOneContact = async (req, res, next) => {
    try {
        const { id } = req.params;   
      const result = await contactsService.getContactById(id);
        if (!result) {
            throw HttpError(404);
        }
        res.status(200).json(result);
    } catch (error) {
        next(error);
    };
};

export const deleteContact = async (req, res, next) => {
    try {
        const { id } = req.params;   
      const result = await contactsService.removeContact(id);
        if (!result) {
            throw HttpError(404);
        }
        res.status(200).json(result);
    } catch (error) {
        next(error);
    };};

export const createContact = (req, res) => {};

export const updateContact = (req, res) => {};
