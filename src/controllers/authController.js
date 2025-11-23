import { signUp, logIn } from "../services/authService.js";


export async function signUpHandler(req, res){
    const {username, password} = req.body;
    const newUser = await signUp(username, password);
    console.log("newUser:" + newUser)
    return res.status(201).json({ message: `New user created with an id of ${newUser.id}` })
}

export async function loginHandler(req, res){
    const {username, password} = req.body;
    const accessToken = await logIn(username, password);
    return res.status(200).json({accessToken});
}