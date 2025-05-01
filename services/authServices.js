// import bcrypt from "bcrypt";

// import User from "../models/user.js";

// export const register = async data => {
//     // const salt = await bcrypt.genSalt(10);
//     const hashPassword = await bcrypt.hash(data.password, 10);

//     return User.create({
//         ...data,
//         password: hashPassword,
//     });   
// }

// export const compareResult = (password, hashPassword) => bcrypt.compare(password, hashPassword);