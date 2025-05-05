import Contact from "../models/contact.js";

export const listContacts = (owner, { skip = 0, limit = 20 } = {}) => Contact.find({owner}, '-createdAt -updatedAt').skip(Number(skip))
    .limit(Number(limit));

export const getContactById = id => Contact.findById(id);

export const addContact = data => Contact.create(data);

export const removeContact = id => Contact.findByIdAndDelete(id);

export const updateContact = (id, data) => Contact.findByIdAndUpdate(id, data);

export const  updateStatusContact = (id, data) => Contact.findByIdAndUpdate(id, data);
