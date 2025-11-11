import { signUp, logIn } from "../services/authService.js";


export async function signUpHandler(req, res){
    const {email, password} = req.body;
    const newUser = await signUp (email, password);
    res.status(201).json({ message: `New user created with an id of ${newUser.id}` })
}

export async function loginHandler(req, res){
    const {email, password} = req.body;
    const accessToken = await logIn(email, password);
    res.status(200).json({accessToken});
}