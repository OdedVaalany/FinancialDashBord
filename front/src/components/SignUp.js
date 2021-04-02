import { Box, Button, ButtonGroup, Checkbox, FormControl, FormControlLabel, Grid, IconButton, Input, InputAdornment, makeStyles, Slide, TextField, Typography } from '@material-ui/core'
import { useSnackbar } from 'notistack';
import React, { useState } from 'react'
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import { encrypt, ServerURL, toHash } from '../GlobalStatic'
import axios from 'axios';

export default function SignUp(props) {
    const classes = useStyle();
    const inputsStyle = 'outlined';
    const [FirstName, setFirstName] = useState(null);
    const [LastName, setLastName] = useState(null);
    const [Gender, setGender] = useState("other");
    const [Email, setEmail] = useState(null);
    const [Password, setPassword] = useState(null);
    const [SeePassword, setSeePassword] = useState(false);
    const [Cellphone, setCellphone] = useState(null);
    const [Birthday, setBirthday] = useState(null);
    const [Consent, setConsent] = useState(false);
    const {enqueueSnackbar} = useSnackbar();

    const isVerify = () => {
        return !(FirstName != false && FirstName != null && LastName != false && LastName != null && Email != false && Email != null && Cellphone != null && Cellphone != false && Birthday != null && Password != null && Password != false && Consent)
    }

    const PostToDatabase = () => async() => {
        enqueueSnackbar('נראה שהכל תקין מעבד נתונים',{variant : 'info', autoHideDuration : '4000'});
        let user = await axios.post(ServerURL + `users/`,{
                spec : toHash(Password + Email),
                first_name : encrypt(FirstName),
                last_name : encrypt(LastName),
                birthday : encrypt(Birthday.toString()),
                gender : encrypt(Gender),
                email : encrypt(Email),
                password : toHash(Password),
                phone : {
                    code : "+972",
                    number : encrypt(Cellphone),
                },
                status : encrypt("active"),
                client : encrypt("private"),
                version : 1,
                admin : false,
            });
            console.log(user.data);
            if(user.data != null){
                console.log(user.data);
                enqueueSnackbar('נראה שהכל תקין מעבד נתונים',{variant : 'success', autoHideDuration : '4000'});
                window.location.reload();
            } 
            else{
                enqueueSnackbar('בעיה קרתה נסה שוב',{variant : 'error', autoHideDuration : '4000'});
            }
    }

    const VerifyEmail = () => async() => {
        if(Email !== false && Email !== null){
            if((await axios.get(ServerURL + `users/email-exist/?email=${encrypt(Email)}`)).data){
                enqueueSnackbar('נראה כי כתובת מייל זה כבר תפוסה במערכת שלנו',{variant : 'error', autoHideDuration : '5000'});
                setEmail(false);
            }
            else{
                enqueueSnackbar('המייל אינו נמצא במערכת, נהדר!',{variant : 'success', autoHideDuration : '5000'});
            }
        }
    }

    return (
        <Slide in={props.open} direction='left'>
            <Box className={classes.background}>
                <Grid container spacing={1} className={classes.con}>
                    <Grid item sm={6} xs={12}>
                        <TextField variant={inputsStyle} size='small' label="שם פרטי" required fullWidth
                        inputProps={{pattern : '.{2,}'}}
                        onChange={e => setFirstName(e.target.validity.valid ? e.target.value : false)}
                        error={FirstName === false}
                        />
                    </Grid>
                    <Grid item sm={6} xs={12}>
                        <TextField variant={inputsStyle} size='small' label="שם משפחה"  required fullWidth
                        inputProps={{pattern : '.{2,}'}}
                        onChange={e => setLastName(e.target.validity.valid ? e.target.value : false)}
                        error={LastName === false}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <ButtonGroup size='medium' color='primary' fullWidth>
                            <Button onClick={ _ => setGender("male")} variant={Gender === 'male' ? 'contained' : 'outlined'}>זכר</Button>
                            <Button onClick={ _ => setGender("female")} variant={Gender === 'female' ? 'contained' : 'outlined'}>נקבה</Button>
                            <Button onClick={ _ => setGender("other")} variant={Gender === 'other' ? 'contained' : 'outlined'}>אחר</Button>
                        </ButtonGroup>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField variant={inputsStyle} size='small' label='כתובת דואר אלקטרוני' placeholder='exemple@host.co.il' fullWidth required
                        inputProps={{pattern : '[A-Za-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$'}}
                        onChange={e => setEmail(e.target.validity.valid ? e.target.value.toLowerCase() : false)}
                        onBlur ={VerifyEmail()}
                        error={Email === false}
                         />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField variant={inputsStyle} size='small' type={SeePassword ? 'text' : 'password'} label='סיסמה' fullWidth required
                        inputProps={{pattern : '(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}'}}
                        onChange={e => setPassword(e.target.validity.valid ? e.target.value: false)}
                        error={Password === false}
                        InputProps={{endAdornment : (<InputAdornment position='end'>
                            <IconButton onClick={e => setSeePassword(!SeePassword)}>{SeePassword ? <VisibilityOffIcon/> : <VisibilityIcon/>}</IconButton>
                        </InputAdornment>)}}
                         />
                    </Grid>
                    <Grid item sm={6} xs={12}>
                        <TextField variant={inputsStyle} size='small' label='מספר טלפון נייד' fullWidth required
                        inputProps={{pattern : '[0-9]{10,10}'}}
                        onChange={e => setCellphone(e.target.validity.valid ? e.target.value : false)}
                        error={Cellphone === false}
                        />
                    </Grid>
                    <Grid item sm={6} xs={12}>
                        <TextField variant={inputsStyle} size='small' type='date' label='תאריך יום הולדת'   fullWidth required InputLabelProps={{shrink : true}} 
                        onChange={e => setBirthday(e.target.validity.valid ? e.target.valueAsNumber : null)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <FormControlLabel control={<Checkbox color='primary' onChange={e => setConsent(!Consent)}/>} label={<Typography variant='body2'>אני מודע כי האתר ניסיוני ואינו לוקח אחריות בכל  מאורע</Typography>}/>
                    </Grid>
                    <Grid item xs={12}>
                        <Button color='primary' variant='contained' fullWidth disabled={isVerify()} onClick={PostToDatabase()}>הירשם</Button>
                    </Grid>
                    
                </Grid>

            </Box>
        </Slide>
    )
}

const useStyle = makeStyles((theme) => ({
    background : {
        minHeight : '450px',
        height : '450px',
        padding : '10px',
        position : 'absolute',
        top : '0px',
    },
    con : {
        display : 'flex',
        height : '100%'
    }
}))