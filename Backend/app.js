import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import {PORT} from './config/env.js';
 
import userRouter from './routes/user.routes.js';

import connectToDatabase from './database/mongoose.js';




const app = express();

app.set('trust proxy', true);

app.use(cors({
  origin: "*",    
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());




app.use('/', userRouter);




app.get("/", (req,res)=>{
    res.send('Welcome to the user management API!');
})

app.listen(PORT,async ()=>{
    console.log(`user management api is running on http://localhost:${PORT}`);

   await connectToDatabase();
})

export default app;