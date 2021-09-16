import jwt from 'jsonwebtoken';

export const generateToken = (user) => {
    return jwt.sign(
    {_id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin},
        process.env.JWT_SECRET || 'somethingsecret',
        {expiresIn: '30d'}
    )
};

export const isAuth = (req, res, next) => {
    const authorization = req.headers.authorization;
    if(authorization){
        //Why 7? Authorization format is Bearer XXXXXX. XXXXXX is the token part
        const token = authorization.slice(7, authorization.length);
        //decrypt the token. return value to decode variable
        jwt.verify(token, process.env.JWT_SECRET || 'somethingsecret', (error, decode) => {
            if(error){
                res.status(401).send({message: 'Invalid token'});
            }else {
                req.user = decode;
                //pass user as the property of req to the next middleware
                next();
            }
        });
    }else {
        res.status(401).send({message: 'No token'});
    }
}