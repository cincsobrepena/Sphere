import PlayButton from './PlayButton';
import PauseButton from './PauseButton';
import SettingsButton from './SettingsButton';
import SettingsContext from './SettingsContext';
import './Countdown.css';
import { useContext, useEffect, useRef, useState } from 'react';

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

        //Switches the timer between Work Mode & Break Mode
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
        },1000);
    
        return () => clearInterval(interval);
    }, [settingsInfo]);

    //Converts Seconds to Minutes
    const minutes = Math.floor(secondsLeft / 60);
    let seconds = secondsLeft % 60;
    if(seconds < 10) seconds = '0'+seconds;

    return(
        <>
            <div>
                {/*Displays Current Mode */}
                <h2> {mode} </h2>

                {/*Displays Clock */}
                <h1> {minutes + ':' + seconds} </h1>

                {/* Chooses which button to display*/}
                <div style={{marginTop:'20px'}}>
                    {isPaused
                    ? <PlayButton onClick={() => { setIsPaused(false); isPausedRef.current = false; }} />
                    : <PauseButton onClick={() => { setIsPaused(true); isPausedRef.current = true; }} />}
                </div>

                {/*Button for diplaying Setttings*/}
                <div style={{marginTop:'20px'}}>
                    <SettingsButton onClick={() => settingsInfo.setShowSettings(true)} />
                </div>
            </div>
        </>
    );
}

export default Countdown;