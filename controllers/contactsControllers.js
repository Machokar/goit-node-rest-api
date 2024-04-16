import httpError from "../helpers/HttpError.js";
import { Contact } from "../models/UseModels.js";
async function getAllContacts(req, res, next) {
  try {
    const allContacts = await Contact.find();
    if (!allContacts) {
      throw httpError(404);
    }
    res.status(200).json(allContacts);
  } catch (error) {
    next(error);
  }
}
async function getOneContact(req, res, next) {
  try {
    const { id } = req.params;
    const allContacts = await Contact.findOne({ _id: id });
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
    const allContacts = await Contact.findByIdAndDelete({ _id: id });
    if (!id) {
      throw httpError(404);
    }
    res.status(200).json(allContacts);
  } catch (error) {
    next(error);
  }
}
async function createContact(req, res, next) {
  try {
    const { name, email, phone, favorite } = req.body;
    const createContact = await Contact.create({
      name,
      email,
      phone,
      favorite,
    });
    res.status(201).json(createContact);
  } catch (error) {
    next(error);
  }
}
async function updateContact(req, res, next) {
  try {
    const { id } = req.params;
    const editContacts = req.body;
    const data = await Contact.findByIdAndUpdate({ _id: id }, editContacts);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
}
async function updateFavoriteContact(req, res, next) {
  try {
    const { id } = req.params;
    const favorite = req.body;
    const data = await Contact.findByIdAndUpdate(
      { _id: id },
      { favorite: favorite }
    );
    if (!data) {
      throw httpError(404);
    }
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
  updateFavoriteContact,
};
