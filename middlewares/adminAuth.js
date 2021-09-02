module.exports = (req, res, next) => {
  const role = req.role;
  if (role !== "4") {
    return res.status(401).send({ error: "You are not authorised to perform this action" });
  }
  next();
};
