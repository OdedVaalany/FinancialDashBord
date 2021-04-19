import { Card, CardContent, CardHeader, Collapse, IconButton, makeStyles, Paper, Select, ThemeProvider, Typography, useTheme } from '@material-ui/core'
import { Skeleton } from '@material-ui/lab'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { decrypt, shortNum, theme } from '../GlobalStatic'
import { FundContext } from './Dashbord';
import { UserContext } from './Father';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';

export default function Overview() {
    const classes = useStyle(theme);
    const {Fund,setFund} = useContext(FundContext);
    const {UserData,setUserData} = useContext(UserContext);
    const [data,setData] = useState([]);
    const [wide,setWide] = useState(true);

    useEffect(() => {
        load_data();
    }, [UserData])

    const load_data = () => {
        if(UserData !== null){
            let a = [];
            let sum1,sum2,sum3,sum4,sum5,sum6,sum7,sum8,sum9;
            sum1=sum2=sum3=sum4=sum5=sum6=sum7=sum8=sum9=0;
            if(Fund === -1){
                UserData.funds.forEach(fnd => {
                    fnd.movements.forEach(e => {
                        sum1 += eval(decrypt(e.value));
                        sum2 += eval(decrypt(e.value)) < 0 ? eval(decrypt(e.value)) : 0;
                        sum3 += eval(decrypt(e.value)) > 0 ? eval(decrypt(e.value)) : 0;
                        sum4 += ((new Date()).getTime() - new Date(e.date).getTime())/(1000*60*60*24) <= 30 ? eval(decrypt(e.value)) : 0;
                        sum5 += ((new Date()).getTime() - new Date(e.date).getTime())/(1000*60*60*24) <= 30 && eval(decrypt(e.value)) < 0 ? eval(decrypt(e.value)) : 0;
                        sum6 += ((new Date()).getTime() - new Date(e.date).getTime())/(1000*60*60*24) <= 30 && eval(decrypt(e.value)) > 0 ? eval(decrypt(e.value)) : 0;
                        sum7 += ((new Date()).getTime() - new Date(e.date).getTime())/(1000*60*60*24) <= 365 ? eval(decrypt(e.value)) : 0;
                        sum8 += ((new Date()).getTime() - new Date(e.date).getTime())/(1000*60*60*24) <= 365 && eval(decrypt(e.value)) < 0 ? eval(decrypt(e.value)) : 0;
                        sum9 += ((new Date()).getTime() - new Date(e.date).getTime())/(1000*60*60*24) <= 365 && eval(decrypt(e.value)) > 0 ? eval(decrypt(e.value)) : 0;
                        
                    })
                })
            }
            else{
                UserData.funds.forEach(fnd => {
                    fnd.movements.forEach(e => {
                        if(fnd._id === Fund){
                            sum1 += eval(decrypt(e.value));
                            sum2 += eval(decrypt(e.value)) < 0 ? eval(decrypt(e.value)) : 0;
                            sum3 += eval(decrypt(e.value)) > 0 ? eval(decrypt(e.value)) : 0;
                            sum4 += ((new Date()).getTime() - new Date(e.date).getTime())/(1000*60*60*24) <= 30 ? eval(decrypt(e.value)) : 0;
                            sum5 += ((new Date()).getTime() - new Date(e.date).getTime())/(1000*60*60*24) <= 30 && eval(decrypt(e.value)) < 0 ? eval(decrypt(e.value)) : 0;
                            sum6 += ((new Date()).getTime() - new Date(e.date).getTime())/(1000*60*60*24) <= 30 && eval(decrypt(e.value)) > 0 ? eval(decrypt(e.value)) : 0;
                            sum7 += ((new Date()).getTime() - new Date(e.date).getTime())/(1000*60*60*24) <= 365 ? eval(decrypt(e.value)) : 0;
                            sum8 += ((new Date()).getTime() - new Date(e.date).getTime())/(1000*60*60*24) <= 365 && eval(decrypt(e.value)) < 0 ? eval(decrypt(e.value)) : 0;
                            sum9 += ((new Date()).getTime() - new Date(e.date).getTime())/(1000*60*60*24) <= 365 && eval(decrypt(e.value)) > 0 ? eval(decrypt(e.value)) : 0;
                        }
                    })
                })
            }
            a.push({title : 'מאזן כללי',value : shortNum(sum1)});
            a.push({title : 'כל ההוצאות',value : shortNum(sum2)});
            a.push({title : 'כל ההכנסות',value : shortNum(sum3)});
            a.push({title : 'מאזן בשלושים הימים האחרונים',value : shortNum(sum4)});
            a.push({title : 'הוצאות בשלושים הימים האחרונים',value : shortNum(sum5)});
            a.push({title : 'הכנסות בשלושים הימים האחרונים',value : shortNum(sum6)});
            a.push({title : 'מאזן בשנה האחרונה',value : shortNum(sum7)});
            a.push({title : 'הוצאות בשנה האחרונה',value : shortNum(sum8)});
            a.push({title : 'הכנסות בשנה האחרונה',value : shortNum(sum9)});
            setData(a);
        }
    }

    return (
        <Card variant='outlined'>
            <CardHeader title='מבט כללי' action={<IconButton onClick={e => setWide(!wide)}>{wide ? <ArrowDropUpIcon/> : <ArrowDropDownIcon/>}</IconButton>}/>
            <Collapse in={wide}>
                <CardContent className={classes.overview_container}>
                    {
                        data.map(item => (<Paper variant='outlined' className={classes.overview_block}>
                            <Typography variant='body2' align='center'>{item.title}</Typography>
                            <Typography variant='body1' style={{direction : 'ltr', textAlign : 'center'}}>{item.value}</Typography>
                        </Paper>))
                    }
                </CardContent>
            </Collapse>
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
        width : '250px',
        height : '75px',
        display : 'flex',
        flexDirection : 'column',
        justifyContent: 'space-around',
        backgroundColor : 'rgba(0,0,0,0)',
    },
    overview_container : {
        overflow : 'scroll',
        padding : '10px',
        display : 'flex',
        gridGap : '2px',
    },
    card : {
    }
}))