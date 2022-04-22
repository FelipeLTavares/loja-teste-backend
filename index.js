import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import expressSanitizer from 'express-sanitizer';
import rateLimit from 'express-rate-limit';
import 'dotenv/config';

import Router from './router.js';

//Controle de spam
const limiter = rateLimit({
	windowMs: 60 * 60 * 1000, // 1 hour
	max: 200, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

//Server
const app = express();
//Config
app.use(express.json({limit: '4mb'}));
app.use(express.urlencoded({extended: true, limit: '4mb'}));
app.use(helmet());
app.use(cors());
app.use(expressSanitizer());
app.use(limiter)
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', /* 'http://localhost:3000' */ 'https://loja-teste-frontend.vercel.app/' );
  res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE');
  return next();
});

app.use('/api', Router);

app.listen(process.env.PORT || 5000, ()=> console.log('Conectado!'))