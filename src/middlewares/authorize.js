const authorize = (role) => {
  return (req, res, next) => {
    if (!role.includes(req.user?.role?.toLowerCase())) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
};

module.exports = { authorize };
