import * as contactsService from '../services/contactsServices.js';
import HttpError from '../helpers/HttpError.js';
import ctrlWrapper from '../helpers/ctrlWrapper.js';


export const getAllContacts = async (req, res ) => {
      const result = await contactsService.listContacts();
        if (!result) {
            throw HttpError(404);
        }
        res.status(200).json(result);    
};

export const getOneContact = async (req, res) => {
        const { id } = req.params;   
        const result = await contactsService.getContactById(id);
        if (!result) {
            throw HttpError(404);
        }
        res.status(200).json(result);
};

export const deleteContact = async (req, res) => {
        const { id } = req.params;   
        const result = await contactsService.removeContact(id);
        if (!result) {
            throw HttpError(404);
        }
        res.status(200).json(result);
};

export const createContact = async (req, res) => {
        const result = await contactsService.addContact(req.body);
        res.status(201).json(result)
};

export const updateContact = async (req, res) => {
        const { id } = req.params;
        const result = await contactsService.updateContact(id, req.body);
        if (!result) {
            throw HttpError(404);
        }
        res.json(result);
};

const updateStatusContact = async (req, res) => {
  const { id } = req.params;
  const result = await contactsService.updateStatusContact(id, req.body);
  if (!result) {
    throw HttpError(404, `Contact ${id} Not found`);
  }
  res.status(200).json(result);
};

export default {
    getAllContacts: ctrlWrapper(getAllContacts),
    getOneContact: ctrlWrapper(getOneContact),
    createContact: ctrlWrapper(createContact),
    deleteContact: ctrlWrapper(deleteContact),
    updateContact: ctrlWrapper(updateContact),
    updateStatusContact: ctrlWrapper(updateStatusContact),
}