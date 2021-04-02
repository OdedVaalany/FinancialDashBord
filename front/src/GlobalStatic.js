import { colors } from '@material-ui/core';
import { heIL } from '@material-ui/core/locale';
import { createMuiTheme} from '@material-ui/core/styles';
import { AES, enc, SHA3 } from 'crypto-js';

export const ServerURL = "http://127.0.0.1:5000/";
const CK = SHA3('Avoded2082').toString();
const IV = '1324576890abctrfd'

export const encrypt = (str) => {
    return AES.encrypt(str,CK,{iv : IV}).toString();
}

export const decrypt = (str) => {
    return AES.decrypt(str,CK, {iv : IV}).toString(enc.Utf8);
}

export const toHash = (str) => {
    return SHA3(str).toString()
}


export const theme = createMuiTheme({
    direction : 'rtl',
    overrides: {
        margin : '0px',
        padding : '0px'
    },
    palette : {
        secondary : {
            main : '#ffffff',
        }
    },
    typography:{
        h1 : {
            fontSize : "28pt",
            fontWeight : 'bold',
        },
        h2 : {
            fontSize : "24pt",
        },
        h3:{
            fontSize : "12pt",
            textAlign : 'center',
            fontWeight : 'bolder',
        },
        h6:{
            fontSize : '18pt',
            textAlign : 'center',
        },
        body2 : {
            fontSize : '11pt',
        }
    },
    overrides : {
        MuiTableCell : {
            root : {
                width : '25%',
            }
        },
    }
},heIL)