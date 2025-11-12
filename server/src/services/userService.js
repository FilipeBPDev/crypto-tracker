import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getUserByEmail, createUser  } from "../DAO/userDAO.js";



//registrar usuario
export const registerUser = async (name, email, password) => {
    try{
        const result = await getUserByEmail(email);
        if(result) {
            throw new Error("E-mail já cadastrado");
        }

        //faz hash de senha com bcrypt
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        //cria novo user
        const newUser = await createUser(name, email, hashedPassword);
        
        return newUser;

    } catch (error) {
        console.error("[userService] registerUser error:", error.message);
        throw error;

    }
}


export const loginUser = async (email, password) => {
    try{
        const result = await getUserByEmail(email);
        if(!result) {
            throw new Error("Usuário não cadastrado");
        }

        //compara senhas
        const isPasswordValid = await bcrypt.compare(password, result.password)

        if(!isPasswordValid) { 
            throw new Error("Senha incorreta");
        }
        
        const { password: _, ...userWithoutPassword } = result;

        const token = jwt.sign(
        { id: result.id, email: result.email },
        process.env.JWT_SECRET_DEV,
        { expiresIn: process.env.JWT_EXPIRES_IN_DEV || "1h" }
        );

        return { ...userWithoutPassword, token };
    } catch(error) {
        console.error("[userService] loginUser error:", error.message);
        throw error;
    }

}