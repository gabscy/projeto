import express, { Request, Response } from 'express';
import { QuadraController } from './controller/QuadraController';
import { SlotController } from './controller/SlotController';
import multer from 'multer';
import { FileController } from './controller/FileController';
import { BuscarDisponibilidadeDTO, editarUsuarioDTO } from './dto/QuadraDTO';
import { ReservaController } from './controller/ReservaController';
import { PagamentoController } from './controller/PagamentoController';
import dotenv from "dotenv";
import { UserController } from './controller/UserController';

dotenv.config();

const app = express();
const port = 3000;
const quadraController = new QuadraController();
const slotController = new SlotController();
const fileController = new FileController();
const reservaController = new ReservaController();
const pagamentoController = new PagamentoController();
const userController = new UserController();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(express.json());

app.post('/quadra', upload.fields([
    { name: 'courtImage', maxCount: 1 },
    { name: 'courtDocument', maxCount: 1 }]), 
    async (req: Request, res: Response) => {
    try {
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };

        const courtImageUrl = await fileController.uploadImage(files['courtImage'][0])
        const courtDocumentUrl = await fileController.uploadImage(files['courtDocument'][0])

        
        const novaQuadra = await quadraController.cadastrarQuadra({...req.body, courtImageUrl, courtDocumentUrl});

        await slotController.cadastrarSlot({
            quadra_id: novaQuadra.id!,
            horario_inicio: novaQuadra.selectedTimeStart,
            horario_fim: novaQuadra.selectedTimeEnd,
            dias_funcionamento: novaQuadra.selectedDays,
            slot: novaQuadra.slot,
        })

        res.status(201).json(novaQuadra);
    } catch (error: any) {
        console.error("Erro ao criar quadra", error);
        res.status(400).json({ mensagem: error.message })
    }
});

app.get('/disponibilidade-quadra', async (req: Request, res: Response) => {
    try {
        const dados: BuscarDisponibilidadeDTO = {
            date: req.query.date as string,
            quadraId: req.query.quadraId as string,
        };

        const slotsDisponiveis = await slotController.buscarDisponibilidade(dados)

        res.status(201).json(slotsDisponiveis);
    } catch (error: any) {
        console.error("Não foi possível buscar a disponibilidade da quadra")
        res.status(400).json({ message: error.message })
    }
})

app.post('/reservar-quadra', async (req: Request, res: Response) => {
    try {
        const reservaId = await reservaController.criarReserva(req.body)
        const pagamentoId = await pagamentoController.criarPagamento({...req.body, reservaId})

        await reservaController.atualizarReserva({
            id: reservaId,
            pagamento_id: pagamentoId
        })
    
        res.status(201).json({ message: "Reserva realizada com sucesso"})
    } catch (error: any) {
        console.error("Não foi possível realizar reserva")
        res.status(400).json({ message: error.message })
    }
})

app.get('/buscar-quadras', async (req: Request, res: Response) => {
    try {
        const quadras = await quadraController.buscarQuadras()

        res.status(200).json({ quadras })
    } catch (error: any) {
        console.error("Não foi possível filtrar quadras")
        res.status(400).json({ message: error.message })
    }
})

app.put("/user/:id", async (req: Request, res: Response) => {
    try {
        const dados: editarUsuarioDTO = {
            id: req.params.id,
            ...req.body
        }

        const user = await userController.editarConta(dados)
        res.status(200).json({ user })
    } catch (error: any) {
        console.error("Não foi possível atualizar os dados da sua conta")
        res.status(400).json({ message: error.message })
    }
})

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
