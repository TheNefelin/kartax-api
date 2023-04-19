import jwt from 'jsonwebtoken';

export default class SecretData {
    #key
    constructor() {
        this.#key = "secret key";
    }
    conexionPG () {
        return {
            user: "",
            host: "",
            database: "",
            password: "",
            port: 5432,
            connectionTimeoutMillis: 5000,
            idleTimeoutMillis: 3000,
        };
    };
    getNewToken(usuario, clave, timeOutMillis) {
        return jwt.sign(
            {
                exp: Math.floor(Date.now() / 1000) + timeOutMillis,
                usuario: usuario, 
                cLave: clave
            }, 
            this.#key
        );
    };
    validateToken(token) {
        let obj;

        jwt.verify(token, this.#key, (err, data) => {
            if (err) {
                obj = [{estado: false, msge: "Token Invalido"}];
            } else {
                obj = [{estado: true, msge: "Token Valido"}];
            };
        });

        return obj;
    };
};