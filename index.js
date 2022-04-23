import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import expressSanitizer from 'express-sanitizer';
import rateLimit from 'express-rate-limit';
import 'dotenv/config';

import Router from './router.js';

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true,
	legacyHeaders: false,
})

//Server
const app = express();
//Config
app.use(cors());
app.use(express.json({limit: '4mb'}));
app.use(express.urlencoded({extended: true, limit: '4mb'}));
app.use(helmet());
app.use(limiter);
app.use(expressSanitizer());

app.use('/api', Router);

app.listen(process.env.PORT || 5000, ()=> console.log('Conectado!'))