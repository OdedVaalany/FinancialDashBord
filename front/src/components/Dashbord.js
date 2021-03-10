import { AppBar, Box, Button, ButtonGroup, Card, CardContent, CardHeader, Chip, Container, FormGroup, Grid, IconButton, Input, InputLabel, makeStyles, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Toolbar, Typography } from '@material-ui/core'
import { red } from '@material-ui/core/colors';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { ServerURL, theme } from '../GlobalStatic';
import { UserContext } from './Father';
import { Skeleton } from '@material-ui/lab';
import { useSnackbar } from 'notistack';
import DeleteIcon from '@material-ui/icons/Delete';

export default function Dashbord() {
    const {User_Data,setUser_Data} = useContext(UserContext);
    const FindSavedUser = async() =>{
        if(sessionStorage.getItem("_id") !== null){
            setUser_Data((await axios.get(`${ServerURL}users/EDXX4jCQs/?_id=${sessionStorage.getItem("_id")}`)).data[0]);
        }
        else if(localStorage.getItem("_id") !== null){
            setUser_Data((await axios.get(`${ServerURL}users/EDXX4jCQs/?_id=${localStorage.getItem("_id")}`)).data[0]);
        }
    }
    useEffect(() => {
        FindSavedUser();
    }, [])

    const isLoad = () => {
        return User_Data !== null;
    }
    const classes = useStyle();
    return (
        <React.Fragment>
            <AppBar variant='elevation' color='default' position='sticky'>
                <Toolbar className={classes.Toolbar}>
                    <Typography variant='h1' color='primary'>מבט פיננסי</Typography>
                    <Button variant='outlined' color='primary' onClick={e => {
                        sessionStorage.clear("_id");
                        localStorage.clear("_id");
                        setUser_Data(null);
                    }}>התנתק</Button>
                </Toolbar>
            </AppBar>
            <Grid container spacing={1} className={classes.HomeGrid}>
                <Grid item xs={12}>
                    <OverviewCard/>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <PushMovement/>
                </Grid>
                <Grid item xs={12} sm={8}>
                    <MovementsCard/>
                </Grid>
            </Grid>
        </React.Fragment>
    )
}

function PushMovement(){
    const {enqueueSnackbar} = useSnackbar();
    const classes = useStyle();
    const {User_Data,setUser_Data} = useContext(UserContext);
    const [Name, setName] = useState(null);
    const [Value, setValue] = useState(null);
    const [Kind, setKind] = useState('הכנסה');
    const [Labels, setLabels] = useState([]);
    const [Note, setNote] = useState(null);
    const [_Date, setDate] = useState(new Date());
    const [Cause, setCause] = useState(5);
    useEffect(() => {
    }, [])
    const Push = async() => {
        enqueueSnackbar("בונה את התנועה",{variant : 'info', autoHideDuration : 5000});
        let ans = await axios.post(ServerURL + `users/EDXX4jCQs/movements/?_id=${User_Data._id.$oid}`, {
            Name : Name,
            Value : Number(Value),
            Date : _Date,
            Cause : Cause,
        });
        if(ans.data !== null){
            setUser_Data(ans.data);
            window.location.reload();
            enqueueSnackbar("תנועה נרשמה",{variant : 'success', autoHideDuration : 5000});
        }
        else{
            enqueueSnackbar("כשל בעדכון המידע",{variant : 'error', autoHideDuration : 5000});
        }
    }

    const deleteLabel = (value) => () => {
        console.log("hello");
        setLabels(Labels.filter(e => e !== value));
    }
    return(
        <Card variant='outlined'>
            <CardHeader
            title='הוסף תנועה'
            />
            <CardContent>
                <TextField type='select'variant='outlined' label='שם' fullWidth
                onChange={e => setName(e.target.validity.valid ? e.target.value : false)}
                inputProps={{pattern : '.{2,}'}} className={classes.PMField}
                error={Name === false}
                helperText={Name === false ? 'אנא הזן שם לתנועה' : null}
                />

                <ButtonGroup fullWidth color='primary' onClick={e => setKind(e.target.innerHTML)} size='large'>
                    <Button variant={Kind === 'הוצאה' ? 'contained' : 'outlined'}>הוצאה</Button>
                    <Button variant={Kind === 'הכנסה' ? 'contained' : 'outlined'}>הכנסה</Button>
                    <Button variant={Kind === 'חיסכון' ? 'contained' : 'outlined'}>חיסכון</Button>
                </ButtonGroup>

                <TextField variant='outlined' label='סכום' fullWidth type='number'
                onChange={e => setValue(e.target.validity.valid ? e.target.value : false)}
                error={Value === false} className={classes.PMField} inputProps={{pattern : '[0-9-]{2,}'}}
                dir='ltr'
                helperText={Value === false ? 'יכול להכיל רק מספרים' : null}
                />
                <TextField variant='outlined' type='date' label='תאריך' fullWidth
                onChange={e => setDate(e.target.valueAsDate)}
                InputLabelProps={{shrink : true}}
                className={classes.PMField}
                defaultValue={`${_Date.getFullYear()}-${_Date.getMonth()+1 < 10 ? '0' + (_Date.getMonth()+1) : _Date.getMonth()+1}-${_Date.getDate() < 10 ? '0' + _Date.getDate() : _Date.getDate()}`}
                dir='rtl'
                />
                <TextField variant='outlined' label='הערה' fullWidth
                onChange={e => setNote(e.target.value)} className={classes.PMField}/>
                <TextField variant='outlined' label='תגית' fullWidth
                onKeyPress={e => {if(e.which === 32 || e.which == 13){Labels.push(e.target.value);e.target.value = null;console.log(Labels);}}} className={classes.PMField}/>
                <Box>
                { Labels.map(ele => (<Chip label={ele} key={Math.random()} onDelete={deleteLabel(ele)}/>)) }
                </Box>
                <Button fullWidth variant='contained' color='primary'
                disabled={!(Value !== null && Value !== false && Name !== null && Name !== false)}
                onClick={Push}
                >
                    הוסף תנועה
                </Button>
            </CardContent>
        </Card>
    )
}


function OverviewCard() {
    const classes = useStyle();
    const {User_Data} = useContext(UserContext);
    const [SumUp, setSumUp] = useState(0);
    const [SumAllOutcome, setSumAllOutcome] = useState(0);
    const [SumAllIncome, setSumAllIncome] = useState(0);
    const [SumAllOutcomeCurrentYear, setSumAllOutcomeCurrentYear] = useState(0);
    const [SumAllIncomeCurrentYear, setSumAllIncomeCurrentYear] = useState(0);
    const [SumAllOutcomeCurrentYearAndMonth, setSumAllOutcomeCurrentYearAndMonth] = useState(0);
    const [SumAllIncomeCurrentYearAndMonth, setSumAllIncomeCurrentYearAndMonth] = useState(0);
    useEffect(() => {
        if(User_Data != null && User_Data.Movements.length > 0){
            let sum_up = 0;
            let sum_all_outcome = 0;
            let sum_all_income = 0;
            let sum_all_outcome_current_year = 0;
            let sum_all_income_current_year = 0;
            let sum_all_outcome_current_year_and_month = 0;
            let sum_all_income_current_year_and_month = 0;
            User_Data.Movements.forEach(element => {
                sum_up+= element.Value;
                sum_all_outcome += element.Value < 0 ? element.Value : 0;
                sum_all_income += element.Value > 0 ? element.Value : 0;
                sum_all_outcome_current_year += element.Value < 0 && (new Date(element.Date)).getFullYear() === (new Date()).getFullYear() ? element.Value : 0;
                sum_all_income_current_year += element.Value > 0 && (new Date(element.Date)).getFullYear() === (new Date()).getFullYear() ? element.Value : 0;
                sum_all_outcome_current_year_and_month += element.Value < 0 && (new Date(element.Date)).getFullYear() === (new Date()).getFullYear() && (new Date(element.Date)).getMonth() === (new Date()).getMonth() ? element.Value : 0;
                sum_all_income_current_year_and_month += element.Value > 0 && (new Date(element.Date)).getFullYear() === (new Date()).getFullYear() && (new Date(element.Date)).getMonth() === (new Date()).getMonth() ? element.Value : 0;
            });
            setSumUp(sum_up);
            setSumAllOutcome(sum_all_outcome);
            setSumAllIncome(sum_all_income);
            setSumAllIncomeCurrentYear(sum_all_income_current_year);
            setSumAllOutcomeCurrentYear(sum_all_outcome_current_year);
            setSumAllOutcomeCurrentYearAndMonth(sum_all_outcome_current_year_and_month);
            setSumAllIncomeCurrentYearAndMonth(sum_all_income_current_year_and_month);
        }
    }, [User_Data])
    return (
        <Card variant='outlined'>
            <CardHeader
            title={User_Data === null ? (<Skeleton variant='text'/>) : `במיוחד בשבילך  ${User_Data.Firstname}, מבט כללי`}
            subheader={User_Data === null ? (<Skeleton variant='text'/>) : `עודכן לאחרונה ב${(new Date()).getDate()}/${(new Date()).getMonth()}/${(new Date()).getFullYear()}`}
            />
            <CardContent className={classes.OVContent}>
                <Paper className={classes.OVRubik}>
                    <Typography variant='h3' align='center'>סך הכל</Typography>
                    <Typography variant='h6' dir='ltr'>{SumUp}</Typography>
                </Paper>
                <Paper className={classes.OVRubik}>
                    <Typography variant='h3'>כל ההכנסות</Typography>
                    <Typography variant='h6' dir='ltr'>{SumAllIncome}</Typography>
                </Paper>
                <Paper className={classes.OVRubik}>
                    <Typography variant='h3'>כל ההוצאות</Typography>
                    <Typography variant='h6' dir='ltr'>{SumAllOutcome}</Typography>
                </Paper>
                <Paper className={classes.OVRubik}>
                    <Typography variant='h3'>הכנסות לשנת {(new Date()).getFullYear()}</Typography>
                    <Typography variant='h6' dir='ltr'>{SumAllIncomeCurrentYear}</Typography>
                </Paper>
                <Paper className={classes.OVRubik}>
                    <Typography variant='h3'>הוצאות לשנת {(new Date()).getFullYear()}</Typography>
                    <Typography variant='h6' dir='ltr'>{SumAllOutcomeCurrentYear}</Typography>
                </Paper>
                <Paper className={classes.OVRubik}>
                    <Typography variant='h3'>הכנסות חודשיות</Typography>
                    <Typography variant='h6' dir='ltr'>{SumAllIncomeCurrentYearAndMonth}</Typography>
                </Paper>
                <Paper className={classes.OVRubik}>
                    <Typography variant='h3'>הוצאות חודשיות</Typography>
                    <Typography variant='h6' dir='ltr'>{SumAllOutcomeCurrentYearAndMonth}</Typography>
                </Paper>
            </CardContent>
        </Card>
    )
}

function MovementsCard() {
    const classes = useStyle();
    const {User_Data,setUser_Data} = useContext(UserContext);
    var rows = null;

    return(
        <Card variant='outlined'>
            <CardHeader
            title='טבלת תנועות'
            />
            <CardContent>
                <TableContainer>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                שם הפעולה
                            </TableCell>
                            <TableCell>
                                ערך הפעולה
                            </TableCell>
                            <TableCell>
                                תאריך ביצוע
                            </TableCell>
                            <TableCell>
                                סוג הפעולה
                            </TableCell>
                            <TableCell>
                                hello
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            User_Data === null ? 
                            [0,1,2,3,4].map( e => (<TableRow key={e}>
                                <TableCell>
                                    <Skeleton variant='text'/>
                                </TableCell>
                                <TableCell>
                                    <Skeleton variant='text'/>
                                </TableCell>
                                <TableCell>
                                    <Skeleton variant='text'/>
                                </TableCell>
                                <TableCell>
                                    <Skeleton variant='text'/>
                                </TableCell>
                                <TableCell>
                                    <Skeleton variant='text'/> 
                                </TableCell>
                            </TableRow>)) : User_Data.Movements.map(e => (<MovementRow data={e} key={e._id.$oid}/>))
                        }
                    </TableBody>
                </TableContainer>
            </CardContent>
        </Card>
    );
}

function MovementRow(props){
    const {User_Data,setUser_Data} = useContext(UserContext);
    var Kind = null;
    switch(props.data.Kind){
        case 0 :
            Kind = 'העברה בנקאית';
            break;
        case 1 :
            Kind = 'משכורת';
            break;
        case 2 :
            Kind = 'משיכת מזומן';
            break;
        case 3 :
            Kind = 'צ׳ק';
            break;
        case 4 :
            Kind = 'אשראי';
            break;
        case 5 :
            Kind = 'אחר';
            break;
    }
    const deleteMovement = async() => {
        let user = await axios.delete(ServerURL + `users/EDXX4jCQs/movements/?_id=${User_Data._id.$oid}&uuid=${props.data._id.$oid}`);
        setUser_Data(user.data)
        window.location.reload();

    }
    return(
        <TableRow>
            <TableCell>
                {props.data.Name}
            </TableCell>
            <TableCell>
                <Typography variant='body1' dir='ltr' align='left'>{props.data.Value}</Typography>
            </TableCell>
            <TableCell>
                {`${(new Date(props.data.Date)).getDate() < 10 ? '0' + (new Date(props.data.Date)).getDate() : (new Date(props.data.Date)).getDate()}-${(new Date(props.data.Date)).getMonth()+1 < 10 ? '0' + ((new Date(props.data.Date)).getMonth()+1) : (new Date(props.data.Date)).getMonth()+1}-${(new Date(props.data.Date)).getFullYear()}`}
            </TableCell>
            <TableCell>
                { Kind}
            </TableCell>
            <TableCell>
                <IconButton  onClick={deleteMovement}><DeleteIcon/></IconButton>
            </TableCell>
        </TableRow>
    )
}

const useStyle = makeStyles((theme) => ({
    HomeGrid : {
        padding : "10px",
    },
    Toolbar : {
        display : 'flex',
        justifyContent : 'space-between'
    },
    OVContent : {
        overflowX: 'scroll',
        overflow : 'scroll',
        display : 'flex',
    },
    OVRubik : {
        minWidth : "200px",
        height : "150px",
        margin : 'auto 10px',
    },
    PMField : {
        margin : '5px auto',
    },
}))