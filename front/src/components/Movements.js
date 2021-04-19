import { CardContent, CardHeader, Card, Accordion, AccordionSummary, AccordionDetails, Typography, Box, makeStyles, FormHelperText } from '@material-ui/core'
import React, { useContext, useEffect, useState } from 'react'
import { decrypt, theme } from '../GlobalStatic';
import { FundContext } from './Dashbord'
import { UserContext } from './Father';
import MovementItem from './MovementItem';
import MovementMonthHeader from './MovementMonthHeader';

export default function Movements() {
    const classes = useStyle(theme);
    const {Fund} = useContext(FundContext);
    const {UserData} = useContext(UserContext);
    const [movements, setMovements] = useState([]);

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

    const search = (array,value) => {
        for (let i = 0; i < array.length; i++) {
            if(array[i].head === value) return i;
        }
        return -1; 
    }
    const load = () => {
        let m = [];
        let d = [];
        UserData.funds.forEach(fnd => {
            if(Fund === -1){
                m.push(...fnd.movements);
            }
            else if(Fund === fnd._id){
                m.push(...fnd.movements);
            }
        });
        m.forEach( e => {
            let edate = new Date(e.date);
            let ans =search(d,`${edate.getFullYear()}-${edate.getMonth() + 1 > 10 ? edate.getMonth() + 1 : '0' +(edate.getMonth() + 1)}-01`);
            if(ans === -1){
                d.push({head : `${edate.getFullYear()}-${edate.getMonth() + 1 > 10 ? edate.getMonth() + 1 : '0' +(edate.getMonth() + 1)}-01`, body : [e] });
            }
            else{
                d[ans].body.push(e);
            }
        })
        d = d.sort((a,b) => ( (new Date(b.head)).getTime() - new Date(a.head).getTime()))
        setMovements(d);
    }

    useEffect(() => {
        load();
        }, [,Fund])
    return (
        <Card>
            <CardHeader title='רשימת תנועות'/>
            <CardContent>
                {
                    movements.map(data => (
                        <MovementMonthHeader data={data}/>
                    ))
                }
            </CardContent>
        </Card>
    )
}

const useStyle = makeStyles(theme => ({
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