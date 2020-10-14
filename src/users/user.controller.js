const { UserModel } = require('./user.model');
const promiseHandler = require('../helpers/helpers');

exports.updateSubscription = async (req, res, next) => {
  const { userId } = req.params;

  const [error, updatedUser] = await promiseHandler(
    UserModel.findByIdAndUpdate(userId, req.body, {
      new: true,
    })
  );

  if (!updatedUser) {
    res.status(404).json({ message: 'User not found' });
    return;
  }

  res.status(200).json(updatedUser);

  if (error) {
    next(error);
  }
};
