import express, { Request, Response } from 'express';
import { QuadraController } from './controller/QuadraController';
import { SlotController } from './controller/SlotController';
import multer from 'multer';
import { ReservaController } from './controller/ReservaController';
import dotenv from "dotenv";
import { UserController } from './controller/UserController';
import cors from "cors";

dotenv.config();

export const app = express();
const port = 3000;
const quadraController = new QuadraController();
const slotController = new SlotController();
const reservaController = new ReservaController();
const userController = new UserController();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(express.json());
app.use(cors());

app.post("/quadra", upload.fields([
    { name: "courtImage", maxCount: 1 },
    { name: "courtDocument", maxCount: 1 }
]), (req, res) => quadraController.cadastrarQuadra(req, res));

app.get('/disponibilidade-quadra', async (req: Request, res: Response) => await slotController.buscarDisponibilidade(req, res))

app.post('/reservar-quadra', async (req: Request, res: Response) => await reservaController.criarReserva(req, res))

app.get('/buscar-quadras', async (req: Request, res: Response) => quadraController.buscarQuadras(req,res))

app.put("/user/:id", async (req: Request, res: Response) => await userController.editarConta(req, res))

app.get('/quadra/:id', async (req: Request, res: Response) => await quadraController.buscarInfoQuadra(req, res))

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
