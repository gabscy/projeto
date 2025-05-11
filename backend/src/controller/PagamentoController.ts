import { Request, Response } from "express";
import { PagamentoService } from "../services/PagamentoService";
import { PagamentoRepository } from "../repository/PagamentoRepository";
import { ReservarQuadraDTO } from "../dto/QuadraDTO";

export class PagamentoController {
    private service: PagamentoService;

    constructor() {
        const repository = new PagamentoRepository();
        this.service = new PagamentoService(repository);
    }
}