const { Router } = require('express');
const {
  Types: { ObjectId },
} = require('mongoose');
const Joi = require('joi');
const { validate } = require('../helpers/validate');
const {
  getContacts,
  getContact,
  addContact,
  removeContact,
  updateContact,
} = require('./contacts.controller');
const { authorize } = require('../auth/auth.controller');

const router = Router();

const contactIdSchema = Joi.object({
  contactId: Joi.string()
    .custom((value, helpers) => {
      const isValidObjectId = ObjectId.isValid(value);
      if (!isValidObjectId) {
        return helpers.error('Invalid user id. Must be object id');
      }

      return value;
    })
    .required(),
});

const addContactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  password: Joi.string().required(),
});

const updateContactSchema = Joi.object({
  name: Joi.string(),
  phone: Joi.string(),
  password: Joi.string(),
}).min(1);

router.get('/', getContacts);

router.get('/:contactId', validate(contactIdSchema, 'params'), getContact);

router.post('/', authorize, validate(addContactSchema), addContact);

router.delete(
  '/:contactId',
  authorize,
  validate(contactIdSchema, 'params'),
  removeContact
);

router.patch(
  '/:contactId',
  authorize,
  validate(contactIdSchema, 'params'),
  validate(updateContactSchema),
  updateContact
);

exports.contactsRouter = router;
