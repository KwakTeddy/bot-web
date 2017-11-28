module.exports.core = function(req, res, next)
{
    if(req.user.roles.indexOf('admin') == -1)
      return res.status(401).end();

    next();
};
