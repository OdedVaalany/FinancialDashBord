import { Box, Button, ButtonGroup, FormControlLabel, Grid, IconButton, Input, InputAdornment, makeStyles, Slide, Switch, TextField, Typography } from '@material-ui/core'
import { useSnackbar } from 'notistack';
import React, { useContext, useState } from 'react'
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import { UserContext } from './Father';
import axios from 'axios';
import { encrypt, ServerURL, toHash } from '../GlobalStatic';
import { SHA3 } from 'crypto-js';

export default function SignIn(props) {
    const classes = useStyle();
    const {UserData,setUserData} = useContext(UserContext)
    const inputsStyle = 'outlined';
    const [Email, setEmail] = useState(null);
    const [Password, setPassword] = useState(null);
    const [SeePassword, setSeePassword] = useState(false);
    const [RemmemberMe, setRemmemberMe] = useState(false);
    const {enqueueSnackbar} = useSnackbar();

    const isVerify = () => {
        return !(Email != null && Email != false && Password != null && Password != false)
    }

    const GetFromDatabase = () => async() => {
        try {
            let user = await (await axios.get(ServerURL + `users/open-connect/?spec=${toHash(Password + Email)}`)).data;
            console.log(user);
            if(user === false)
                enqueueSnackbar('הפרטים שגויים',{variant : 'error', autoHideDuration : 5000});
            else{
                setUserData(user);
                RemmemberMe ? localStorage.setItem('id',user._id) : sessionStorage.setItem('id',user._id);
                window.location.reload();
            }
            
        } catch (error) {
            console.log(error)
            enqueueSnackbar('אין חיבור לשרת',{autoHideDuration : 5000, variant : 'warning'});
        }
    }
    return (
        <Slide in={props.open} direction='right'>
            <Box className={classes.background}>
                <Grid container spacing={1} className={classes.con}>
                    <Grid item xs={12}>
                        <TextField variant={inputsStyle} size='small' label='כתובת דואר אלקטרוני' placeholder='exemple@host.co.il' fullWidth required
                        inputProps={{pattern : '[A-Za-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$'}}
                        onChange={e => setEmail(e.target.validity.valid ? e.target.value.toLowerCase() : false)}
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
                    <Grid item xs={12}>
                        <FormControlLabel control={<Switch color='primary' onChange={e => setRemmemberMe(!RemmemberMe)}/>} label={<Typography variant='body2'>זכור אותי תמיד</Typography>}/>
                    </Grid>
                    <Grid item xs={12}>
                        <Button color='primary' variant='contained' fullWidth disabled={isVerify()} onClick={GetFromDatabase()}>התחבר</Button>
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
        top : '30%',
    },
    con : {
        display : 'flex',
        height : '40%'
    }
}))