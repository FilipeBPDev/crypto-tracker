import {loginUser, registerUser } from "../services/userService.js"



export const registerUserController = async (req, res) => {
    try{
        const {name, email, password} = req.body;
        if(!name || !email || !password) {
            return res.status(400).json({ message: "Dados incompletos." })
        }
        const user = await registerUser(name, email, password);
        return res.status(201).json({message: "Usuário cadastrado com sucesso!", user})

    } catch(error) {
        console.error("[authController] registerUserController error:", error.message);
        res.status(500).json({ error: "Erro interno ao cadastrar usuário" });
    }
}   

export const loginUserController = async (req, res) => {
    try{
        const { email, password } = req.body;
        if(!email || !password) {
            return res.status(400).json({ message: "Preencha todos os campos obrigatórios." });
        }

        const user = await loginUser(email, password);
        
        return res.status(200).json({ 
            message: "Login realizado com sucesso!",
            user
        });

    } catch (error) {
        console.error("[authController] loginUserController error:", error.message);

        const status = error.message === "Usuário não cadastrado" || error.message === "Senha incorreta" ? 401 : 500;

        return res.status(status).json({
            error: error.message || "Erro interno ao fazer login."
        })
    }
}