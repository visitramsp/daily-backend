import 'dotenv/config';
import mongoose from 'mongoose';
import {app} from './app.js';
import {connectDatabase} from './config/database.js';
const port=Number(process.env.PORT)||5000;
try{
 await connectDatabase(process.env.MONGODB_URI);
 const server=app.listen(port,()=>console.log(`API listening on http://localhost:${port}`));
 const shutdown=async()=>{server.close();await mongoose.disconnect();process.exit(0);};
 process.on('SIGINT',shutdown);process.on('SIGTERM',shutdown);
}catch(error){console.error('Startup failed:',error.message);process.exit(1);}
