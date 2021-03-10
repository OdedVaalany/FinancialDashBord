import { Container, Grid, makeStyles, Paper, Tabs } from '@material-ui/core'
import React from 'react'
import Connections from './Connections';
export default function Home() {
    const classes = useStyle();
    return (
        <Container className={classes.background} fixed={true}>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={8}>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                <Connections className={classes.Forms}/>
                </Grid>
            </Grid>
            
        </Container>
    )
}

const useStyle = makeStyles((theme) => ({
    background : {
        margin: "0px auto",
        padding: "3vh",
        height: `100vh`
    },

    Forms : {
        width : "100%",
        height : "94vh",
    }
}))
