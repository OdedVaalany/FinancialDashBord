import { Box, IconButton, makeStyles, Typography } from '@material-ui/core'
import React, { useContext, useEffect, useState } from 'react'
import { decrypt, ServerURL, theme } from '../GlobalStatic';
import DeleteIcon from '@material-ui/icons/Delete';
import axios from 'axios';
import { UserContext } from './Father';
import { useSnackbar } from 'notistack';
import { FundContext } from './Dashbord';

export default function MovementItem(props) {
    const {UserData,setUserData} = useContext(UserContext);
    const {enqueueSnackbar} = useSnackbar();
    const {Fund,setFund} = useContext(FundContext);
    const [name, setName] = useState(decrypt(props.data.name))
    const [value, setValue] = useState(eval(decrypt(props.data.value)))
    const [date, setDate] = useState(new Date(props.data.date));
    const [note, setNote] = useState(decrypt(props.data.note))
    const [tags, setTags] = useState()
    useEffect(() => {
        let ta = [];
        props.data.tags.forEach(e => {
            ta.push(decrypt(e));
        });
        setTags(ta);
    }, [])

    const Delete = () => async() => {
        let ans = await axios.delete(`${ServerURL}users/delete-movement/${UserData._id}/?mov=${props.data._id}`)
        if(ans.data){
            enqueueSnackbar('התנועה נמחקה לאלתר',{autoHideDuration : 4000, variant : 'success'});
            setUserData(null);
            let f = Fund
            await setFund(undefined);
            await setFund(Fund);
        }
        else{
            enqueueSnackbar('לא הצלחנו למחוק את התנועה',{autoHideDuration : 4000, variant : 'error'});
        }
    }

    const classes = useStyle(theme);
    return (
        <Box className={classes.cont}>
            <Typography variant='body2'>{name}</Typography>
            <Typography variant='body2' style={{direction : 'ltr'}}>{value}</Typography>
            <Typography variant='body2' style={{direction : 'ltr'}}>{`${date.getDate() > 10 ? date.getDate() : '0' +date.getDate() }/${date.getMonth() + 1 > 10 ? date.getMonth() + 1 : '0' +(date.getMonth() + 1)}/${date.getFullYear()}`}</Typography>
            <IconButton onClick={Delete()}><DeleteIcon/></IconButton>

        </Box>
    )
}

const useStyle = makeStyles(theme => ({
    cont : {
        display : 'grid',
        gridTemplateColumns : '1fr 1fr 1fr 1fr',
        gridGap : '10px',
        justifyContent : 'normal',
    }
}));