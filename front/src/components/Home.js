import { Button, ButtonGroup, Container, Fade, Grid, makeStyles, Paper, Slide, Tabs, Typography } from '@material-ui/core'
import { TabPanel } from '@material-ui/lab';
import React, { useState } from 'react'
import Connections from './Connections';
import SignIn from './SignIn';
import SignUp from './SignUp';
import Forget from './Forget';

export default function Home() {
    const [state, setstate] = useState(0);

    const classes = useStyle();
    return (
        <Container className={classes.background} fixed={true}>
                <Paper elevation={5} variant='elevation' className={classes.Forms}>
                    <ButtonGroup color='default' fullWidth size='small' variant='contained' className={classes.Tabs}>
                        <Button variant={state === 0 ? 'text' : undefined} onClick={_ => setstate(0)}>התחברות</Button>
                        <Button variant={state === 1 ? 'text' : undefined} onClick={_ => setstate(1)}>הרשמה</Button>
                    </ButtonGroup>
                    <SignUp open={state == 1} />
                    <SignIn open={state == 0} />
                    <Forget open={state == 2} />
                </Paper>
        </Container>
    )
}

const useStyle = makeStyles((theme) => ({
    background : {
        margin: "0px auto",
        padding: "3vh",
        height: `100vh`,
    },
    
    Forms : {
        maxWidth : "400px",
        display : 'block',
        margin :  `${(window.innerHeight-500)/2}px auto`,
        minHeight : '480px',
        overflow : 'hidden',
        position : 'relative'
    },
    Tabs : {
        position : 'absolute',
        bottom : '0px',
        height : '30px',
        borderRadius : '0px',
        zIndex : 3,
    }
}))
/*
<Button variant={state === 2 ? 'contained' : undefined} onClick={_ => setstate(2)}>שכחתי סיסמה</Button>
*/