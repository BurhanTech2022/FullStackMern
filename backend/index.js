import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import dotenv from 'dotenv'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import {limiter}  from './middlewares/rateLimiter.js'
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from  './util/swagger.js'

const app = express();
dotenv.config()
// Use middleWare

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

if (process.env.NODE_ENV !== 'production') {
  console.log("Environment:", process.env.NODE_ENV); // should log: development
}

app.use(limiter);
app.use(helmet());
app.use(morgan('dev'));

app.use(express.json());
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// After importing swaggerSpec
console.log('Swagger paths:', Object.keys(swaggerSpec.paths));
// import Route
   import userRoute from './routes/userRoute.js'

   app.use('/api',userRoute)
// import Middle ware
import { errHandler } from './middlewares/globalError.js';
import { notFoundError } from './middlewares/notFound.js';

// config and DataBases
mongoose.connect(process.env.NODE_ENV === "development"? process.env.MONGO_URL_DEV :
  process.env.MONGO_URL_PRO 

).then(()=>{
    console.log('database is connected successfully');
    console.log(`you are using ${process.env.NODE_ENV}`);
    
    
}).catch(err => console.log('Dabase  error:', err.message));


app.get('/api', (req, res) => {
  res.send('App is working fine!👍');
});

// Server fronted in Production

if (process.env.NODE_ENV === "production") {

    const __dirname = path.dirname(fileURLToPath(import.meta.url));

    app.use(express.static(path.join(__dirname, '../frontend/dist')));

    // Serve the frontend app

    app.get(/.*/, (req, res) => {
        res.send(path.join(__dirname, '..', 'frontend', 'dist', 'index.html'));
    })
}

//  Errors
app.use(notFoundError)
app.use(errHandler)
// port
const PORT = process.env.PORT 
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

