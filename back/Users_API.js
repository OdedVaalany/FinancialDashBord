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
        console.log(error);
    }
})

Route.get('/get/?', async(req,res) => {
    try{
        res.send(await Users.findById(req.query._id));
    }
    catch (error){
        res.send(false);
        console.log(error);
    }
})

Route.patch('/open-fund/:id', async(req,res) => {
    try {
        let user = await Users.findById(req.params.id);
        await user.funds.push(req.body);
        if(req.body.movements.length > 0){
            let b = req.body.movements[0];
            b.value = encrypt(eval(decrypt(b.value)) * -1);
            await user.funds[0].movements.push(b);
        }
        user.save();
        res.send(true);
    } catch (error) {
        res.send(false);
        console.log(error);
    }
})

Route.patch('/push-movement/:id/?', async(req,res) => {
    try {
        let funds = (await Users.findOneAndUpdate({_id :req.params.id , "funds._id" : req.query.fund },{$push : { "funds.$.movements" : req.body}})).funds;
        res.send(true);
    } catch (error) {
        res.send(false);
        console.log(error);
    }
})

Route.patch('/delete-all-movements/:id', async(req,res) => {
    try {
        let funds = (await Users.findByIdAndUpdate(req.params.id,{$set : {'funds.$[].movements' : []}}));
        res.send(true);
    } catch (error) {
        res.send(false);
        console.log(error);
    }
})

Route.patch('/edit-movement/:id/?', async(req,res) => {
    try {
        let mov = (await Users.findOneAndUpdate({_id :req.params.id , "funds.movements._id" : req.query.mov },{$push : { "funds.$.movements" : req.body}}));
        mov = (await Users.findOneAndUpdate({_id :req.params.id , "funds.movements._id" : req.query.mov },{$pull : {'funds.$.movements' : {_id : req.query.mov}}}));
        res.send(true);
    } catch (error) {
        res.send(false);
        console.log(error);
    }
})


Route.delete('/delete-movement/:id/?', async(req,res) => {
    try {
        let user = (await Users.findOneAndUpdate({_id :req.params.id , "funds.movements._id" : req.query.mov },{$pull : { "funds.$.movements" : {_id :req.query.mov}}}));
        res.send(true);
    } catch (error) {
        res.send(false);
        console.log(error);
    }
})
Route.delete('/delete-movement/:id/?', async(req,res) => {
    try {
        let user = (await Users.findOneAndUpdate({_id :req.params.id , "funds.movements._id" : req.query.mov },{$pull : { "funds.$.movements" : {_id :req.query.mov}}}));
        res.send(true);
    } catch (error) {
        res.send(false);
        console.log(error);
    }
})

Route.get('/open-connect/?', async(req,res) => {
    try{
        let b = (await Users.findOne({spec : req.query.spec})).logs;
        b.push({open : new Date(Date.now()) , close : null});
        await Users.findOneAndUpdate(req.query,{'$set' : {logs : b}});
        res.send(await Users.findOne(req.query));
    }
    catch (error){
        res.send(false);
        console.log(error);
    }
})

Route.get('/close-connect/:id', async(req,res) => {
    try{
        let b = (await Users.findById(req.params.id)).logs;
        b[b.length - 1].close = new Date(Date.now());
        await Users.findOneAndUpdate(req.query,{'$set' : {logs : b}});
        res.send(await Users.findById(req.params.id));
    }
    catch (error){
        res.send(false);
        console.log(error);
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