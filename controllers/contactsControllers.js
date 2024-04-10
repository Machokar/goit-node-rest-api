import {
  addContact,
  getContactById,
  listContacts,
  removeContact,
  updateContactbyId,
} from "../services/contactsServices.js";
import httpError from "../helpers/HttpError.js";
async function getAllContacts(req, res, next) {
  try {
    const allContacts = await listContacts();
    res.status(200).json(allContacts);
  } catch (error) {
    next(error);
  }
}
async function getOneContact(req, res, next) {
  try {
    const { id } = req.params;
    const allContacts = await getContactById(id);
    if (!allContacts) {
      throw httpError(404);
    }
    res.status(200).json(allContacts);
  } catch (error) {
    next(error);
  }
}
async function deleteContact(req, res, next) {
  try {
    const { id } = req.params;
    const allContacts = await removeContact(id);
    res.status(200).json(allContacts);
  } catch (error) {
    next(error);
  }
}
async function createContact(req, res, next) {
  try {
    const { name, email, phone } = req.body;
    const createContact = await addContact(name, email, phone);
    res.status(201).json(createContact);
  } catch (error) {
    next(error);
  }
}
async function updateContact(req, res, next) {
  try {
    const { id } = req.params;
    const editContacts = req.body;
    const data = await updateContactbyId(id, editContacts);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
}
export {
  getAllContacts,
  getOneContact,
  createContact,
  deleteContact,
  updateContact,
};
