var passport = require('passport');

module.exports.signin = function(req, res, next)
{
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

module.exports.signout = function (req, res)
{
    console.log('머야 : ');

    req.logout();
    req.session.destroy();
    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');

    if(req.query['path'])
    {
        res.redirect(req.query['path']);
    }
    else if(req.query['redirect_to'])
    {
        res.redirect((req.query['redirect_to']));
    }
    else
    {
        res.redirect('/');
    }
};
