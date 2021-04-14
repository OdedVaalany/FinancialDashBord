import pkg from 'mongoose';

const {Schema,Types} = pkg;

const Movement = new Schema({
    name : {type : String},
    value : {type : String},
    date : {type : Date , default : (new Date(Date.now()))},
    note : {type : String},
    tags : [String],
},{_id : true});

const Fund =  new Schema({
    kind : {type : String , default : 'genral'},
    name : {type : String},
    movements : [Movement],
    open : {type : Date , default : (new Date(Date.now()))},
    active : {type : String},
    growth : {type : String},
    periods : {type : String},
},{_id : true});
 
export const Users = pkg.model('Users', new Schema({
    spec : {type : String, require : true},
    first_name : {type : String, require : true},
    last_name : {type : String, require : true},
    birthday : {type : Date, require : true},
    gender : {type : String, require : true},
    email : {type : String, require : true},
    password : {type : String, require : true},
    phone : {
        code : {type : String, require : true},
        number : {type : String, require : true},
    },
    status : {type : String, require : true},
    verify : {
        code : {type : String, default : null},
        code_expire : {type : Date, default : null},
    },
    client : {type : String, default : "private"},
    logs : {type : Array , default : [
        {
            open : (new Date(Date.now())),
            close : (new Date(Date.now())),
        }
    ]},
    version : {type : Number , default : 1},
    admin : false,
    funds : [Fund],
}));