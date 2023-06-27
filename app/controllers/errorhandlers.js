exports.badPathController = (_, res) => {
  res.status(404).send({ message: 'invalid path' });
};

exports.customErrorController = (err, req, res, next) => {
  if (err.message) {
    res.status(err.status).send({ message: err.message });
  } else next(err);
};

exports.psqlErrorController = (err, req, res, next) => {
  if (err.code === '22PO2') {
    res.status(400).send({ message: 'bad request' });
  } else next(err);
};

exports.serverErrorController = (err, req, res, next) => {
  res.status(500).send({ message: 'server error' });
};
