import { Card, CardContent, CardHeader, makeStyles, Paper, Select, Typography } from '@material-ui/core'
import { Skeleton } from '@material-ui/lab'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { decrypt, theme } from '../GlobalStatic'
import { UserContext } from './Father';

export default function Overview() {
    const classes = useStyle(theme);
    const {UserData,setUserData} = useContext(UserContext);
    const [data,setData] = useState([]);

    useEffect(() => {
        load_data();
    }, [UserData])

    const load_data = () => {
        if(UserData !== null){
            let a = [];
            let sum1,sum2,sum3,sum4,sum5,sum6,sum7,sum8;
            sum1=sum2=sum3=sum4=sum5=sum6=sum7=sum8=0;
            UserData.funds[0].movements.forEach(element => {
                sum1 += eval(decrypt(element.value));
            });
            a.push({title : 'מאזן כללי',value : 56487});
            a.push({title : 'כל ההוצאות',value : 56487});
            a.push({title : 'כל ההכנסות',value : 56487});
            a.push({title : 'הוצאות בשלושים הימים האחרונים',value : 56487});
            a.push({title : 'הכנסות בשלושים הימים האחרונים',value : 56487});
            a.push({title : 'כל ההכנסות',value : 56487});
            a.push({title : 'מאזן כללי',value : 56487});
            a.push({title : 'כל ההוצאות',value : 56487});
            a.push({title : 'כל ההכנסות',value : 56487});
            a.push({title : 'הוצאות בשלושים הימים האחרונים',value : 56487});
            a.push({title : 'הכנסות בשלושים הימים האחרונים',value : 56487});
            a.push({title : 'כל ההכנסות',value : 56487});
            setData(a);
        }
    }

    return (
        <Card variant='outlined'>
            <CardHeader title='מבט כללי'/>
            <CardContent className={classes.overview_container}>
                {data.map(e => (<Paper variant='outlined' key={Math.random()} className={classes.overview_block}>
                                <Typography variant='h3' align='center'>
                                    {e.title}
                                </Typography>
                                <Typography variant='body1' align='center'>
                                    {e.value}
                                </Typography>
                </Paper>))}
            </CardContent>
        </Card>
    )
}

export function OverviewSkeleton() {
    const classes = useStyle(theme);
    const {UserData,setUserData} = useContext(UserContext);
    let data = [0,1,2,3,4,5,6,7,8];
    return (
        <Card variant='outlined'>
            <CardHeader title={<Skeleton variant='text' width='50%'/>} subheader={<Skeleton variant='text' width='80%'/>}/>
            <CardContent className={classes.overview_container}>
                {data.map(e => <Skeleton key={e} variant='rect' width='100%' height={80} style={{margin : '5px auto',}}/>)}
            </CardContent>
        </Card>
    )
}


const useStyle = makeStyles(theme => ({
    overview_block : {
        padding : '5px',
        width : '100%',
        height : '75px',
        display : 'flex',
        flexDirection : 'column',
        justifyContent: 'space-around',
    },
    overview_container : {
        overflow : 'scroll',
        padding : '10px',
        display : 'grid',
        gridTemplateColumns : '1fr 1fr',
        gridGap : '10px',
    }
}))