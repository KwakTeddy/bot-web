var passport = require('passport');

module.exports.signin = function(req, res, next)
{
    console.log('머지 : ', req.body);
    passport.authenticate('local', function (err, user, info)
    {
        if (err || !user)
        {
            res.status(400).send(info);
        }
        else
        {
            // Remove sensitive data before login
            user.password = undefined;
            user.salt = undefined;

            req.login(user, function (err)
            {
                if (err)
                {
                    res.status(400).send(err);
                }
                else
                {
                    res.cookie('login', true);
                    res.json(user);
                }
            });
        }
    })(req, res, next);
};
