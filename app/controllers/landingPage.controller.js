exports.landingPageController = (_, res) => {
  return res.status(200).send({
    message: 'welcome!  Send get request to /api for list of endpoints',
  });
};
