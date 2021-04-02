import { Button, ButtonGroup, FormControl, InputLabel, makeStyles, MenuItem, Paper, Select } from '@material-ui/core'
import { Skeleton } from '@material-ui/lab';
import React, { useContext, useEffect, useState } from 'react'
import { theme } from '../GlobalStatic';
import { FundContext } from './Dashbord';
import { UserContext } from './Father';

export default function FundSelect() {
    const classes = useStyle(theme);
    const {Fund, setFund} = useContext(FundContext)
    const {UserData,setUserData} = useContext(UserContext);
    const [Funds, setFunds] = useState([]);
    const load = () => {
        let a = [];
        a.push({name: 'הכל' ,value : -1});
        a.push({name: 'קופה כללית' ,value : 0});
        for (let i = 1; i < UserData.funds.length; i++) {
            a.push({name : UserData.funds[i].name, value : i})
        }
        setFunds(a);
    }
    
    useEffect(() => {
        load();
    }, [UserData])
    
    return (
        <React.Fragment>
            <FormControl>
                    <Select
                    className={classes.select}
                    onChange={e => {setFund(e.target.value); setUserData(null);}}
                    value={Fund}
                    labelId='fund-select'>
                            {
                                Funds.map(e => <MenuItem key={e.value} value={e.value}>{e.name}</MenuItem>)
                            }
                    </Select>
            </FormControl>
        </React.Fragment>
    )
}

export function FundSelectSkeleton() {
    const classes = useStyle(theme);
    return (
        <Skeleton variant='rect' width='200px' height='40px' className={classes.container}/>
    )
}

const useStyle = makeStyles(theme => ({
    container : {
        padding : '10px',
        width : '99%',
        display : 'flex',
        flexDirection : 'rows',
        justifyContent : 'space-around',
        margin : '10px'
    },
    select : {
        color : 'white',
        width : '200px',
        margin : '10px',
    }
}));