import 'dotenv/config';
import { MongoClient, ObjectId } from 'mongodb';
/* import cloudinary from '../Cloudinary/cloudinary.js'; */
import expressSanitizer from "express-sanitizer";
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

//MONGODB CLIENT
const client = new MongoClient(process.env.MONGO_DB_CONECTION);

//FUNCAO DE VERIFICACAO
const funcaoDeVerificacao = async (tokenn) => {
  let resultado = [];

  try {
    await client.connect();
    await client.db('Loja').collection('logins').find({ token: tokenn }).toArray()
      .then(async (resp) => {
        resultado = resp;
      })
      .catch(() => { return false })
  } catch (err) {
    err => { return false }
  } finally {
    await client.close()
  }

  if (resultado.length === 0) {
    return false
  } else {
    return true
  }
}


////VERIFICAR LOGIN
export const controlelogin = async (req, res) => {
  const usuario = req.sanitize(req.body.usuario);
  const senha = req.sanitize(req.body.senha);

    try {
      await client.connect();
      await client.db('Loja').collection('logins').find({
        $and: [{ usuario: usuario }, { senha: senha }]
      }).toArray()
        .then(resp => {
          res.json({ ...resp[0], resultado: true })
        })
    } catch (error) {
      res.json(error)
    } finally {
      await client.close()
    }

}


////POSTAR PRODUTO
export const postarProduto = async (req, res) => {
  let verificado = await funcaoDeVerificacao(req.sanitize(req.body.token));
  const nome = req.sanitize(req.body.nome);
  const tipo = req.sanitize(req.body.tipo);
  const valor = parseFloat(req.sanitize(req.body.valor));

  if (verificado) {

    if ((nome === undefined || nome === '') || (tipo === undefined || tipo === '')) {
      res.json('CAMPOS VAZIOS')
    } else if (isNaN(valor)) {
      res.json('VALOR INVALIDO')
    } else {////Se tudo estiver ok!
      //Tratar as fotos
      let listaURLs = [];
      const fotos = req.body.foto
      const postarTudo = async () => {
        const promises = fotos.map(async (foto) => {
          await cloudinary.uploader.upload(req.sanitize(foto), { upload_preset: 'qsabzvex' }).then(resp => listaURLs.push({ url: resp.url, id: resp.public_id }))
        })
        await Promise.all(promises);
      }
      await postarTudo();

      //Postar no MongoDB
      try {
        let produto = {
          nome: nome,
          tipo: tipo,
          valor: valor,
          fotos: listaURLs
        }
        await client.connect();
        await client.db('Loja').collection('novaloja').insertOne(produto)
          .then(resp => res.json('POSTADO COM SUCESSO'))
      } catch (err) {
        res.json('FALHA AO REGISTRAR NO BD')
      } finally { await client.close() }
    }
  } else {
    res.json('USUARIO NAO AUTENTICADO')
  }
}


//DELETAR PRODUTO
export const deletarProduto = async(req, res) => {
  let verificado = await funcaoDeVerificacao(req.sanitize(req.body.token));

  if (verificado) {///Verificação
    const idProduto = req.sanitize(req.body.idProduto);
    const id = ObjectId(idProduto);
    let linksFotos;

    const procurarProduto = async () => {
      try {
        await client.connect();
        await client.db('Loja').collection('novaloja').find({ _id: id }).toArray()
          .then(resp => {
            if (resp.length === 0) {
              res.json('NAO FOI ACHADO NADA')
            } else {
              linksFotos = resp[0].fotos
            }
          })
      } catch (err) {
        res.json(err)
      } finally {
        client.close()
      }
    }
    await procurarProduto();

    if (linksFotos.length !== 0) {
      //Apagar as fotos do Cloudinary
      const deletarTudo = async () => {
        const promises = linksFotos.map(async (foto) => {
          await cloudinary.api.delete_resources(foto.id)
            .then(resp => console.log(resp))
        })
        await Promise.all(promises);
      }
      await deletarTudo();
      //Apagar o documento do MongoDB
      try {
        await client.connect();
        await client.db('Loja').collection('novaloja').deleteOne({ _id: id })
          .then(resp => {
            res.json('APAGADO COM SUCESSO')
          })
      } catch (err) {
        res.json(err)
      } finally {
        client.close()
      }
    }
  } else {
    res.json('USUARIO NAO AUTENTICADO')
  }
}