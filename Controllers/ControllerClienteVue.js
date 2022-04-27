import 'dotenv/config';
import { MongoClient, ObjectId } from 'mongodb';
import expressSanitizer from 'express-sanitizer';

const client = new MongoClient(process.env.MONGO_DB_CONECTION);

//VITRINE
export const getVitrineVue = async (req, res) => {
  let camisass = [];
  let calcass = [];
  try {
    await client.connect();

    await client.db('Loja').collection('novaloja').find({ tipo: "Camisa" }).limit(4).toArray()
      .then(resp => resp.forEach(camisa => camisass.push(camisa)));

    await client.db('Loja').collection('novaloja').find({ tipo: "Calça" }).limit(4).toArray()
      .then(resp => resp.forEach(calca => calcass.push(calca)));

    res.json({ camisas: camisass, calcas: calcass })
  } catch (error) {
    res.json(error)
  } finally {
    client.close();
  }
}

//LISTA DE PRODUTOS
export const postListaProdutosVue = async (req, res) => {
  const {valormaior, valormenor, tipos} = req.body
  const dados = {
    tipos: tipos,
    valormenor: valormenor,
    valormaior: valormaior
  }
  if(tipos.length === 0){dados.tipos = ['Camisa', 'Calça', 'Regata']}
  if(valormaior === ''){dados.valormaior = 1}
  if(valormenor === ''){dados.valormenor = 10000}

  try {
    await client.connect();
    await client.db('Loja').collection('novaloja').find({
      tipo: { $in: dados.tipos },
      valor: { $lte: dados.valormenor, $gte: dados.valormaior }
    }).toArray()
      .then(resp => res.json(resp))
      .catch(err => res.json(err))
  } catch (error) {
    res.json(error)
  } finally {
    client.close();
  }
}

//PRODUTO ESPECIFICO
export const getProdutoVue = async (req, res) => {
  const idProduto = req.sanitize(req.params.idProduto);
  const id = ObjectId(idProduto);

  try {
    await client.connect();
    await client.db('Loja').collection('novaloja').find({ _id: id }).toArray()
      .then(resp => {
        res.json(resp)
      })
      .catch(err => res.json(err))
  } catch (error) {
    res.json(error)
  } finally {
    client.close();
  }
}