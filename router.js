import express from "express";
import 'dotenv/config';

import { getProduto, getVitrine, postListaProdutos } from "./Controllers/ControllersCliente.js";
import { controlelogin, deletarProduto, postarProduto } from "./Controllers/ControllersGerente.js";
import { getProdutoVue, getVitrineVue, postListaProdutosVue } from "./Controllers/ControllerClienteVue.js";

const Router = express.Router();

//CLIENTE
Router.get('/', getVitrine)

Router.post('/produtos', postListaProdutos)

Router.get('/produtos/:idProduto', getProduto)

//GERENTE
Router.post('/gerenciador/login', controlelogin)

Router.post('/gerenciador/produtos/postar', postarProduto)

Router.delete('/gerenciador/produtos/deletar', deletarProduto )

//CLIENTE PROJETO VUE

Router.get('/vue', getVitrineVue)

Router.post('/vue/produtos', postListaProdutosVue)

Router.get('/vue/produtos/:idProduto', getProdutoVue)

export default Router;