import express, { Request, Response } from 'express';
import { QuadraController } from './controller/QuadraController';

const app = express();
const port = 3000;
const quadraController = new QuadraController();

app.use(express.json());

app.post('/quadra', async (req: Request, res: Response) => {
    try {
        const novaQuadra = await quadraController.cadastrarQuadra(req.body);
        res.status(201).json(novaQuadra);
    } catch (error: any) {
        console.error("Erro ao criar quadra", error);
        res.status(400).json({ mensagem: error.message })
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
