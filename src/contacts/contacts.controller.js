const { ContactModel } = require('./contacts.model');
const { promiseHandler } = require('../helpers/helpers');

exports.getContacts = async (req, res, next) => {
  const [error, contacts] = await promiseHandler(
    ContactModel.paginate(req.query.sub && { subscription: req.query.sub }, {
      page: req.query.page || 1,
      limit: req.query.limit || 5,
    })
  );

  res.status(200).json(contacts);

  if (error) {
    next(error);
  }
};

exports.getContact = async (req, res, next) => {
  const { contactId } = req.params;

  const [error, contact] = await promiseHandler(
    ContactModel.findById(contactId)
  );

  if (!contact) {
    res.status(404).json({ message: 'Contact not found' });
    return;
  }

  res.status(200).json(contact);

  if (error) {
    next(error);
  }
};

exports.addContact = async (req, res, next) => {
  const [errorUser, existingUser] = await promiseHandler(
    ContactModel.findOne({
      email: req.body.email,
    })
  );

  if (existingUser) {
    return res.status(409).send('User with such email already exists');
  }

  const [errorNewContact, newContact] = await ContactModel.create(req.body);
  res.status(201).json(newContact);

  if (errorUser || errorNewContact) {
    next(errorUser || errorNewContact);
  }
};

exports.removeContact = async (req, res, next) => {
  const { contactId } = req.params;

  const [error, contact] = await promiseHandler(
    ContactModel.findByIdAndDelete(contactId)
  );

  if (!contact) {
    res.status(404).json({ message: 'Contact not found' });
    return;
  }

  res.status(200).json({ message: 'Contact deleted' });

  if (error) {
    next(error);
  }
};

exports.updateContact = async (req, res, next) => {
  const { contactId } = req.params;

  const [error, updatedContact] = await promiseHandler(
    ContactModel.findByIdAndUpdate(contactId, req.body, {
      new: true,
    })
  );

  if (!updatedContact) {
    res.status(404).json({ message: 'Contact not found' });
    return;
  }

  res.status(200).json(updatedContact);

  if (error) {
    next(error);
  }
};
