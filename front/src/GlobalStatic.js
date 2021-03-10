import { heIL } from '@material-ui/core/locale';
import { createMuiTheme} from '@material-ui/core/styles';

export const ServerURL = "http://127.0.0.1:5000/";


export const theme = createMuiTheme({
    direction : 'rtl',
    overrides: {
        margin : '0px',
        padding : '0px'
    },
    palette : {
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