import React, {useState,useContext, createContext, useEffect} from 'react'
import { createMuiTheme, makeStyles, ThemeProvider } from '@material-ui/core/styles';
import wallpaper from '../sources/macos-big-sur-3840x2160-wwdc-2020-4k-22654.jpg'
import Dashbord from './Dashbord';
import { Button, Grow, Zoom } from '@material-ui/core';
import Home from './Home';
import { SnackbarProvider, useSnackbar } from 'notistack';
import { Snackbar } from '@material-ui/core';
import { StylesProvider, jssPreset } from '@material-ui/core/styles';
import { create } from 'jss';
import rtl from 'jss-rtl';
import axios from 'axios';
import { theme } from '../GlobalStatic';

export const UserContext = createContext(null);

export default function Father() {
    const jss = create({ plugins: [...jssPreset().plugins, rtl()] });
    const notistackRef = React.createRef();
    const onClickDismiss = key => () => { 
    notistackRef.current.closeSnackbar(key);
    }
    const [User_Data, setUser_Data] = useState(null)
    return (
        <React.Fragment>
            <UserContext.Provider value={{User_Data,setUser_Data}}>
                <StylesProvider jss={jss}>
                    <ThemeProvider theme={theme}>
                        <SnackbarProvider maxSnack={5} ref={notistackRef} anchorOrigin={{horizontal: 'left', vertical : 'bottom'}}
                        TransitionProps={{direction : 'left'}}
                        action={(key) => (
                                <Button variant='outlined' onClick={onClickDismiss(key)}>הסתר</Button>
                        )}>
                            {
                                sessionStorage.getItem("_id") === null && localStorage.getItem("_id") === null?  <Home/> : <Dashbord/>
                            }
                        </SnackbarProvider>
                    </ThemeProvider>
                </StylesProvider>
            </UserContext.Provider>
        </React.Fragment>
    )
}

const data = {
    "gender": "male",
    "name": {
        "title": "Mr",
        "first": "Corey",
        "last": "Schmidt"
    },
    "location": {
        "street": {
            "number": 7631,
            "name": "Groveland Terrace"
        },
        "city": "Orange",
        "state": "New South Wales",
        "country": "Australia",
        "postcode": 3965,
        "coordinates": {
            "latitude": "-85.0264",
            "longitude": "-164.0381"
        },
        "timezone": {
            "offset": "+4:30",
            "description": "Kabul"
        }
    },
    "email": "corey.schmidt@example.com",
    "login": {
        "uuid": "3dac5a33-d8c6-4564-b302-4f946b4b4438",
        "username": "beautifuldog375",
        "password": "colleen",
        "salt": "1IVzvzpS",
        "md5": "1e00e0701585261424374217c43d5f72",
        "sha1": "b8755cb81ed1922e50e8ef83c95bcc0df97fe82f",
        "sha256": "b4b9d59b747df087f14d9a8a48b9c6cda66f085a659a724aa2f133e0a6daa008"
    },
    "dob": {
        "date": "1998-07-24T05:16:50.499Z",
        "age": 23
    },
    "registered": {
        "date": "2012-03-10T00:04:26.473Z",
        "age": 9
    },
    "phone": "04-7262-2253",
    "cell": "0414-516-269",
    "id": {
        "name": "TFN",
        "value": "321426240"
    },
    "picture": {
        "large": "https://randomuser.me/api/portraits/men/29.jpg",
        "medium": "https://randomuser.me/api/portraits/med/men/29.jpg",
        "thumbnail": "https://randomuser.me/api/portraits/thumb/men/29.jpg"
    },
    "nat": "AU"
}
