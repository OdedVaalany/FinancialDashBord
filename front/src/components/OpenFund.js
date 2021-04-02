import { Dialog, Fade, TextField, Typography } from '@material-ui/core'
import React from 'react'

export default function OpenFund(props) {
    return (
        <React.Fragment>
            <Dialog open={props.in} onClose={props.handleCloseOpenFund}>
                <Typography variant='h1'>צור קופה חדשה</Typography>
            </Dialog>
        </React.Fragment>
    )
}
