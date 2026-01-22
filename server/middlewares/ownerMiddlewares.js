const owner = (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required"
      });
    }
  
    if (req.user.role !== "owner") {
      return res.status(403).json({
        message: "Owner access only"
      });
    }
  
    next();
  };
  
  export default owner;
  