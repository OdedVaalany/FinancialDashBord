import { Router } from "express";
import { encrypt,decrypt,toHash } from './Secuerity.js';
import { Users } from "./User.js";

const Route = Router();

Route.get('/?', async(req,res) => {
    try {
        res.json(await Users.find(req.query));
    } catch (error) {
        res.send(false);
    }
})

Route.post('/', async(req,res) => {
    try{
        var x = new Users(req.body);
        var id = x._id
        await x.save();
        x = await Users.findById(id);
        res.json(x);
    } catch (error){
        res.send(false);
        throw error
    }
})

Route.get('/get/?', async(req,res) => {
    try{
        res.send(await Users.findById(req.query._id));
    }
    catch (error){
        res.send(false);
        throw error;
    }
})

Route.patch('/open-fund/:id', async(req,res) => {
    try {
        let user = await Users.findByIdAndUpdate(req.params.id, {$push : {funds : req.body}});
        res.send(true);
    } catch (error) {
        res.send(false);
        throw error;
    }
})

Route.get('/open-connect/?', async(req,res) => {
    try{
        let b = (await Users.findOne({spec : req.query.spec})).logs;
        b.push({open : (new Date(Date.now())).getTime() , close : null});
        await Users.findOneAndUpdate(req.query,{'$set' : {logs : b}});
        res.send(await Users.findOne(req.query));
    }
    catch (error){
        res.send(false);
        throw error;
    }
})

Route.get('/close-connect/:id', async(req,res) => {
    try{
        let b = (await Users.findById(req.params.id)).logs;
        b[b.length - 1].close = (new Date(Date.now())).getTime();
        await Users.findOneAndUpdate(req.query,{'$set' : {logs : b}});
        res.send(await Users.findById(req.params.id));
    }
    catch (error){
        res.send(false);
    }
})

Route.get('/email-exist/?', async(req,res) =>{
    try{
        let email =decrypt(req.query.email);
        let flag = false;
        let ema;
        let b = await Users.find({});
        if(b !== null && b.length !== 0 ){
            b.map(element => {
                ema = decrypt(element.email);
                if(ema === email) flag = true;
            })
            res.send(flag);
        }else{
            res.send(false);
        }
    }
    catch (error){
        console.log(error);
        res.send(null);
    }
})

export default Route