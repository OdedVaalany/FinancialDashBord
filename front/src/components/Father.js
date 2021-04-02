import React, {useState,createContext} from 'react'
import { ThemeProvider } from '@material-ui/core/styles';
import Dashbord from './Dashbord.js';
import { formatMs, IconButton, Typography} from '@material-ui/core';
import Home from './Home';
import { SnackbarProvider} from 'notistack';
import { StylesProvider, jssPreset } from '@material-ui/core/styles';
import { create } from 'jss';
import rtl from 'jss-rtl';
import CloseIcon from '@material-ui/icons/Close';
import { ServerURL, theme } from '../GlobalStatic';
import axios from 'axios';

export const UserContext = createContext(null);

export default function Father() {
    /*window.addEventListener('beforeunload', async(e) => {
        if(sessionStorage.getItem('id') !== null || localStorage.getItem('id') !== null){
            await axios.get(ServerURL + `users/close-connect/${sessionStorage.getItem('id') !== null ? sessionStorage.getItem('id') : localStorage.getItem('id')}`);
        }
    })*/
    const jss = create({ plugins: [...jssPreset().plugins, rtl()] });
    const notistackRef = React.createRef();
    const onClickDismiss = key => () => { 
    notistackRef.current.closeSnackbar(key);
    }
    const [UserData, setUserData] = useState(null)
    return (
        <React.Fragment>
            <UserContext.Provider value={{UserData,setUserData}}>
                <StylesProvider jss={jss}>
                    <ThemeProvider theme={theme}>
                        <SnackbarProvider maxSnack={5} ref={notistackRef} anchorOrigin={{horizontal: 'center', vertical : 'top'}}
                        TransitionProps={{direction : 'down'}}
                        action={(key) => (
                                <IconButton onClick={onClickDismiss(key)}><CloseIcon/></IconButton>
                        )}>
                            {
                                sessionStorage.getItem('id') === null && localStorage.getItem('id') === null?  <Home/> : <Dashbord/>
                            }
                        </SnackbarProvider>
                    </ThemeProvider>
                </StylesProvider>
            </UserContext.Provider>
        </React.Fragment>
    )
}

/*
const data = [
    {
        first_name : "",
        last_name : "",
        birthday : 3000,
        gender : "male",
        email : "avoded2@gmail.com",
        phone : {
            code : "+972",
            number : "546862210",
        },
        status : "acitve",
        verify : {
            code : null,
            code_expire : 453875968453,
        },
        client : "private",
        logs : [
            {
                open : 443454534,
                close : 34545345345,
            }
        ],
        version : '1.0',
        admin : true,
        funds : [{
            kind : 'general',
            movements : [{
                _id : {$oid : '53534545345345'},
                kind : 'outcome',
                value : 405,
                labels : ['army','payment'],
                date : 44539450,
            }],
            open : 4534545345,
            active : true,
            growth : null,
            periods : null,
        }]
    }
]

*/