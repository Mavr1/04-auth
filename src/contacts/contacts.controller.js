const { ContactModel } = require('./contacts.model');
const mongoose = require('mongoose');

exports.getContacts = async (req, res, next) => {
  try {
    const contacts = await ContactModel.find();

    res.status(200).json(contacts);
  } catch (error) {
    next(error);
  }
};

exports.getContact = async (req, res, next) => {
  const { contactId } = req.params;

  try {
    const contact = await ContactModel.findById(contactId);
    if (!contact) {
      res.status(404).json({ message: 'Contact not found' });
      return;
    }

    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};

exports.addContact = async (req, res, next) => {
  try {
    const existingUser = await ContactModel.findOne({ email: req.body.email });

    if (existingUser) {
      return res.status(409).send('User with such email already exists');
    }

    const newContact = await ContactModel.create(req.body);
    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
};

exports.removeContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;

    const contact = await ContactModel.findByIdAndDelete(contactId);
    if (!contact) {
      res.status(404).json({ message: 'Contact not found' });
      return;
    }

    res.status(200).json({ message: 'Contact deleted' });
  } catch (error) {
    next(error);
  }
};

exports.updateContact = async (req, res, next) => {
  const { contactId } = req.params;

  try {
    const updatedContact = await ContactModel.findByIdAndUpdate(
      contactId,
      req.body,
      {
        new: true,
      }
    );

    if (!updatedContact) {
      res.status(404).json({ message: 'Contact not found' });
      return;
    }

    res.status(200).json(updatedContact);
  } catch (error) {
    next(error);
  }
};
