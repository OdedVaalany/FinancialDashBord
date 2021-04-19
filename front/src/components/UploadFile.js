import { Button, Dialog, Fade, FormControlLabel, makeStyles, Switch, TextField, Typography } from '@material-ui/core'
import axios from 'axios';
import { enc } from 'crypto-js';
import { useSnackbar } from 'notistack';
import React, { useContext, useState } from 'react'
import { encrypt, ServerURL, theme, toHash } from '../GlobalStatic';
import { FundContext } from './Dashbord';
import { UserContext } from './Father';
import XLSX from 'xlsx';

export default function UploadFile(props) {
    const {enqueueSnackbar} = useSnackbar();
    const {UserData,setUserData} = useContext(UserContext);
    const {Fund,setFund} = useContext(FundContext);
    const classes = useStyle(theme);
    const [fromFund, setFromFund] = useState(false);
    const [File, setFile] = useState(null);
    const [kind, setKind] = useState('חיסכון');
    const [openDate, setOpenDate] = useState((new Date(Date.now)));
    const [growth, setGrowth] = useState(0.1);
    const [periods, setPeriods] = useState(4);
    const [first, setFirst] = useState(100);

    const load = async(File) => {
        let file = (new FileReader())
        file.addEventListener('load', (e) => {
            const wb = XLSX.read(e.target.result,{type : 'buffer'});
            const data = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
            console.log(data);
            try{
                data.forEach(item => {
                    let eTags =[];
                    item.tags.split(',').forEach(i => eTags.push(encrypt(i)));
                    let b = axios.patch(`${ServerURL}users/push-movement/${UserData._id}/?fund=${Fund === -1 ? UserData.funds[0]._id : Fund}`,{
                        name : encrypt(item.name || ''),
                        value : encrypt(item.value || ''),
                        date : new Date((item.date - (25567 + 1))*86400*1000),
                        note : item.note || '',
                        tags : eTags,
                    });
                })
                enqueueSnackbar('כל הרשומות הועלו בהצלחה',{variant:'success',autoHideDuration : 4000});
                setUserData(null);
                props.handleCloseOpenFund();
                let f = Fund;
                setFund(undefined);
                setFund(Fund);
            } catch (error) {
                console.log(error);
                enqueueSnackbar('לא הצלחנו להעלות את כל הרשומות',{variant:'error',autoHideDuration : 5000});
            }
        })
        file.readAsArrayBuffer(File);
    } 

    const open = () => async() => {
    }

    return (
        <React.Fragment>
            <Dialog open={props.in} onClose={props.handleCloseOpenFund} classes={{paper : classes.container}}>
                <Typography variant='h1'>העלאת נתונים</Typography>
                <TextField label='קובץ' type='file' InputLabelProps={{shrink : true}} inputProps={{accept : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'}}
                onChange={e => load((e.target.files[0]))}
                 />
                 <Button onClick={open()} color='primary' variant='contained'>דחוף נתונים</Button>
                 
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
