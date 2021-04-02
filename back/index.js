import express from 'express'
import cors from 'cors'
import pkg from 'mongoose';
import { DatabasePassword } from './private.js'
import Route from './Users_API.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended : false}));
app.use('/users',Route)


//activate the server online
const PORT = 5000;
app.listen(PORT, _ => {
    console.log(`server run in port http://127.0.0.1:${PORT}`);
})

//define uri to the database and start a connections
const URI = `mongodb+srv://Avoded2:${DatabasePassword}@cluster0.vwucm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
pkg.connect(URI,{ useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }, err => {
    if(err) throw err;
    else console.log("we have a connections");
})