import { AppBar, Button, colors, Grid, IconButton, makeStyles, Paper, Toolbar } from '@material-ui/core'
import axios from 'axios';
import React, { createContext, useContext, useEffect, useState } from 'react'
import { ServerURL, theme } from '../GlobalStatic';
import { UserContext } from './Father'
import FoundSelect, { FundSelectSkeleton } from './FoundSelect';
import Overview, { OverviewSkeleton } from './Overview';
import OpenFund from './OpenFund'
import PushMovement from './PushMovement';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import Movements from './Movements';

export const FundContext = createContext(0);

export default function Dashbord() {
    const [Fund, setFund] = useState(-1);
    const [UD , setUD] = useState();
    const [OFShow , setOFShow] = useState(false)
    const classes = useStyle(theme);
    const {UserData,setUserData} = (useContext(UserContext));
    useEffect(async() => {
        let data = await (await axios.get(ServerURL + `users/get/?_id=${sessionStorage.getItem('id') || localStorage.getItem('id')}`)).data;
        setUserData(data);
        console.log("hello load");
        setUD(data);
    }, [,Fund])

    window.addEventListener('beforeunload', async(e) => {
        e.preventDefault();
        logOut();
        e.returnValue = '';

    })
    const logOut = () => async() => {
        await axios.get(ServerURL + `users/close-connect/${sessionStorage.getItem('id') !== null ? sessionStorage.getItem('id') : localStorage.getItem('id')}`);
        sessionStorage.getItem('id') !== null ? sessionStorage.clear('id') : localStorage.clear('id');
        setUserData(null);
        window.location.reload();
    };
    return (
        <React.Fragment>
            <FundContext.Provider value={{Fund,setFund}}>
            <OpenFund in={OFShow} handleCloseOpenFund={e => {setOFShow(false)}}/>
            <AppBar color='primary' variant='elevation' position='sticky'>
                <Toolbar className={classes.tool_bar}>
                    <div className={classes.tools}>
                        {UserData === null ? <FundSelectSkeleton/> : <FoundSelect/>}
                        <IconButton onClick={e => {setOFShow(true)}}><AddCircleIcon color='secondary' fontSize='large' /></IconButton>
                    </div>
                    <Button color='inherit' onClick={logOut()} style={{width : '100px'}} >התנתק</Button>
                </Toolbar>
            </AppBar>
                <Grid container spacing={1} className={classes.grid_container}>
                    <Grid container item xs={12} md={4} spacing={1} alignContent='flex-start'>
                        <Grid item xs={12}>
                        {UserData === null ? undefined : <PushMovement/>}
                        </Grid>
                        <Grid item xs={12}>
                            {UserData === null ? <OverviewSkeleton/> : <Overview/>}
                        </Grid>
                    </Grid>
                    <Grid item xs={12} md={8}>
                        {UserData === null ? undefined : <Movements />}
                    </Grid>
                </Grid>
            </FundContext.Provider>
        </React.Fragment>
    )
}

const useStyle = makeStyles(theme => ({
    grid_container : {
        padding : '10px',
        width : '100%',
        margin : '0px auto',
    },
    tool_bar : {
        display: 'flex',
        justifyContent : 'space-between'
    },
    tools : {
        display: 'flex',
        justifyContent : 'space-between',
        alignContent : 'center',
    }
}))