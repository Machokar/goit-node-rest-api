import {
  addContact,
  getContactById,
  listContacts,
  removeContact,
  updateContactbyId,
} from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";
async function getAllContacts(req, res, next) {
  try {
    const AllContacts = await listContacts();
    res.status(200).json(AllContacts);
  } catch (error) {
    next(error);
  }
}
async function getOneContact(req, res, next) {
  try {
    const { id } = req.params;
    const AllContacts = await getContactById(id);
    if (!AllContacts) {
      throw HttpError(404);
    }
    res.status(200).json(AllContacts);
  } catch (error) {
    next(error);
  }
}
async function deleteContact(req, res, next) {
  try {
    const { id } = req.params;
    const AllContacts = await removeContact(id);
    res.status(200).json(AllContacts);
  } catch (error) {
    next(error);
  }
}
async function createContact(req, res, next) {
  try {
    const { name, email, phone } = req.body;
    const CreateContact = await addContact(name, email, phone);
    res.status(201).json(CreateContact);
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
