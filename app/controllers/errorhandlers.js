exports.badPathController = (_, res) => {
  res.status(404).send({ message: 'invalid path' });
};

exports.customErrorController = (err, req, res, next) => {
  if (err.message && err.status) {
    res.status(err.status).send({ message: err.message });
  } else next(err);
};

exports.psqlErrorController = (err, req, res, next) => {
  if (err.code === '22P02') {
    res.status(400).send({ message: 'bad request' });
  } else if (err.code === '23503') {
    res.status(400).send({ message: err.detail });
  } else next(err);
};

exports.serverErrorController = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ message: 'server error' });
};
