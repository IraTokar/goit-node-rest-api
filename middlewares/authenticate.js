import jwt from "jsonwebtoken";
import HttpError from "../helpers/HttpError.js";
import User from "../models/user.js";


const { SECRET_KEY } = process.env;

const authenticate = async ( req, res, next) => {
    const { authorization = "" } = req.headers;

    if (!authorization) {
        return next(HttpError(401, 'Authorization header not found'));
    }

    const [bearer, token] = authorization.split(" ");

    if (bearer !== "Bearer") {
       return next(HttpError(401, 'Bearer not found'));
    };

    try {
        const { id } = jwt.verify(token, SECRET_KEY);
        const user = await User.findById(id);
        if (!user || !user.token || user.token !== token ) {
           return next(HttpError(401,  'User not found'));
        }
        req.user = user;    
        next();
    }
    catch {
        next(HttpError(401))
    }

};

export default authenticate;