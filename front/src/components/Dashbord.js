import { AppBar, Button, colors, Grid, IconButton, makeStyles, Paper, Toolbar } from '@material-ui/core'
import axios from 'axios';
import React, { createContext, useContext, useEffect, useState } from 'react'
import { ServerURL, theme, toHash } from '../GlobalStatic';
import { UserContext } from './Father'
import FoundSelect, { FundSelectSkeleton } from './FoundSelect';
import Overview, { OverviewSkeleton } from './Overview';
import OpenFund from './OpenFund'
import PushMovement from './PushMovement';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import Movements from './Movements';
import PublishIcon from '@material-ui/icons/Publish';
import UploadFile from './UploadFile';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import { useSnackbar } from 'notistack';

export const FundContext = createContext(0);

export default function Dashbord() {
    const {enqueueSnackbar} = useSnackbar();
    const [Fund, setFund] = useState(-1);
    const [UD , setUD] = useState();
    const [OFShow , setOFShow] = useState(false)
    const [UFShow , setUFShow] = useState(false)
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

    const DeleteAll = () => async() => {
        let ans = prompt('הכנסה סיסמה לצורך מחיקת כל התנועות','');
        if(UserData.password === toHash(ans)){
            enqueueSnackbar('מתחיל במחיקת כל התנועות',{variant: 'success', autoHideDuration : 4000});
            let b = await axios.patch(`${ServerURL}users/delete-all-movements/${UserData._id}`);
            if(b.data){
                enqueueSnackbar('התנועות נמחקו בהצלחה',{variant: 'success', autoHideDuration : 4000});
                setUserData(null);
                let f = Fund;
                setFund(undefined);
                setFund(Fund);
            }
            else{
                enqueueSnackbar('לא התאפשר למחוק את כל התנועות',{variant: 'error', autoHideDuration : 4000});
            }
        }
        else
        enqueueSnackbar('סיסמה לא נכונה',{variant: 'error', autoHideDuration : 4000});
    }
    return (
        <React.Fragment>
            <FundContext.Provider value={{Fund,setFund}}>
            <OpenFund in={OFShow} handleCloseOpenFund={e => {setOFShow(false)}}/>
            <UploadFile in={UFShow} handleCloseOpenFund={e => {setUFShow(false)}}/>
            <AppBar color='primary' variant='elevation' position='sticky'>
                <Toolbar className={classes.tool_bar}>
                    <div className={classes.tools}>
                        {UserData === null ? <FundSelectSkeleton/> : <FoundSelect/>}
                        <IconButton onClick={e => {setOFShow(true)}}><AddCircleIcon color='secondary' fontSize='large' /></IconButton>
                        <IconButton onClick={e => {setUFShow(true)}}><PublishIcon color='secondary' fontSize='large' /></IconButton>
                        <IconButton onClick={DeleteAll()}><DeleteForeverIcon color='secondary' fontSize='large' /></IconButton>
                    </div>
                    <Button color='inherit' onClick={logOut()} style={{width : '100px'}} >התנתק</Button>
                </Toolbar>
            </AppBar>
                <Grid container spacing={1} className={classes.grid_container}>
                    <Grid item xs={12}>
                    {UserData === null ? <OverviewSkeleton/> : <Overview/>}
                    </Grid>
                    <Grid item xs={4}>
                        {UserData === null ? undefined : <PushMovement/>}
                    </Grid>
                    <Grid item xs={8}>
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