import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import MuiInput from '@mui/material/Input';
import PsychologyAltIcon from '@mui/icons-material/PsychologyAlt';

const Input = styled(MuiInput)`
  width: 2.8em;
`;

export default function ConfidenceThresholdSlider({ maxConf = 99, minConf = 1, confidenceThreshold, setConfidenceThreshold }) {

    const handleSliderChange = (event, newValue) => {
        setConfidenceThreshold(newValue);
    };

    const handleInputChange = (event) => {
        setConfidenceThreshold(event.target.value === '' ? Number(minConf) : Number(event.target.value));
    };

    const handleBlur = () => {
        if (confidenceThreshold < minConf) {
            setConfidenceThreshold(minConf);
        } else if (confidenceThreshold > maxConf) {
            setConfidenceThreshold(maxConf);
        }
    };



    return (
        <Box sx={{ width: 250 }}>
            <Typography id="input-slider" gutterBottom>
                Confidence Threshold
            </Typography>
            <Grid container spacing={2} alignItems="center">
                <Grid item>
                    <PsychologyAltIcon />
                </Grid>
                <Grid item xs>
                    <Slider
                        value={confidenceThreshold}
                        onChange={handleSliderChange}
                        min={minConf}
                        max={maxConf}
                        aria-labelledby="input-slider"
                    />
                </Grid>
                <Grid item>
                    <Input
                        value={confidenceThreshold}
                        size="small"
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        inputProps={{
                            step: 1,
                            min: minConf,
                            max: maxConf,
                            type: 'number',
                            'aria-labelledby': 'input-slider',
                        }}
                    />%
                </Grid>
            </Grid>
        </Box>
    );
}