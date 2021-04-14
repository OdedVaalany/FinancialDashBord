import { Button, ButtonGroup, Card, CardActions, CardContent, CardHeader, Checkbox, Collapse, FormControl, FormControlLabel, IconButton, makeStyles, Paper, Switch, TextField, Typography } from '@material-ui/core'
import React, { useContext, useState } from 'react'
import { encrypt, ServerURL, theme } from '../GlobalStatic'
import { FundContext } from './Dashbord';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import { UserContext } from './Father';
import ChipsField from './ChipsField';
import axios from 'axios';
import { useSnackbar } from 'notistack';

export default function PushMovement() {
    const {enqueueSnackbar} = useSnackbar();
    const {UserData,setUserData} = useContext(UserContext);
    const {Fund, setFund} = useContext(FundContext);
    const [type, setType] = useState(-1);
    const [show,setShow] = useState(true)
    const [fromFund, setFromFund] = useState(false);
    const [name, setName] = useState('');
    const [value, setValue] = useState(0);
    const [date, setDate] = useState((new Date()));
    const [note, setNote] = useState('');
    const [tags, setTags] = useState([]);
    
    const update = () => async() => {
        let eTags = [];
        tags.forEach(e => eTags.push(encrypt(e)));
        let b = await axios.patch(`${ServerURL}users/push-movement/${UserData._id}/?fund=${Fund === -1 ? UserData.funds[0]._id : Fund}`,{
            name : encrypt(name),
            value : encrypt(type * value),
            date : date,
            note : encrypt(note),
            tags : eTags,
        });
        if(b.data){
            enqueueSnackbar('התנועה עודכנה',{variant:'success',autoHideDuration : 4000});
            if(fromFund){
                let b = await axios.patch(`${ServerURL}users/push-movement/${UserData._id}/?fund=${UserData.funds[0]._id}`,{
                    name : encrypt(name),
                    value : encrypt(-1 * value * type),
                    date : date,
                    note : encrypt(note),
                    tags : eTags,
                });
            }
            setUserData(null);
            let f = Fund;
            await setFund(undefined);
            await setFund(Fund);
        }
        else{
            enqueueSnackbar('לא הצלחנו לעדכן את התנועה',{variant:'error',autoHideDuration : 4000});
        }

    }

    const classes = useStyle(theme);
    return (
        <Card variant='outlined'>
            <CardHeader title='הוסף תנועה' action={<IconButton onClick={e => setShow(!show)}>{show ? <ArrowDropUpIcon/> : <ArrowDropDownIcon/>}</IconButton>}/>
            <Collapse in={show}>
                <CardContent className={classes.container}>
                    <TextField label='שם התנועה' variant='outlined'
                    defaultValue={name}
                    error = {name === null || name === false}
                    onChange={e => setName(e.target.validity.valid ? e.target.value : false)}
                    />
                    <ButtonGroup color='primary'>
                        <Button variant={type === 1 ? 'contained' : 'outlined'} onClick={e => setType(1)}>הכנסה</Button>
                        <Button variant={type === -1 ? 'contained' : 'outlined'} onClick={e => setType(-1)}>הוצאה</Button>
                    </ButtonGroup>
                    <TextField label='ערך' type='number' variant='outlined'
                    defaultValue='0'
                    error={value === null || value === false}
                    onChange={e => setValue(e.target.validity.valid ? e.target.valueAsNumber : false)}
                    />
                    <TextField label='תאריך' type='date' variant='outlined'
                    error = {date === false || date > (new Date()).getTime()}
                    onChange={e => {setDate(e.target.validity.valid ? e.target.valueAsDate : false);console.log(e.target.valueAsDate);}}
                    defaultValue={`${(new Date()).getFullYear()}-${(new Date()).getMonth() + 1 > 10 ? (new Date()).getMonth() + 1 : '0' +((new Date()).getMonth() + 1)}-${(new Date()).getDate() > 10 ? (new Date()).getDate() : '0' +(new Date()).getDate() }`}
                    InputLabelProps={{shrink : true}}
                    />
                    <TextField label='הערות' multiline={true} row={3} maxRows={3}
                    error = {note === false}
                    onChange={e => setNote(e.target.validity.valid ? e.target.value : false)}
                    />
                    <ChipsField update={{setTags}} />
                    <FormControlLabel disabled={!(Fund !== -1 && Fund !== UserData.funds[0]._id)} control={<Switch color='primary' onClick={e=> setFromFund(!Fund)}/>} label={<Typography variant='body1'>המתוך/אל החשבון</Typography>} />
                </CardContent>
                <CardActions>
                    <Button variant='contained' color='primary' onClick={update()}>צור</Button>
                </CardActions>
            </Collapse>
        </Card>
    )
}

const useStyle = makeStyles(theme => ({
    container : {
        padding : '10px',
    }
}));