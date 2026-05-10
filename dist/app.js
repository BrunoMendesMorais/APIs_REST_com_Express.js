"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Produto_1 = require("./Class/Produto");
const app = (0, express_1.default)();
const PORT = process.env.PORT ?? 3000;
app.use(express_1.default.json());
const produtos = [];
function listarProdutos(req, res) {
    try {
        if (produtos.length == 0) {
            throw new Error("Nenhum produto encontrado");
        }
        res.status(200).json(produtos);
    }
    catch (e) {
        res.status(400).json({ Message: "Nenhum produto encontrado" });
    }
}
function filtraProdutoPorID(req, res) {
    try {
        let id = req.params.id;
        res.status(200).json(produtos.find(p => p.id == id));
    }
    catch (e) {
        res.status(400).json({ Message: "Necessário informar um ID válido" });
    }
}
function criarProduto(req, res) {
    try {
        let data = req.body;
        if (!data.nome || !data.preco || !data.fabricante) {
            throw new Error("Favor enviar os valores corretos");
        }
        if (produtos.some(p => p.id == data.id)) {
            throw new Error("id já cadastrado");
        }
        let produto = new Produto_1.Produto(data.id, data.nome, data.preco, data.fabricante);
        produtos.push(produto);
        res.status(201).json(produto);
    }
    catch (e) {
        res.status(400).json({ Message: "Necessário informar as informações do produto." });
    }
}
function deletarProduto(req, res) {
    try {
        let id = req.params.id;
        let pos = produtos.findIndex(p => p.id == id);
        if (pos == -1) {
            throw new Error("id não encontrado");
        }
        produtos.splice(pos, 1);
        res.status(200).json({ Message: "Produto removido com sucesso" });
    }
    catch {
        res.status(400).json({ Message: "ID informado não existe" });
    }
}
function editarProduto(req, res) {
    try {
        const id = req.params.id;
        const data = req.body;
        const index = produtos.findIndex(p => p.id == id);
        if (index == -1) {
            throw new Error("id não encontrado");
        }
        const produtoAtualizado = {
            id,
            nome: data.nome,
            preco: data.preco,
            fabricante: {
                nome: data.fabricante.nome,
                endereco: {
                    cidade: data.fabricante.endereco.cidade,
                    pais: data.fabricante.endereco.pais
                }
            }
        };
        produtos[index] = produtoAtualizado;
        res.status(200).json(produtoAtualizado);
    }
    catch {
        res.status(400).json({ message: "Erro ao atualizar produto" });
    }
}
app.get('/api/produto/:id', filtraProdutoPorID);
app.get('/api/listarProdutos', listarProdutos);
app.post('/api/produto', criarProduto);
app.delete('/api/produto/:id', deletarProduto);
app.put('/api/produto/:id', editarProduto);
app.listen(PORT, () => console.log(`API rodando na URL : http://localhost:${PORT}`));
//# sourceMappingURL=app.js.map