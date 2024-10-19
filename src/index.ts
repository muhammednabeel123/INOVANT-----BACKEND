
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
    credentials: true,
    origin: function (origin, callback) {
      callback(null, true);
    },
  })
);
app.use('/uploads', express.static(join(__dirname, '..', 'src/uploads')));
    AppDataSource.initialize().then(async () => {
      app.use('/',router);
       
        app.listen(3000, async () => {
          console.log('Server has started');
      
        });
      }).catch(error => console.log(error));
      


