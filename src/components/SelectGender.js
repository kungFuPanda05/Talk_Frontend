'use client';
import { useState } from "react";
import {
    div,
    Button,
    Checkbox,
    FormControlLabel,
    Typography,
    MenuItem,
    Select
} from "@mui/material";
import { Check, Male, Female, Shuffle } from "@mui/icons-material";

import styles from '../styles/selectGender.module.scss'

const SelectGender = ({ setConnecting, selectedGender, setSelectedGender, setDont, profile }) => {
    const [checked, setChecked] = useState(false);

    const handleGenderSelect = (gender) => {
        setSelectedGender(gender);
    };
    const handleConnecting = () => {
        setConnecting(true);
        if(checked) setDont(true);
    }
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Typography variant="h6">Please select your preferred gender</Typography>
                <Typography variant="body2" color="textSecondary">
                    Preferred gender leads to 10 point deduction
                </Typography>
            </div>
            <div className={styles['point-box']}>
                <Typography variant="body1">Current coins: <strong>{profile.coins}</strong></Typography>
            </div>
            <div className={styles['icon-box']}>
                <div
                    onClick={() => handleGenderSelect('M')}
                    className={`${styles['m-container']}`}
                >
                    <Male className={`${styles.icon} ${styles.male}`} />
                    <Typography variant="caption">10P</Typography>
                    {selectedGender === 'M' && <Check className={styles.checkIcon} />}
                    <Typography>Male</Typography>
                </div>
                <div
                    onClick={() => handleGenderSelect('F')}
                    className={`${styles['f-container']}`}
                >
                    <Female className={`${styles.icon} ${styles.female}`} />
                    <Typography variant="caption">10P</Typography>
                    {selectedGender === 'F' && <Check className={styles.checkIcon} />}
                    <Typography>Female</Typography>
                </div>
                <div
                    onClick={() => handleGenderSelect('R')}
                    className={`${styles['r-container']}`}
                >
                    <Shuffle className={`${styles.icon} ${styles.random}`} />
                    <Typography variant="caption">0P</Typography>
                    {selectedGender === 'R' && <Check className={styles.checkIcon} />}
                    <Typography>Random</Typography>
                </div>
            </div>
            <div className={styles['do-not']}>
                <FormControlLabel
                    control={<Checkbox checked={checked} onChange={(e)=>setChecked(e.target.checked)} />}
                    label="Do not ask again"
                />
            </div>
            <div className={styles.buttons}>
                <Button variant="contained" color="primary">Buy Voucher</Button>
                <Button onClick={handleConnecting} variant="contained" color="secondary">Start</Button>
            </div>
        </div>
    )
}

export default SelectGender;