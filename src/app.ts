import express, { Request, Response } from "express";
import { Produto } from "./model/Produto";

const app = express();
const PORT = process.env.PORT ?? 3000;
app.use(express.json());

const produtos: Produto[] =[];

function listarProdutos(req: Request, res: Response):void{
    try{
        if(produtos.length == 0){
            throw new Error("Nenhum produto encontrado");
        }
        res.status(200).json(produtos);
        
    }catch(e: unknown){
        res.status(400).json({Message: "Nenhum produto encontrado"});
    }
}

function filtraProdutoPorID(req: Request, res: Response):void{
    try{
        let id:any = req.params.id;
        res.status(200).json(produtos.find(p => p.id == id));
    }catch(e: unknown){
        res.status(400).json({Message: "Necessário informar um ID válido"});
    }
}

function criarProduto(req: Request, res: Response):void{
    try{
        let data:any = req.body;
        if(!data.nome || !data.preco || !data.fabricante){
            throw new Error("Favor enviar os valores corretos");
        }
        if(produtos.some(p => p.id == data.id)){
            throw new Error("id já cadastrado");
        }

        let produto = new Produto(data.id,data.nome,data.preco,data.fabricante);
        produtos.push(produto);
        res.status(201).json(produto);

    }catch(e: unknown){
        res.status(400).json({Message: "Necessário informar as informações do produto."});
    }
}
function deletarProduto(req: Request, res: Response):void{
    try{
        let id:any = req.params.id
        let pos = produtos.findIndex(p=>p.id == id)
        if(pos == -1){
             throw new Error("id não encontrado")
        }
        produtos.splice(pos, 1);
        res.status(200).json({Message: "Produto removido com sucesso"});
        
    }
    catch{
        res.status(400).json({Message: "ID informado não existe"})
    }
}

function editarProduto(req: Request, res: Response): void {
    try {
        const id:any = req.params.id;
        const data = req.body;
        const index = produtos.findIndex(p => p.id == id);

        if (index == -1) {
            throw new Error("id não encontrado")
        }

        if(!data.nome || !data.preco || !data.fabricante){
            throw new Error("Favor enviar os valores corretos");
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

    } catch {
        res.status(400).json({ message: "Erro ao atualizar produto" });
    }
}

app.get('/api/produto/:id', filtraProdutoPorID);
app.get('/api/listarProdutos', listarProdutos);
app.post('/api/produto',criarProduto);
app.delete('/api/produto/:id',deletarProduto)
app.put('/api/produto/:id',editarProduto)

app.listen(PORT, () => console.log(`API rodando na URL : http://localhost:${PORT}`));