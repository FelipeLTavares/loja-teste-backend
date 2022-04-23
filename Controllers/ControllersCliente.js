import 'dotenv/config';
import { MongoClient, ObjectId } from 'mongodb';

const client = new MongoClient(process.env.MONGO_DB_CONECTION);

//Verificação
const verificarCaracteresEsp = (str) => {
  const regex = new RegExp(/\W|_/);
  return regex.test(str)
}

//VITRINE
export const getVitrine = async (req, res) => {
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
export const postListaProdutos = async (req, res) => {
  const tipos = ['Camisa', 'Calça', 'Regata'];
  const dados = {
    tipos: req.body.tipos,
    valormaior: undefined || parseFloat(req.sanitize(req.body.valormaior)),
    valormenor: undefined || parseFloat(req.sanitize(req.body.valormenor))
  };

  try {
    await client.connect();
    await client.db('Loja').collection('novaloja').find({
      tipo: { $in: dados.tipos || tipos },
      valor: { $lte: dados.valormenor || 100000, $gte: dados.valormaior || 1 }
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
export const getProduto = async (req, res) => {
  const idProduto = req.sanitize(req.params.idProduto);
  const id = ObjectId(idProduto);

  if (!(verificarCaracteresEsp(id))) {
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
  } else {
    res.josn('Erro')
  }
}