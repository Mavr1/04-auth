const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const { UserModel } = require('../users/user.model');

exports.register = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email in use' });
    }

    const passwordHash = await bcryptjs.hash(
      password,
      Number(process.env.BCRYPT_SALT_ROUNDS)
    );

    const newUser = await UserModel.create({
      email,
      password: passwordHash,
    });

    res.status(201).json({
      user: {
        id: newUser._id,
        email: newUser.email,
        subscription: newUser.subscription,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.logIn = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(403).json('Email or password is wrong');
    }

    const isPasswordCorrect = await bcryptjs.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(403).json('Email or password is wrong');
    }

    const token = jwt.sign({ uid: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    const loggedInUser = await UserModel.findByIdAndUpdate(
      user._id,
      { token },
      {
        new: true,
      }
    );

    res.status(200).json({
      token,
      user: {
        email: loggedInUser.email,
        subscription: loggedInUser.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.authorize = async (req, res, next) => {
  let payload;

  try {
    const token = req.header('Authorization');
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized', error });
  }

  const user = await UserModel.findById(payload.uid);
  if (!user) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  req.user = user;
  next();
};

exports.logOut = async (req, res, next) => {
  try {
    const loggedOutUser = await UserModel.findByIdAndUpdate(
      req.user._id,
      { token: '' },
      {
        new: true,
      }
    );

    res.status(204);
  } catch (error) {
    return res.status(401).json({ message: error });
  }
};
