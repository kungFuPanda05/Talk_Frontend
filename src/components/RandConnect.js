'use client';
import { useState } from "react";
import { 
    Box,
    Button,
    Checkbox,
    FormControlLabel,
    Typography,
    MenuItem,
    Select
 } from "@mui/material";
import { Check, Male, Female, Shuffle } from "@mui/icons-material";

const RandConnect = ({setRandomConnect, selectedGender, setSelectedGender}) => {
    const [language, setLanguage] = useState('English');
    const [region, setRegion] = useState('Global (Free)');

    const handleGenderSelect = (gender) => {
        setSelectedGender(gender);
    };

    return (
        <div style={styles.container}>
            <Box
                width={'90%'}
                height={'90%'}
                padding={'10px'}
                borderRadius={'8px'}
            >
                {/* Gender Selection Section */}
                <Box style={styles.box}>
                    <Typography variant="h6">Please select your preferred gender and language</Typography>
                    <Typography variant="body2" color="textSecondary">
                        When you meet your preferred gender, 10 points will be deducted.
                    </Typography>
                </Box>
                
                {/* Current Point */}
                <Box style={styles.pointBox}>
                    <Typography variant="body1">Current point: <strong>7</strong></Typography>
                </Box>

                {/* Gender Icons */}
                <Box style={styles.iconBox}>
                    <Box 
                        style={{ ...styles.iconItem, borderColor: selectedGender === 'M' ? 'blue' : 'lightgray' }}
                        onClick={() => handleGenderSelect('M')}
                    >
                        <Male style={styles.icon} />
                        <Typography variant="caption">10P</Typography>
                        {selectedGender === 'M' && <Check style={styles.checkIcon} />}
                        <Typography>Male</Typography>
                    </Box>
                    <Box 
                        style={{ ...styles.iconItem, borderColor: selectedGender === 'F' ? 'blue' : 'lightgray' }}
                        onClick={() => handleGenderSelect('F')}
                    >
                        <Female style={styles.icon} />
                        <Typography variant="caption">10P</Typography>
                        {selectedGender === 'F' && <Check style={styles.checkIcon} />}
                        <Typography>Female</Typography>
                    </Box>
                    <Box 
                        style={{ ...styles.iconItem, borderColor: selectedGender === 'R' ? 'blue' : 'lightgray' }}
                        onClick={() => handleGenderSelect('R')}
                    >
                        <Shuffle style={styles.icon} />
                        <Typography variant="caption">0P</Typography>
                        {selectedGender === 'R' && <Check style={styles.checkIcon} />}
                        <Typography>Random</Typography>
                    </Box>
                </Box>

                {/* Dropdowns */}
                <Box style={styles.dropdowns}>
                    <Select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        variant="outlined"
                        fullWidth
                    >
                        <MenuItem value={'English'}>English</MenuItem>
                        <MenuItem value={'Spanish'}>Spanish</MenuItem>
                        <MenuItem value={'French'}>French</MenuItem>
                    </Select>
                </Box>
                <Box style={styles.dropdowns}>
                    <Select
                        value={region}
                        onChange={(e) => setRegion(e.target.value)}
                        variant="outlined"
                        fullWidth
                    >
                        <MenuItem value={'Global (Free)'}>Global (Free)</MenuItem>
                        <MenuItem value={'USA'}>USA</MenuItem>
                        <MenuItem value={'Europe'}>Europe</MenuItem>
                    </Select>
                </Box>

                {/* Ad Banner */}
                <Box style={styles.adBanner}>
                    <Typography variant="body2" color="primary">
                        Get points after watching ads (1P) 
                    </Typography>
                    <img src="https://via.placeholder.com/300x50" alt="Ad" style={styles.adImage} />
                </Box>

                {/* Checkbox */}
                <Box style={styles.checkBox}>
                    <FormControlLabel
                        control={<Checkbox />}
                        label="Do not ask again"
                    />
                </Box>

                {/* Buttons */}
                <Box style={styles.buttonBox}>
                    <Button variant="contained" color="primary">Buy Voucher</Button>
                    <Button onClick={()=>setRandomConnect(true)} variant="contained" color="secondary">Start</Button>
                </Box>
            </Box>
        </div>
    );
};

const styles = {
    container: {
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: '#f9f9f9',
        marginTop: '-14px'
    },
    box: {
        marginBottom: '15px',
        textAlign: 'center',
    },
    pointBox: {
        marginBottom: '15px',
        textAlign: 'center',
    },
    iconBox: {
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '20px',
    },
    iconItem: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '120px',
        height: '120px',
        borderRadius: '50%',
        border: '2px solid lightgray',
        position: 'relative',
        cursor: 'pointer',
        margin: '5px'
    },
    icon: {
        fontSize: '60px',
        marginBottom: '5px',
    },
    checkIcon: {
        position: 'absolute',
        top: 0,
        right: 0,
        fontSize: '20px',
        color: 'green',
    },
    dropdowns: {
        marginBottom: '15px',
    },
    adBanner: {
        marginBottom: '20px',
        textAlign: 'center',
    },
    adImage: {
        width: '100%',
        height: '50px',
    },
    checkBox: {
        marginBottom: '20px',
        textAlign: 'left',
    },
    buttonBox: {
        display: 'flex',
        justifyContent: 'space-between',
    },
};

export default RandConnect;
