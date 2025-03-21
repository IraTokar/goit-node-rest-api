
import fs from 'fs/promises';
import path from 'path';
import { nanoid } from 'nanoid';

const contactsPath = path.resolve('db', 'contacts.json'); 

export const listContacts = async () => {
    const data = await fs.readFile(contactsPath);
    return JSON.parse(data);
};

export const getContactById = async (id) => {
    const contacts = await listContacts();
    return contacts.find(contact => contact.id === id) || null;
};

export const addContact = async (data) => {
    const contacts = await listContacts();
    const newContact = {
        id: nanoid(),
        ...data,
    };
    contacts.push(newContact);
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    return newContact;
};

export const removeContact = async (id) => {
    const contacts = await listContacts();
    const index = contacts.findIndex(contact => contact.id === id);
    if (index === -1) {
        return null;
    };
    const [result] = contacts.splice(index, 1);
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    return result;
};

// module.exports = {
//     listContacts,
//     getContactById,
//     addContact,
//     removeContact,
// };
