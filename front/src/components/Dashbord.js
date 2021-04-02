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

export const FundContext = createContext(0);

export default function Dashbord() {
    const [Fund, setFund] = useState(0);
    const [OFShow , setOFShow] = useState(false)
    const classes = useStyle(theme);
    const {UserData,setUserData} = (useContext(UserContext));
    useEffect(async() => {
        setUserData(await (await axios.get(ServerURL + `users/get/?_id=${sessionStorage.getItem('id') || localStorage.getItem('id')}`)).data)
        console.log("hello load");
    }, [,UserData])
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
                    <Button variant='outlined' color='inherit' onClick={logOut()}>התנתק</Button>
                </Toolbar>
            </AppBar>
                <Grid container spacing={1} className={classes.grid_container}>
                    <Grid item xs={12} md={3}>
                        {UserData === null ? <OverviewSkeleton/> : <Overview/>}
                    </Grid>
                    <Grid container item xs={12} md={9} spacing={1}>
                        <Grid item xs={12}>
                            <PushMovement/>
                        </Grid>
                        <Grid item xs={12}>
                            <Paper elevation={2}>hello 5</Paper>
                        </Grid>
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