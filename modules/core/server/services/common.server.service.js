module.exports.isAdmin = function(user)
{
    var isAdmin = false;
    for(var i=0; i<user.roles.length; i++)
    {
        if(user.roles[i] == 'admin')
        {
            isAdmin = true;
            break;
        }
    }

    return isAdmin;
};
