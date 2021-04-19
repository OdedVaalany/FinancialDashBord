import { Box, Chip, Collapse, IconButton, Input, makeStyles, TextField, Typography } from '@material-ui/core'
import React, { useContext, useEffect, useState } from 'react'
import { decrypt, encrypt, ServerURL, theme } from '../GlobalStatic';
import DeleteIcon from '@material-ui/icons/Delete';
import axios from 'axios';
import { UserContext } from './Father';
import { useSnackbar } from 'notistack';
import { FundContext } from './Dashbord';
import EditIcon from '@material-ui/icons/Edit';
import MenuIcon from '@material-ui/icons/Menu';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import DoneIcon from '@material-ui/icons/Done';
import ChipsField from './ChipsField';

export default function MovementItem(props) {
    const classes = useStyle(theme);
    const {UserData,setUserData} = useContext(UserContext);
    const {enqueueSnackbar} = useSnackbar();
    const {Fund,setFund} = useContext(FundContext);
    const [name, setName] = useState(decrypt(props.data.name))
    const [value, setValue] = useState(eval(decrypt(props.data.value)))
    const [date, setDate] = useState(new Date(props.data.date));
    const [date2, setDate2] = useState(new Date(props.data.date));
    const [note, setNote] = useState(decrypt(props.data.note))
    const [tags, setTags] = useState([]);

    const [overflow,setOverflow] = useState(false);
    const [editMode,setEditMode] = useState(false);
    useEffect(() => {
        let ta = [];
        props.data.tags.forEach(e => {
            ta.push(decrypt(e));
        });
        setTags(ta);
    }, [])

    const closeTab = () => () => {
        setOverflow(false);
        setEditMode(false);
    }
    const openTab = () => () => {
        setOverflow(true);
    }

    useEffect(_ => setDate2(true),[date])

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

    const SaveEdit = () => async() => {
        let eTags = [];
        tags.forEach(t => eTags.push(encrypt(t)));
        let b = await axios.patch(`${ServerURL}users/edit-movement/${UserData._id}/?mov=${props.data._id}`,{
            name : encrypt(name),
            value : encrypt(value),
            date : date,
            note : encrypt(note),
            tags : eTags,
        });
        if(b.data){
            enqueueSnackbar('התנועה עודכנה',{autoHideDuration : 4000, variant : 'success'});
            setEditMode(false);
            setUserData(null);
            let f = Fund;
            setFund(undefined);
            setFund(Fund);
        }
        else{
            enqueueSnackbar('לא הצלחנו לעדכן את התנועה',{autoHideDuration : 4000, variant : 'error'});
        }
    }
    return (
        <Box onMouseLeave={closeTab()} onMouseEnter={openTab()} className={classes.cont} style={{background : value < 0 ? '#E98686' : '#B4D39C'}}>
                {
                    editMode ? (
                        <TextField 
                            defaultValue={name} variant='standard'
                            onChange={e => setName(e.target.validity.valid ? e.target.value : false)} 
                            error={!name}
                            inputProps={{pattern : '.{2,}'}} inputMode='text'/>
                    ) : (
                        <Typography variant='body2'>{name}</Typography>
                    )
                }
                {
                    editMode ? (
                        <TextField 
                            value={value < 0 ? 'הוצאה' : 'הכנסה'} variant='standard'
                            disabled={true}/>
                    ) : (
                        <Typography variant='body2'>{value < 0 ? 'הוצאה' : 'הכנסה'}</Typography>
                    )
                }
                {
                    editMode ? (
                        <TextField 
                            defaultValue={value} variant='standard'
                            onChange={e => setValue(e.target.validity.valid ? e.target.value : false)} 
                            error={!value}
                            style={{direction : 'ltr'}}
                            inputProps={{pattern : '[0-9-]{1,}',style : {textAlign : 'right'}}}/>
                    ) : (
                        <Typography variant='body2'>{value < 0 ? value * -1 : value}</Typography>
                    )
                }
                {
                    editMode ? (
                        <TextField
                            defaultValue={`${date.getFullYear()}-${date.getMonth() + 1 > 10 ? date.getMonth() + 1 : '0' +(date.getMonth() + 1)}-${date.getDate() > 10 ? date.getDate() : '0' +date.getDate() }`} variant='standard'
                            onChange={e => e.target.validity.valid ? setDate(e.target.valueAsDate) : setDate2(false)} type='date'
                            error={!date2}/>
                    ) : (
                        <Typography variant='body2'>{`${date.getDate() > 10 ? date.getDate() : '0' +date.getDate() }/${date.getMonth() + 1 > 10 ? date.getMonth() + 1 : '0' +(date.getMonth() + 1)}/${date.getFullYear()}`}</Typography>
                    )
                }
                <IconButton onClick={_ => setOverflow(!overflow)}>{overflow ? <ArrowDropUpIcon classes={{root : classes.icons}}/> : <ArrowDropDownIcon classes={{root : classes.icons}}/>}</IconButton>
                <Collapse in={overflow} classes={{wrapperInner : classes.coll_cont}} style={{gridColumn : '1/6'}}>
                    {
                        editMode ? (
                            <ChipsField tags={tags} update={{setTags}} />
                        ) : (<Box>{
                                tags.map(item => (
                                    <Chip label={item} onDelete={editMode ? e => {setTags(tags.filter(a => a !== item))} : undefined }/>
                                ))
                            }
                            </Box>)
                    }
                    {
                        editMode ? (
                            <IconButton onClick={SaveEdit()}><DoneIcon classes={{root : classes.icons}}/></IconButton>
                        ) : (
                            <IconButton onClick={_ => setEditMode(!editMode)}><EditIcon classes={{root : classes.icons}}/></IconButton>
                        )
                    }
                    <IconButton style={{gridColumn : '3/4'}} onClick={Delete()}><DeleteIcon classes={{root : classes.icons}}/></IconButton>
                </Collapse>
        </Box>
    )
}

const useStyle = makeStyles(theme => ({
    cont : {
        padding : '5px',
        background : '#fff',
        position : 'relative',
        top : '0px',
        right : '0px',
        left : '0px',
        zIndex : 2,
        transition : '.2s ease-in',
        display : 'grid',
        gridTemplateColumns : '1fr 1fr 1fr 1fr 48px',
        margin : '1px 0px',
        boxShadow : '1px 1px 3px rgba(0,0,0,.3)'
    },
    coll_cont : {
        display : 'grid',
        gridTemplateColumns : '1fr 48px 48px'
    },
    chips_box : {
        gridRow : '1/2',
        gridColumn : '1/7',
        border : '1px solid',
    },
    icons : {
        fill : 'white',
    }
}));

/*
<Box className={classes.cont}>
            <Typography variant='body2'>{name}</Typography>
            <Typography variant='body2'>{value > 0 ? 'הכנסה' : 'הוצאה'}</Typography>
            <Typography variant='body2' style={{direction : 'ltr'}}>{value}</Typography>
            <Typography variant='body2' style={{direction : 'ltr'}}>{`${date.getDate() > 10 ? date.getDate() : '0' +date.getDate() }/${date.getMonth() + 1 > 10 ? date.getMonth() + 1 : '0' +(date.getMonth() + 1)}/${date.getFullYear()}`}</Typography>
            <IconButton onClick={Delete()}><DeleteIcon/></IconButton>
            <IconButton onClick={Delete()}><DeleteIcon/></IconButton>
            <Box className={classes.chips_box}>
                {tags.map( e=> <Chip label={e} size='small' onDelete={el => console.log(e)}/>
                )}
            </Box>
        </Box>
*/