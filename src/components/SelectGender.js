'use client';

import { useState } from "react";
import {
    Button,
    Checkbox,
    FormControlLabel,
    Slider,
} from "@mui/material";
import {
    AutoAwesomeRounded,
    CheckRounded,
    FemaleRounded,
    MaleRounded,
    PaidRounded,
    ShieldRounded,
    ShuffleRounded,
} from "@mui/icons-material";

import styles from '../styles/selectGender.module.scss';

const genderOptions = [
    {
        value: 'M',
        label: 'Male',
        description: 'Match with men',
        cost: 10,
        Icon: MaleRounded,
        tone: 'male',
    },
    {
        value: 'F',
        label: 'Female',
        description: 'Match with women',
        cost: 10,
        Icon: FemaleRounded,
        tone: 'female',
    },
    {
        value: 'R',
        label: 'Surprise me',
        description: 'Open to anyone',
        cost: 0,
        Icon: ShuffleRounded,
        tone: 'random',
    },
];

const SelectGender = ({ setConnecting, selectedGender, setSelectedGender, setDont, profile, ratingRange, setRatingRange }) => {
    const [checked, setChecked] = useState(false);

    const handleConnecting = () => {
        setConnecting(true);
        if (checked) setDont(true);
    };

    const selectedOption = genderOptions.find((option) => option.value === selectedGender);
    const hasEnoughCoins = selectedOption?.cost === 0 || Number(profile?.coins ?? 0) >= Number(selectedOption?.cost ?? 0);

    return (
        <main className={styles.container}>
            <section className={styles.panel} aria-labelledby="match-title">
                <header className={styles.header}>
                    <span className={styles.eyebrow}>
                        <AutoAwesomeRounded fontSize="small" />
                        Curated for your mood
                    </span>
                    <h1 id="match-title" className={styles.title}>Pick your conversation vibe</h1>
                    <p>Choose who you would like to meet, then fine-tune the rating range.</p>
                </header>

                <div className={styles['point-box']} aria-label={`${profile?.coins ?? 0} coins available`}>
                    <span className={styles['coin-icon']}><PaidRounded /></span>
                    <span>
                        <small>Available balance</small>
                        <strong>{profile?.coins ?? 0} coins</strong>
                    </span>
                </div>

                <div className={styles['icon-box']} role="radiogroup" aria-label="Preferred stranger gender">
                    {genderOptions.map(({ value, label, description, cost, Icon, tone }) => {
                        const isSelected = selectedGender === value;
                        return (
                            <button
                                key={value}
                                type="button"
                                role="radio"
                                aria-checked={isSelected}
                                className={`${styles['gender-card']} ${styles[tone]} ${isSelected ? styles.selected : ''}`}
                                onClick={() => setSelectedGender(value)}
                            >
                                {isSelected && <span className={styles.check}><CheckRounded fontSize="small" /></span>}
                                <span className={styles['icon-shell']}><Icon /></span>
                                <span className={styles['option-copy']}>
                                    <strong>{label}</strong>
                                    <small>{description}</small>
                                </span>
                                <span className={styles.cost}>{cost === 0 ? 'Free' : `${cost} coins`}</span>
                            </button>
                        );
                    })}
                </div>

                <section className={styles['rating-box']} aria-labelledby="rating-title">
                    <div className={styles['rating-heading']}>
                        <span>
                            <small>Compatibility filter</small>
                            <strong id="rating-title">Stranger rating</strong>
                        </span>
                        <span className={styles['range-pill']}>{ratingRange[0]} — {ratingRange[1]}</span>
                    </div>
                    <Slider
                        getAriaLabel={(index) => index === 0 ? 'Minimum stranger rating' : 'Maximum stranger rating'}
                        value={ratingRange}
                        onChange={(event, newValue) => setRatingRange(newValue)}
                        valueLabelDisplay="auto"
                        min={0}
                        max={5}
                        marks={[0, 1, 2, 3, 4, 5].map((value) => ({ value, label: String(value) }))}
                    />
                </section>

                <div className={styles['preference-row']}>
                    <FormControlLabel
                        className={styles['remember-choice']}
                        control={<Checkbox checked={checked} onChange={(event) => setChecked(event.target.checked)} />}
                        label="Remember this choice"
                    />
                    <span className={styles.privacy}><ShieldRounded fontSize="small" /> Preferences stay private</span>
                </div>

                {!hasEnoughCoins && (
                    <p className={styles.warning} role="alert">You need 10 coins for this preference. Choose “Surprise me” to match for free.</p>
                )}

                <div className={styles.buttons}>
                    <Button
                        className={styles['start-button']}
                        onClick={handleConnecting}
                        variant="contained"
                        color="primary"
                        disabled={!hasEnoughCoins}
                        endIcon={<AutoAwesomeRounded />}
                    >
                        Start matching
                    </Button>
                </div>
            </section>
        </main>
    );
};

export default SelectGender;
