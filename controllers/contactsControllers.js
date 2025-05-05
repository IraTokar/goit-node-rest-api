import * as contactsService from '../services/contactsServices.js';
import HttpError from '../helpers/HttpError.js';
import ctrlWrapper from '../helpers/ctrlWrapper.js';



export const getAllContacts = async (req, res) => {
      const { _id: owner } = req.user;
  
  const { page = 1, limit = 20 } = req.query;
  const skip = (page - 1) * limit;

      const result = await contactsService.listContacts(owner,{skip,limit}).populate("owner", "subscription email");
  
        if (!result) {
            throw HttpError(404);
        }
        res.status(200).json(result);    
};

export const getOneContact = async (req, res) => {
        const { id } = req.params;  
        const { _id: owner } = req.user;

        const result = await contactsService.getContactById({ _id: id, owner });
        if (!result) {
            throw HttpError(404);
        }
        res.status(200).json(result);
};

export const deleteContact = async (req, res) => {
        const { id } = req.params;   
        const { _id: owner } = req.user;
  
        const result = await contactsService.removeContact({ _id: id, owner });
        if (!result) {
            throw HttpError(404);
        }
        res.status(200).json(result);
};

export const createContact = async (req, res) => {
        const { _id: owner } = req.user;
        const result = await contactsService.addContact({...req.body,owner});
        res.status(201).json(result)
};

export const updateContact = async (req, res) => {
        const { id } = req.params;
        const { _id: owner } = req.user;
        const result = await contactsService.updateContact({ _id: id, owner }, req.body);
        if (!result) {
            throw HttpError(404);
        }
        res.json(result);
};

const updateStatusContact = async (req, res) => {
  const { id } = req.params;
  const { _id: owner } = req.user;
  const result = await contactsService.updateStatusContact({ _id: id, owner }, req.body);
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




