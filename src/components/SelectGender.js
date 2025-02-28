'use client';
import { useState } from "react";
import {
    Button,
    Checkbox,
    FormControlLabel,
    Typography,
    Slider,
} from "@mui/material";
import { Male, Female, Shuffle } from "@mui/icons-material";
import Image from "next/image";

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
                    Select Stranger Gender and Rating
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    Selecting a preferred gender will cost 10 coins.
                </Typography>
            </div>

            <div className={styles['point-box']}>
                <Typography variant="h6">
                    <div style={{display: 'flex', alignItems: 'center', gap: '2px'}}>
                        Current Coins:&nbsp; <strong>{profile?.coins}</strong>
                        <Image src="/images/coin.png" alt="Pending" width={15} height={15} />

                    </div>
                </Typography>
            </div>

            <div className={styles['icon-box']}>
                <div
                    onClick={() => handleGenderSelect('M')}
                    className={`${styles['m-container']} ${selectedGender === 'M' && styles.selected}`}
                    style={{
                        border: selectedGender === 'M' ? '3px solid #2196f3' : 'none',
                        boxShadow: selectedGender === 'M' ? '0px 0px 10px rgba(33, 150, 243, 0.5)' : 'none'
                    }}
                >
                    {/* <Male className={`${styles.icon} ${styles.male}`} style={{ color: 'rgb(0 75 134)', fontSize: '5rem' }} /> */}
                    <Image src="/images/male.png" alt="Pending" width={85} height={85} />
                    {/* <Typography>Male</Typography> */}
                    <Typography className="icon-points" variant="caption">10C</Typography>
                </div>
                <div
                    onClick={() => handleGenderSelect('F')}
                    className={`${styles['f-container']} ${selectedGender === 'F' && styles.selected}`}
                    style={{
                        border: selectedGender === 'F' ? '3px solid #e91e63' : 'none',
                        boxShadow: selectedGender === 'F' ? '0px 0px 10px rgba(233, 30, 99, 0.5)' : 'none'
                    }}
                >
                    {/* <Female className={`${styles.icon} ${styles.female}`} style={{ color: 'rgb(200 0 68)', fontSize: '5rem' }} /> */}
                    <Image src="/images/female.png" alt="Pending" width={85} height={85} />
                    {/* <Typography>Female</Typography> */}
                    <Typography className="icon-points" style={{backgroundColor: "red"}} variant="caption">10C</Typography>
                </div>
                <div
                    onClick={() => handleGenderSelect('R')}
                    className={`${styles['r-container']} ${selectedGender === 'R' && styles.selected}`}
                    style={{
                        border: selectedGender === 'R' ? '3px solid #4caf50' : 'none',
                        boxShadow: selectedGender === 'R' ? '0px 0px 10px rgba(76, 175, 80, 0.5)' : 'none'
                    }}
                >
                    <Shuffle className={`${styles.icon} ${styles.random}`} style={{ color: 'rgb(0 108 4)', fontSize: '5.5rem' }} />
                    {/* <Typography>Random</Typography> */}
                    <Typography className="icon-points" style={{backgroundColor: "green"}} variant="caption">0C</Typography>
                </div>
            </div>

            <div className={styles['rating-box']}>
                <Typography variant="h6">Set Stranger Rating Range</Typography>
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
                {/* <Typography variant="body2">
                    Selected Range: {ratingRange[0]} to {ratingRange[1]}
                </Typography> */}
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
