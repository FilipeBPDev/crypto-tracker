import jwt from "jsonwebtoken";


export const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    const token = authHeader?.startsWith("Bearer ") 
    ? authHeader.split(" ")[1] 
    : null;

    if (!token) return res.status(401).json({ error: "Token não fornecido" });

    try {
        const secret = process.env.JWT_SECRET || process.env.JWT_SECRET_DEV;
        const decoded = jwt.verify(token, secret);

        req.user = decoded; // => { id, email, iat, exp }
        next();
    } catch (erro) {
        return res.status(403).json({ error: "Token inválido ou expirado" });
    }
}