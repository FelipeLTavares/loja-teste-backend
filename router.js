import express from "express";
import 'dotenv/config';

import { getProduto, getVitrine, postListaProdutos } from "./Controllers/ControllersCliente.js";
import { controlelogin, deletarProduto, postarProduto } from "./Controllers/COntrollersGerente.js";

const Router = express.Router();

//CLIENTE
Router.get('/', getVitrine)

Router.post('/produtos', postListaProdutos)

Router.get('/produtos/:idProduto', getProduto)

//GERENTE
Router.post('/gerenciador/login', controlelogin)

Router.post('/gerenciador/produtos/postar', postarProduto)

Router.delete('/gerenciador/produtos/deletar', deletarProduto )

export default Router;