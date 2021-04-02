import pkg from 'mongoose';

const {Schema} = pkg;
 
export const Users = pkg.model('Users', Schema({
    spec : {type : String, require : true},
    first_name : {type : String, require : true},
    last_name : {type : String, require : true},
    birthday : {type : String, require : true},
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
            open : (new Date(Date.now())).getTime(),
            close : (new Date(Date.now())).getTime(),
        }
    ]},
    version : {type : Number , default : 1},
    admin : false,
    funds : {type : Array , default : [{
        kind : 'general',
        name : {type : String},
        movements : [],
        open : (new Date(Date.now())).getTime(),
        active : true,
        growth : null,
        periods : null,
    }]}
}));