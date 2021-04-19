import { colors } from '@material-ui/core';
import { heIL } from '@material-ui/core/locale';
import { createMuiTheme} from '@material-ui/core/styles';
import { AES, enc, SHA3 } from 'crypto-js';

export const ServerURL = "http://127.0.0.1:5000/";
const CK = SHA3('Avoded2082').toString();
const IV = '1324576890abctrfd'

export const shortNum = (num) => {
    return (parseInt(num* 100)/100.0)
}

export const encrypt = (str) => {
    str = str.toString();
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
    palette : {
        primary : {
            main : '#003049',
        },
        secondary : {
            main : '#EAE2B7',
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
            alignSelf : 'center'
        }
    },
    props : {
        MuiTextField : {
            size : 'small',
            fullWidth : true,
            variant : 'outlined',
        },
        MuiButton : {
            size : 'large',
            fullWidth : 'true',
            variant : 'outlined',
        },
        MuiButtonGroup : {
            fullWidth : true,
        },
        MuiChip : {
            size : 'small',
        }
    },
    overrides : {
        MuiTableCell : {
            root : {
                width : '25%',
            }
        },
        MuiCard : {
            root : {
                padding : '10px',
                background: 'rgba(255,255,255,0.55)',
                boxShadow: '0 8px 32px 0 rgba( 31, 38, 135, 0.37 )',
                backdropFilter: 'blur( 15.0px )',
                borderRadius: '10px',
                border: '1px solid rgba( 255, 255, 255, 0.18 )',
                borderRadius : '10px'
            }
        },
        MuiCardContent : {
            root : {
                background : 'rgba(0,0,0,0)',
            }
        },
        MuiTextField : {
            root : {
                margin : '5px auto',
            }
        },
        MuiChip : {
            root : {
                margin : 'auto 3px',
            }
        }
    },
},heIL)


