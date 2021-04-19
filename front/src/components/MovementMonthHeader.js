import { CardContent, CardHeader, Card, Accordion, AccordionSummary, AccordionDetails, Typography, Box, makeStyles, FormHelperText, Chip } from '@material-ui/core'
import React, { useContext, useEffect, useState } from 'react'
import { decrypt, theme, shortNum } from '../GlobalStatic';
import { FundContext } from './Dashbord'
import { UserContext } from './Father';
import MovementItem from './MovementItem';

export default function MovementMonthHeader(props) {
    const [infoString, setInfoString] = useState('')

    useEffect(() => {
        let inm=0,oum=0;
        let income=0,outcome=0;
        props.data.body.forEach(item => {
            let value = eval(decrypt(item.value));
            income += value > 0 ? value : 0;
            inm += value > 0 ? 1 : 0;
            outcome += value < 0 ? value : 0;
            oum += value < 0 ? 1 : 0;
        })
        setInfoString([<Chip label={`${inm} הכנסות ששוות: ${shortNum(income)}`}/>,<Chip label={`${oum} הוצאות ששוות: ${shortNum(outcome)}`}/>,<Chip label={`מאזן של: ${shortNum(income - outcome)}`}/>]);
    },[])
    const classes = useStyle(theme);
    const month_in_word = (e) => {
        switch(e){
            case 0 : 
                return 'ינואר'
                break;
            case 1 : 
                return 'פברואר'
                break;
            case 2 : 
                return 'מרץ'
                break;
            case 3 : 
                return 'אפריל'
                break;
            case 4 : 
                return 'מאי'
                break;
            case 5 : 
                return 'יוני'
                break;
            case 6 : 
                return 'יולי'
                break;
            case 7 : 
                return 'אוגוסט'
                break;
            case 8 : 
                return 'ספטמבר'
                break;
            case 9 : 
                return 'אוקטובר'
                break;
            case 10 : 
                return 'נובמבר'
                break;
            case 11 : 
                return 'דצמבר'
                break;
        }
    }
    return (
            <Accordion>
                <AccordionSummary classes={{content : classes.header}}>
                    <Typography variant='body1'>{`${month_in_word(new Date(props.data.head).getMonth())} ${(new Date(props.data.head)).getFullYear() === (new Date()).getFullYear() ? '' : (new Date(props.data.head)).getFullYear()}`}</Typography>
                    <Box className={classes.header_box}>
                        {[...infoString]}
                    </Box>
                </AccordionSummary>
                <AccordionDetails className={classes.cont}>
                    {
                        props.data.body.map(e=> {
                            let edate = new Date(e.date);
                            let head = new Date(props.data.head);
                            if(edate.getMonth() === head.getMonth() && edate.getFullYear() === head.getFullYear()){
                                return(
                                    <MovementItem data={e}/>
                                )
                            }
                        })
                    }
                </AccordionDetails>
            </Accordion>
    )
}

const useStyle = makeStyles(theme => ({
    header : {
        display : 'flex',
        flexDirection : 'row',
        justifyContent : 'space-between',
    },
    header_box : {
        display : 'flex',
        flexDirection : 'row',
        justifyContent : 'space-between',
        padding : '3px 5px',
    },
    cont : {
        display : 'flex',
        flexDirection : 'column',
    },
    box : {
        display : 'grid',
        gridTemplateColumns : '1fr 1fr 1fr',
        gridGap : '10px',
    }
}))
