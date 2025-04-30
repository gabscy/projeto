import express, { Request, Response } from 'express';
import { QuadraController } from './controller/QuadraController';
import { SlotController } from './controller/SlotController';

const app = express();
const port = 3000;
const quadraController = new QuadraController();
const slotController = new SlotController();

app.use(express.json());

app.post('/quadra', async (req: Request, res: Response) => {
    try {
        const slotId = await slotController.cadastrarSlot(JSON.parse(req.body.selectedDays))
        const novaQuadra = await quadraController.cadastrarQuadra({...req.body, slotId});
        res.status(201).json(novaQuadra);
    } catch (error: any) {
        console.error("Erro ao criar quadra", error);
        res.status(400).json({ mensagem: error.message })
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
