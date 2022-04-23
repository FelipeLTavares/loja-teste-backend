import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import expressSanitizer from 'express-sanitizer';
import rateLimit from 'express-rate-limit';
import 'dotenv/config';

import Router from './router.js';

//Limiter
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

//Server
const app = express();
//Config
app.use(express.json({limit: '4mb'}));
app.use(express.urlencoded({extended: true, limit: '4mb'}));
app.use(helmet());
app.use(expressSanitizer());
app.use(limiter);
app.use(cors({origin: true}));

app.use('/api', Router);

app.listen(process.env.PORT || 5000, ()=> console.log('Conectado!'))