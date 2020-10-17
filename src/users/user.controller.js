const { UserModel } = require('./user.model');
const { promiseHandler } = require('../helpers/helpers');
const jwt = require('jsonwebtoken');

exports.updateUser = async (req, res, next) => {
  const token = req.header('Authorization');
  const payload = jwt.verify(token, process.env.JWT_SECRET);
  const userId = payload.uid;

  const [error, updatedUser] = await promiseHandler(
    UserModel.findByIdAndUpdate(userId, req.body, {
      new: true,
    })
  );

  if (!updatedUser) {
    res.status(404).json({ message: 'User not found' });
    return;
  }

  getDataForResponse = (userData) => ({
    subscription: userData.subscription,
    _id: userData._id,
    email: userData.email,
    avatarUrl: userData.avatarUrl,
  });

  res.status(200).json(getDataForResponse(updatedUser));

  if (error) {
    next(error);
  }
};
