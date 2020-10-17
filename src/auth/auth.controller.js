const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const { UserModel } = require('../users/user.model');
const { promiseHandler, deleteFile } = require('../helpers/helpers');

exports.register = async (req, res, next) => {
  const { email, password, avatar } = req.body;

  const [errUser, existingUser] = await promiseHandler(
    UserModel.findOne({ email })
  );

  if (existingUser) {
    await deleteFile(req.body.avatar);
    return res.status(409).json({ message: 'Email in use' });
  }

  const passwordHash = await bcryptjs.hash(
    password,
    Number(process.env.BCRYPT_SALT_ROUNDS)
  );

  const [errNewUser, newUser] = await promiseHandler(
    UserModel.create({
      email,
      password: passwordHash,
      avatarUrl: 'http://localhost:3000/images/' + avatar,
    })
  );

  res.status(201).json({
    user: {
      id: newUser._id,
      email: newUser.email,
      subscription: newUser.subscription,
    },
  });

  if (errUser || errNewUser) {
    next(errUser || errNewUser);
  }
};

exports.logIn = async (req, res, next) => {
  const { email, password } = req.body;

  const [errUser, user] = await promiseHandler(UserModel.findOne({ email }));

  if (!user) {
    return res.status(401).json({ message: 'Email or password is wrong' });
  }

  const isPasswordCorrect = await bcryptjs.compare(password, user.password);
  if (!isPasswordCorrect) {
    return res.status(401).json({ message: 'Email or password is wrong' });
  }

  const token = jwt.sign({ uid: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  const [errLoggedIn, loggedInUser] = await promiseHandler(
    UserModel.findByIdAndUpdate(
      user._id,
      { token },
      {
        new: true,
      }
    )
  );

  if (errUser || errLoggedIn) {
    next(errUser || errLoggedIn);
  }

  res.status(200).json({
    token,
    user: {
      email: loggedInUser.email,
      subscription: loggedInUser.subscription,
    },
  });
};

exports.authorize = async (req, res, next) => {
  const token = req.header('Authorization');
  const payload = jwt.verify(token, process.env.JWT_SECRET);

  const [errUser, user] = await promiseHandler(UserModel.findById(payload.uid));

  if (errUser || !user) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  req.user = user;
  next();
};

exports.logOut = async (req, res, next) => {
  const [err] = await promiseHandler(
    UserModel.findByIdAndUpdate(
      req.user._id,
      { token: '' },
      {
        new: true,
      }
    )
  );

  if (err) {
    return res.status(401).json({ message: err });
  }

  return res.status(204).json();
};
