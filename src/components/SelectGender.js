'use client';
import { useState } from "react";
import {
    Button,
    Checkbox,
    FormControlLabel,
    Typography,
    Slider,
} from "@mui/material";
import { Check, Male, Female, Shuffle } from "@mui/icons-material";

import styles from '../styles/selectGender.module.scss';

const SelectGender = ({ setConnecting, selectedGender, setSelectedGender, setDont, profile, ratingRange, setRatingRange }) => {
    const [checked, setChecked] = useState(false);

    const handleGenderSelect = (gender) => {
        setSelectedGender(gender);
    };

    const handleConnecting = () => {
        setConnecting(true);
        if (checked) setDont(true);
    };

    const handleRatingChange = (event, newValue) => {
        setRatingRange(newValue);
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Typography variant="h5" className={styles.title}>
                    Select Your Preferred Gender and Rating
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    Selecting a preferred gender will cost 10 points.
                </Typography>
            </div>

            <div className={styles['point-box']}>
                <Typography variant="h6">
                    Current Coins: <strong>{profile?.coins}</strong>
                </Typography>
            </div>

            <div className={styles['icon-box']}>
                <div
                    onClick={() => handleGenderSelect('M')}
                    className={`${styles['m-container']} ${selectedGender === 'M' && styles.selected}`}
                >
                    <Male className={`${styles.icon} ${styles.male}`} />
                    <Typography variant="caption">10P</Typography>
                    {selectedGender === 'M' && <Check className={styles.checkIcon} />}
                    <Typography>Male</Typography>
                </div>
                <div
                    onClick={() => handleGenderSelect('F')}
                    className={`${styles['f-container']} ${selectedGender === 'F' && styles.selected}`}
                >
                    <Female className={`${styles.icon} ${styles.female}`} />
                    <Typography variant="caption">10P</Typography>
                    {selectedGender === 'F' && <Check className={styles.checkIcon} />}
                    <Typography>Female</Typography>
                </div>
                <div
                    onClick={() => handleGenderSelect('R')}
                    className={`${styles['r-container']} ${selectedGender === 'R' && styles.selected}`}
                >
                    <Shuffle className={`${styles.icon} ${styles.random}`} />
                    <Typography variant="caption">0P</Typography>
                    {selectedGender === 'R' && <Check className={styles.checkIcon} />}
                    <Typography>Random</Typography>
                </div>
            </div>

            <div className={styles['rating-box']}>
                <Typography variant="h6">Set Your Preferred Rating Range</Typography>
                <Slider
                    value={ratingRange}
                    onChange={handleRatingChange}
                    valueLabelDisplay="auto"
                    min={0}
                    max={5}
                    marks={[
                        { value: 0, label: '0' },
                        { value: 1, label: '1' },
                        { value: 2, label: '2' },
                        { value: 3, label: '3' },
                        { value: 4, label: '4' },
                        { value: 5, label: '5' },
                    ]}
                />
                <Typography variant="body2">
                    Selected Range: {ratingRange[0]} to {ratingRange[1]}
                </Typography>
            </div>

            <div className={styles['do-not']}>
                <FormControlLabel
                    control={<Checkbox checked={checked} onChange={(e) => setChecked(e.target.checked)} />}
                    label="Do not ask again"
                />
            </div>

            <div className={styles.buttons}>
                <Button variant="contained" color="primary">Buy Voucher</Button>
                <Button onClick={handleConnecting} variant="contained" color="secondary">
                    Start
                </Button>
            </div>
        </div>
    );
};

export default SelectGender;
