const { deleteFile } = require('./helpers');

exports.validate = (scheme, reqPart = 'body') => {
  return async (req, res, next) => {
    const validationResult = scheme.validate(req[reqPart]);
    if (validationResult.error) {
      await deleteFile(req.body.avatar);
      return res
        .status(400)
        .json({ message: validationResult.error.details[0].message });
    }

    next();
  };
};
