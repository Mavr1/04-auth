exports.validate = function validate(scheme, reqPart = 'body') {
  return (req, res, next) => {
    const validationResult = scheme.validate(req[reqPart]);
    if (validationResult.error) {
      return res
        .status(400)
        .json({ message: validationResult.error.details[0].message });
    }

    next();
  };
};
