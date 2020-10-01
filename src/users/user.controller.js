const { UserModel } = require('./user.model');

exports.updateSubscription = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(userId, req.body, {
      new: true,
    });

    if (!updatedUser) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};
