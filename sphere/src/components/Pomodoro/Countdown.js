import React, { useContext, useEffect, useRef, useState } from 'react';
import PlayButton from './PlayButton';
import PauseButton from './PauseButton';
import SettingsButton from './SettingsButton';
import SettingsContext from './SettingsContext';
import '../Card.css';

const Countdown = () => {
    const settingsInfo = useContext(SettingsContext);

    const [isPaused, setIsPaused] = useState(true);
    const [mode, setMode] = useState('work'); // work/break/null
    const [secondsLeft, setSecondsLeft] = useState(0);

    const secondsLeftRef = useRef(secondsLeft);
    const isPausedRef = useRef(isPaused);
    const modeRef = useRef(mode);

    function tick() {
        secondsLeftRef.current--;
        setSecondsLeft(secondsLeftRef.current);
    }

    useEffect(() => {
        function switchMode() {
            const nextMode = modeRef.current === 'work' ? 'break' : 'work';
            const nextSeconds = (nextMode === 'work' ? settingsInfo.workMinutes : settingsInfo.breakMinutes) * 60;

            setMode(nextMode);
            modeRef.current = nextMode;

            setSecondsLeft(nextSeconds);
            secondsLeftRef.current = nextSeconds;
        }

        secondsLeftRef.current = settingsInfo.workMinutes * 60;
        setSecondsLeft(secondsLeftRef.current);

        const interval = setInterval(() => {
            if (isPausedRef.current) {
                return;
            }
            if (secondsLeftRef.current === 0) {
                return switchMode();
            }

            tick();
        }, 1000);

        return () => clearInterval(interval);
    }, [settingsInfo]);

    const minutes = Math.floor(secondsLeft / 60);
    let seconds = secondsLeft % 60;
    if (seconds < 10) seconds = '0' + seconds;

    return (
        <div className="card">
            <div className="card-header">Pomodoro Timer</div>
            <div className="card-body">
                <h2>{mode}</h2>
                <h1>{minutes}:{seconds}</h1>
                <div style={{ marginTop: '20px' }}>
                    {isPaused
                        ? <PlayButton onClick={() => { setIsPaused(false); isPausedRef.current = false; }} />
                        : <PauseButton onClick={() => { setIsPaused(true); isPausedRef.current = true; }} />}
                </div>
                <div style={{ marginTop: '20px' }}>
                    <SettingsButton onClick={() => settingsInfo.setShowSettings(true)} />
                </div>
            </div>
        </div>
    );
}

export default Countdown;
