const { Router } = require('express');
const Joi = require('joi');
const { authorize } = require('../auth/auth.controller');
const { upload, addAvatar } = require('../helpers/helpers');
const { validate } = require('../helpers/validate');
const { updateUser } = require('./user.controller');

const router = Router();

const userSchema = Joi.object({
  subscription: Joi.string().valid('free', 'pro', 'premium'),
  avatar: Joi.string(),
});

router.patch(
  '/avatars',
  authorize,
  upload.single('avatar'),
  addAvatar,
  validate(userSchema),
  updateUser
);

router.patch('/:userId', authorize, validate(userSchema), updateUser);

exports.userRouter = router;
