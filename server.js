import express from 'express';
import fileUpload from "express-fileupload";
import cors from "cors";
import rutas from "./routes/routes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(fileUpload({
    limits: { fileSize: 5 * 1024 * 1024 },
    abortOnLimit: true,
    responseOnLimit: "El Tamaño del Archivo Supera el límite Permitido"
}));
app.use(rutas);
app.listen(process.env.PORT, () => {
    console.log(`Kartax Server Api up on ${process.env.PORT}!!!`);
});
