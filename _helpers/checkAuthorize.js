export default function authorize(roles = []) {
    // roles param can be a single role string (e.g. Role.User or 'User') 
    // or an array of roles (e.g. [Role.Admin, Role.User] or ['Admin', 'User'])
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return [
        (req, res, next) => {
            // if (req.user == undefined){
            //     return res.status(401).json({ message: 'Unauthorized access' });
            // }
            // //For Testing Only
            // if (req.user.role === 'SUPERADMIN'){
                
            // }
            // else if (roles.length && !roles.includes(req.user.role)) {
            //     // user's role is not authorized
            //     return res.status(401).json({ message: 'Unauthorized access' });
            // }

            // authentication and authorization successful
            next();
        }
    ];
}