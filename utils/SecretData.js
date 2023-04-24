import dotenv from 'dotenv'
import jwt from 'jsonwebtoken';
import path from 'path';
import { fileURLToPath } from 'url';

// referencia el archivo .env para acceder a los datos secretos
dotenv.config();

export default class SecretData {
    constructor() {};
    conexionPG () {
        return {
            user: process.env.DB_USER,
            host: process.env.DB_HOST,
            database: process.env.DB_DATABASE,
            password: process.env.DB_PASWORD,
            port: process.env.DB_PORT,
            // connectionTimeoutMillis: 5000,
            // idleTimeoutMillis: 3000,
            // evict: 3000,
            // max: 10,
        };
    };
    newToken(usuario, clave, timeOutMin) {
        return jwt.sign(
            {
                exp: Math.floor(Date.now() / 1000) + (60 * timeOutMin),
                usuario: usuario, 
                cLave: clave,
            }, 
            process.env.JWT_KEY,
        );
    };
    validateToken(token) {
        jwt.verify(token, process.env.JWT_KEY, (err, data) => {
            if (err) {
                return [{estado: false, msge: "Token Inválido"}];
            } else {
                return [{estado: true, msge: "Token Válido"}];
            };
        });
    };
    ruta() {
        let ruta = path.dirname(fileURLToPath(import.meta.url));
        ruta = ruta.slice(0, ruta.length - 6);
        return ruta
    };
};
