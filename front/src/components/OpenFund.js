import { Button, Dialog, Fade, FormControlLabel, makeStyles, Switch, TextField, Typography } from '@material-ui/core'
import axios from 'axios';
import { enc } from 'crypto-js';
import { useSnackbar } from 'notistack';
import React, { useContext, useState } from 'react'
import { encrypt, ServerURL, theme, toHash } from '../GlobalStatic';
import { FundContext } from './Dashbord';
import { UserContext } from './Father';

export default function OpenFund(props) {
    const {enqueueSnackbar} = useSnackbar();
    const {UserData,setUserData} = useContext(UserContext);
    const {Fund,setFund} = useContext(FundContext);
    const classes = useStyle(theme);
    const [fromFund, setFromFund] = useState(false);
    const [name, setName] = useState(null);
    const [kind, setKind] = useState('חיסכון');
    const [openDate, setOpenDate] = useState((new Date(Date.now)));
    const [growth, setGrowth] = useState(0.1);
    const [periods, setPeriods] = useState(4);
    const [first, setFirst] = useState(100);

    const canOpen = () => {
        return name !== null && name !== false && name !== '' && kind !== null && kind !== false && kind !== '' && openDate !== null && openDate !== '' && growth != null && growth != '' && growth !== false && periods !== null && periods !== '' && periods !== false && first !== false;
    } 

    const open = () => async() => {
        enqueueSnackbar('יוצרים קשר עם השרת',{autoHideDuration : 4000, variant : 'info'});
        let b =await axios.patch( `${ServerURL}users/open-fund/${UserData._id}`,{
            kind : 'saveing',
            name : encrypt(name),
            movements : first > 0 ? [{name : encrypt('first'), value : encrypt(first), date : openDate , note : '' , tags : []}] : [],
            open : openDate,
            active : toHash(true),
            growth : encrypt(growth),
            periods : encrypt(periods),
        })
        console.log("hello");
        if(b.data !== false){
            enqueueSnackbar(`הקופה ${name} נפתחה בהצלחה`, {autoHideDuration : 4000 , variant : 'success'});
            props.handleCloseOpenFund();
            setUserData(null);
            await setFund(undefined);
            await setFund(-1);
        }
        else{
            enqueueSnackbar('ישנה בעייה ביצירת הקופה', {autoHideDuration : 4000, variant : 'error'})
        }
    }

    return (
        <React.Fragment>
            <Dialog open={props.in} onClose={props.handleCloseOpenFund} classes={{paper : classes.container}}>
                <Typography variant='h1'>צור קופה חדשה</Typography>
                <TextField label='שם החיסכון' 
                onChange={e => setName(e.target.validity.valid ? e.target.value : false)}
                 />
                 <TextField label='סוג הקופה' disabled={true} defaultValue={kind}
                 />
                 <TextField label='תאריך פתיחת הקופה' type='date' InputLabelProps={{shrink : true}}
                 defaultValue={`${(new Date()).getFullYear()}-${(new Date()).getMonth() + 1 > 10 ? (new Date()).getMonth() + 1 : '0' +((new Date()).getMonth() + 1)}-${(new Date()).getDate() > 10 ? (new Date()).getDate() : '0' +(new Date()).getDate() }`}
                onChange={e => setOpenDate(e.target.validity.valid ? e.target.valueAsDate : false)}
                error={openDate === false || openDate > (new Date()) || openDate === ''}
                 />
                 <TextField label='גדילת הקופה' type='number' helperText='גדילה באחוזים'
                 defaultValue={0.1}
                onChange={e => setGrowth(e.target.validity.valid ? (e.target.valueAsNumber + 100)/100 : false)}
                error={growth === false || growth <= 0 || growth === ''}
                 />
                 <TextField label='פרקי זמן' type='number' helperText='משך מחזוריות החיסכון בחודשים'
                 defaultValue={4}
                onChange={e => setPeriods(e.target.validity.valid ? (Math.floor(e.target.valueAsNumber)) : false)}
                error={periods === false || periods <= 0 || periods === ''}
                 />
                 <TextField label='סכום התחלתי' type='number'
                 defaultValue={100}
                onChange={e => setFirst(e.target.validity.valid ? (e.target.valueAsNumber) : false)}
                error={first === false || first <= 0 }
                 />
                 <FormControlLabel disabled={!(first > 0)} control={<Switch color='primary' onClick={e=> setFromFund(!Fund)}/>} label={<Typography variant='body1'>הכנסה ראשונה מתוך החשבון</Typography>} />

                 <Button onClick={open()} disabled={!canOpen()} color='primary' variant='contained'>צור</Button>
                 
            </Dialog>
        </React.Fragment>
    )
}

const useStyle = makeStyles(theme => ({
    container : {
        padding : '15px',
                minWidth: '300px',
                width : '400px'
    }
}))
