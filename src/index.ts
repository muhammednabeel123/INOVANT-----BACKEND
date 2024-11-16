
import * as bodyParser from "body-parser"
import { Request, Response } from "express"
import { AppDataSource } from "./data-source"
import router from './routes';
import { User } from "./entity/User"
const cors = require('cors');
import express from 'express';
import { join } from "path";
import * as dotenv from "dotenv";
const app = express()
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
dotenv.config();

app.use(
  cors({
    credentials: true, // Enable credentials support
    origin: true, // Allow all origins
  })
);

console.log(join(__dirname, '..', 'src/uploads'))

app.use('/uploads', express.static(join(__dirname, '..', 'src/uploads')));
app.use('/customer', express.static(join(__dirname, '..', 'src/public/customer')));
app.use('/cms', express.static(join(__dirname, '..', 'src/public/cms')));


AppDataSource.initialize().then(async () => {
  app.use('/', router);

  app.listen(3001, async () => {
    console.log('Server has started');

  });
}).catch(error => console.log(error));


