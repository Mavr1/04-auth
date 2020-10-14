const { Router } = require('express');
const Joi = require('joi');
const { register, logIn, logOut, authorize } = require('./auth.controller.js');
const { validate } = require('../helpers/validate');
const { upload, addAvatar } = require('../helpers/helpers.js');

const router = Router();

const authSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  avatar: Joi.string(),
});

router.post(
  '/register',
  upload.single('avatar'),
  addAvatar,
  validate(authSchema),
  register
);

router.post('/login', validate(authSchema), logIn);

router.post('/logout', authorize, logOut);

exports.authRouter = router;
