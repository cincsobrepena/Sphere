import SettingsContext from "./SettingsContext";
import {useContext, useRef} from "react";
import BackButton from "./BackButton";
import './Countdown.css';


function Settings() {
    const settingsInfo = useContext(SettingsContext);

    const workInputRef = useRef(null);
    const breakInputRef = useRef(null);

    const handleWorkMinutesChange = () => {
      settingsInfo.setWorkMinutes(parseInt(workInputRef.current.value, 10));
    };
  
    const handleBreakMinutesChange = () => {
      settingsInfo.setBreakMinutes(parseInt(breakInputRef.current.value, 10));
    };

    return(
        <>  
            <div style={{textAlign:'center'}}>
                <h3>work: {settingsInfo.workMinutes}:00</h3>
                <input
                    ref={workInputRef}
                    type='number'
                    value={settingsInfo.workMinutes}
                    onChange={handleWorkMinutesChange}
                    min={1}
                    max={120}
                    />

                <h3>break: {settingsInfo.breakMinutes}:00</h3>
                <input
                    ref={breakInputRef}
                    type='number'
                    value={settingsInfo.breakMinutes}
                    onChange={handleBreakMinutesChange}
                    min={1}
                    max={120}
                    />

                <div style={{textAlign:'center', marginTop:'20px'}}>
                    <BackButton onClick={() => settingsInfo.setShowSettings(false)} />
                </div>
            </div>
        </>
    );
  }
  
  export default Settings;