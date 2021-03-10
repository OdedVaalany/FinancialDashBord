import { AppBar, Box, Button, ButtonGroup, FormControlLabel, Link, makeStyles, Paper, Switch, TextField, Typography } from '@material-ui/core'
import { red } from '@material-ui/core/colors';
import React, {useState, useContext} from 'react'
import {useSnackbar} from 'notistack'
import axios from 'axios';
import { ServerURL } from '../GlobalStatic';
import { UserContext } from './Father';

export default function Connections(props) {
    const [Form, setForm] = useState(true);
    const toggleForm = () => {
        setForm(!Form);
    }
    const classes = useStyle();
    return (
        <Box className={classes.Forms}>
            {
                Form ? <SignIn toggle={toggleForm}/> : <SignUp toggle={toggleForm}/>
            }
        </Box>
    )
}

function SignUp(props) {
    const classes = useStyle();
    const [FirstName, setFirstName] = useState(null)
    const [LastName, setLastName] = useState(null)
    const [Birthdate, setBirthdate] = useState(null)
    const [Email, setEmail] = useState(null);
    const [Password, setPassword] = useState(null);
    const [Gender, setGender] = useState(null);
    const [Confirmation, setConfirmation] = useState(false)
    const [Emailexist,setEmailexist] = useState(false)
    const {User_Data,setUser_Data} = useContext(UserContext);
    const {enqueueSnackbar} = useSnackbar();

    const existEmail = async() => {
        if(Email == null || Email == false) setEmailexist(false);
        setEmailexist(((await axios.get(`${ServerURL}users/EDXX4jCQs/?Email=${Email}`)).data).length > 0);
    }

    const canSubmit = () =>{
        return FirstName !== null && FirstName !== false && LastName !== null && LastName !== false && Gender !== null && Birthdate !== null && Birthdate !== false && Email !== null && Email !== false && Password !== null && Password !== false && Confirmation && !Emailexist;
    }

    const handelSubmit = async() =>{
        enqueueSnackbar("נראה שכל המידע שהזנת טוב, יוצרים קשר עם השרת",{variant : 'info', autoHideDuration : 5000});
        let body = {
                "Firstname" : FirstName,
                "Lastname" : LastName,
                "Email" : Email,
                "Password" : Password,
                "Gender" : Gender,
                "Birthday" : Birthdate,
                "Connect" : false,
                "JoinDate" : Date.now(),
                "Movements" : [],
                "Admin" : false,
                "UserVersion" : 1.0 
            };
            let data = (await axios.post(`${ServerURL}users/EDXX4jCQs/`,body)).data
            enqueueSnackbar("פרטיך נרשמו במערכת, מיד תועבר...",{variant : 'success', autoHideDuration : 3000});
            setUser_Data(data);
            window.location.reload();
    }
    return (
        <div className={classes.LogInDiv}>
            <Typography variant='h2' align='center'>
                הרשמה
            </Typography>
            <Typography variant='body1'>
                ההרשמה לאתר הינה חנימית
            </Typography>

            <TextField variant='outlined' fullWidth size='small'
            className={classes.LogInDivChilds}
            label='שם פרטי' 
            error={FirstName === false ? true : false}
            onChange={e => setFirstName(e.target.validity.valid ? (e.target.value === '' ? null : e.target.value.toLowerCase()) : false )}
            />

            <TextField variant='outlined' fullWidth size='small'
            className={classes.LogInDivChilds}
            label='שם משפחה' 
            error={LastName === false ? true : false}
            onChange={e => setLastName(e.target.validity.valid ? (e.target.value === '' ? null : e.target.value.toLowerCase()) : false )}
            />

            <TextField variant='outlined' fullWidth size='small'
            className={classes.LogInDivChilds} type='date'
            InputLabelProps={{shrink : true}}
            label='תאריך לידה' 
            error={Birthdate === false ? true : false}
            onChange={e => setBirthdate(e.target.valueAsNumber)}
            />

            <ButtonGroup fullWidth>
                <Button variant={Gender == 'male' ? 'contained' : 'outlined'} color='primary' onClick={e => setGender('male')}>male</Button>
                <Button variant={Gender == 'female' ? 'contained' : 'outlined'} color='primary' onClick={e => setGender('female')}>female</Button>
            </ButtonGroup>

            <TextField variant='outlined' fullWidth size='small'
            className={classes.LogInDivChilds}
            label='כתובת דואר אלקטרוני' 
            placeholder="SomeWord@Server.com"
            helperText= {Emailexist ? "מייל זה קיים במערכת" : ""}
            inputProps={{pattern : "[a-zA-Z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,}$",dir : 'ltr'}}
            error={Email === false || Emailexist ? true : false}
            onBlur={e => existEmail()}
            onChange={e => setEmail(e.target.validity.valid ? (e.target.value === '' ? null : e.target.value.toLowerCase()) : false )}
            />

            <TextField variant='outlined' fullWidth size='small'
            className={classes.LogInDivChilds}
            label='סיסמה' 
            inputProps={{pattern : "(?=.*d)(?=.*[a-z])(?=.*[A-Z]).{8,}",dir : 'ltr'}}
            error={Password === false ? true : false}
            onChange={e => setPassword(e.target.validity.valid ? (e.target.value === '' ? null : e.target.value) : false )}
            />

            <FormControlLabel label='אני מאשר שהאתר ניסיוני ואינו לוקח אחריות' control={<Switch checked={Confirmation} color='primary' onChange={e => setConfirmation(!Confirmation)}/> } />

            <Button variant='contained'
            disabled={!canSubmit()}
            onClick={handelSubmit}
            className={classes.LogInDivChilds} 
            color='primary' fullWidth>צור משתמש</Button>

            <Link underline='hover' onClick={props.toggle}>
                <Typography variant='body1' align='center'>
                משתמש רשום? להתחברות לחץ כאן
                </Typography>
            </Link>
        </div>
    )
}

function SignIn(props) {
    const classes = useStyle();
    const [Email, setEmail] = useState(null);
    const [Password, setPassword] = useState(null);
    const [Remmember, setRemmember] = useState(false)
    const {User_Data,setUser_Data} = useContext(UserContext);
    const {enqueueSnackbar} = useSnackbar();

    const handleSubmit = async() => {
        enqueueSnackbar("מושך נתונים מהשרת",{variant : 'info', autoHideDuration : 5000});
        let user = await (await axios.get(`${ServerURL}users/EDXX4jCQs/?Email=${Email}&Password=${Password}`)).data
        if(user.length == 0){
            enqueueSnackbar("לא קיים חשבון במערכת",{variant : 'error', autoHideDuration : 5000});
        }
        else{
            enqueueSnackbar("מצאנו את החשבון",{variant : 'success', autoHideDuration : 5000});
            Remmember ? localStorage.setItem("_id",user[0]._id.$oid) : sessionStorage.setItem("_id",user[0]._id.$oid);
            setUser_Data(user[0]);
        }
    }
    return (
        <div className={classes.LogInDiv}>
            <Typography variant='h2' align='center'>
                התחברות
            </Typography>

            <TextField variant='outlined' fullWidth size='small'
            className={classes.LogInDivChilds}
            label='כתובת דואר אלקטרוני' 
            placeholder="SomeWord@Server.com"
            inputProps={{pattern : "[a-zA-Z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,}$",dir : 'ltr'}}
            error={Email === false ? true : false}
            onChange={e => setEmail(e.target.validity.valid ? (e.target.value === '' ? null : e.target.value.toLowerCase()) : false )}
            />

            <TextField variant='outlined' fullWidth size='small'
            className={classes.LogInDivChilds}
            label='סיסמה' 
            inputProps={{pattern : "(?=.*d)(?=.*[a-z])(?=.*[A-Z]).{8,}",dir : 'ltr'}}
            error={Password === false ? true : false}
            onChange={e => setPassword(e.target.validity.valid ? (e.target.value === '' ? null : e.target.value) : false )}
            />

            <FormControlLabel label='זכור אותי תמיד' control={<Switch checked={Remmember} color='primary' onChange={e => setRemmember(!Remmember)}/> } />

            <Button variant='contained'
            className={classes.LogInDivChilds} 
            onClick={handleSubmit}
            disabled={Email === null || Email === false || Password === null || Password === false}
            color='primary' fullWidth>היכנס</Button>

            <Link underline='hover' onClick={props.toggle}>
                <Typography variant='body1' align='center'>
                עדיין אין לך משתמש? הירשם עכשיו!
                </Typography>
            </Link>
        </div>
    )
}

const useStyle = makeStyles((theme) => ({
    Forms : {
        width : "100%",
        height : "94vh",
        padding : '10px',
        display : "flex",
        flexDirection : "column",
        justifyContent : "center",
        alignContent : 'center',
    },

    LogInDiv : {
        display : "flex",
        flexDirection : "column",
        padding: '20px',
        borderRadius : '10px',
        boxShadow : 'inset 0px 3px 4px rgba(0,0,0,.3), 0px 3px 4px rgba(0,0,0,.3)',
        background : 'rgba(255,255,255,1)',
    },
    LogInDivChilds : {
        margin : "10px auto",
    }
}))

