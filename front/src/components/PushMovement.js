import { Button, ButtonGroup, Card, CardContent, CardHeader, makeStyles, Paper, TextField } from '@material-ui/core'
import React from 'react'
import { theme } from '../GlobalStatic'

export default function PushMovement() {
    const classes = useStyle(theme);
    return (
        <Card variant='outlined'>
            <CardHeader title='הוסף תנועה'/>
            <CardContent className={classes.container}>

                <Paper variant='outlined'>
                    <TextField/>
                </Paper>
            </CardContent>
        </Card>
    )
}

const useStyle = makeStyles(theme => ({
    container : {
        padding : '10px',
    }
}));