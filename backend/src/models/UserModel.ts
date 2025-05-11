export interface User {
    id: string;
    email: string;
    nome: string;
    username: string;
    cidade: string;
    estado: string;
    password: string;
    tipo: string;
}

export class User {
    constructor(
        id: string,
        email: string,
        nome: string,
        username: string,
        cidade: string,
        estado: string,
        password: string,
        tipo: string
    ) {
        this.id = id;
        this.email = email;
        this.nome = nome;
        this.username = username;
        this.cidade = cidade;
        this.estado = estado;
        this.password = password;
        this.tipo = tipo;
    }
}