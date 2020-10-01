const { Router } = require('express');
const Joi = require('joi');
const { validate } = require('../helpers/validate');
const { updateSubscription } = require('./user.controller');

const router = Router();

const userSchema = Joi.object({
  subscription: Joi.string().valid('free', 'pro', 'premium').required(),
});

router.patch('/:userId', validate(userSchema), updateSubscription);

exports.userRouter = router;
