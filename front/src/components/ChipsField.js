import { Box, Chip, TextField } from '@material-ui/core'
import React, { useState } from 'react'

export default function ChipsField(props) {
    const [Tags, setTag] = useState(props.tags || []);
    const {setTags} = props.update;
    return (
            <Box>
                <TextField
                placeholder='ניתן להוסיף תגיות כאן'
                onKeyPress={e => {
                    if((e.key === ' ' || e.key === 'Enter') && e.target.value !== '' && e.target.value.indexOf(' ',0) === -1){
                        let b = [...Tags];
                        b = b.filter(ll => ll !== e.target.value);
                        b.push(e.target.value);
                        setTag(b);
                        setTags(b);
                        e.target.value = null;
                    }
                    if(e.target.value.indexOf(' ',0) !== -1)
                        e.target.value = '';
                }}
                />
                <Box>
                    {
                        Tags.map(e => (<Chip label={e} variant='outlined' size='small' onDelete={el => {
                            let b = Tags.filter((a) => a !== e);
                            setTag(b);
                            setTags(b);
                        }} />))
                    }
                </Box>
            </Box>
    )
}
