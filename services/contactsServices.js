import { promises as fs } from "fs";
import path from "path";

const contactsPath = path.join("db", "contacts.json");

async function listContacts() {
  try {
    const readContacts = await fs.readFile(contactsPath);
    return JSON.parse(readContacts);
  } catch (error) {
    console.log(error.message);
  }
}

async function getContactById(contactId) {
  try {
    const contacts = await listContacts();
    return contacts.find((contact) => contact.id === contactId) || null;
  } catch (error) {
    console.log(error.message);
  }
}

async function removeContact(contactId) {
  try {
    const contacts = await listContacts();
    const removedContactIndex = contacts.findIndex(
      (contact) => contact.id === contactId
    );
    if (removedContactIndex !== -1) {
      const removedContact = contacts.splice(removedContactIndex, 1)[0];
      await fs.writeFile(contactsPath, JSON.stringify(contacts));
      return removedContact;
    } else {
      return null;
    }
  } catch (error) {
    console.log(error.message);
  }
}

async function addContact(name, email, phone) {
  try {
    const contacts = await listContacts();
    const newContact = { id: Date.now(), name, email, phone };
    contacts.push(newContact);
    await fs.writeFile(contactsPath, JSON.stringify(contacts));
    return newContact;
  } catch (error) {
    console.log(error.message);
  }
}
async function updateContactbyId(id, newData) {
  try {
    const data = await fs.readFile(contactsPath);
    let contacts = JSON.parse(data);

    const index = contacts.findIndex((contact) => contact.id === id);

    if (index === -1) {
      return null;
    }

    contacts[index] = {
      ...contacts[index],
      ...newData,
    };

    await fs.writeFile(contactsPath, JSON.stringify(contacts));
    return contacts[index];
  } catch (error) {
    console.log(error);
  }
}

export {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContactbyId,
};
