import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import expressSanitizer from 'express-sanitizer';
import 'dotenv/config';

import Router from './router.js';

//Server
const app = express();
//Config
app.use(cors());
app.use(express.json({limit: '4mb'}));
app.use(express.urlencoded({extended: true, limit: '4mb'}));
app.use(helmet());
app.use(expressSanitizer());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', /* 'http://localhost:3000' */ 'https://loja-teste-frontend.vercel.app/*' );
  res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE');
  return next();
});

app.use('/api', Router);

app.listen(process.env.PORT || 5000, ()=> console.log('Conectado!'))