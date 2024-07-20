import SettingsContext from "./SettingsContext";
import { useContext, useRef } from "react";
import BackButton from "./BackButton";
import './Countdown.css';
import '../Card.css';

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

    return (
        <div className="card">
            <div className="card-header">Settings</div>
            <div className="card-body">
                <div className="input-container">
                    <h3>Work</h3>
                    <input
                        ref={workInputRef}
                        type='number'
                        value={settingsInfo.workMinutes}
                        onChange={handleWorkMinutesChange}
                        min={1}
                        max={120}
                    />

                    <h3>Break</h3>
                    <input
                        ref={breakInputRef}
                        type='number'
                        value={settingsInfo.breakMinutes}
                        onChange={handleBreakMinutesChange}
                        min={1}
                        max={120}
                    />
                </div>
                <div className="card-footer">
                    <BackButton onClick={() => settingsInfo.setShowSettings(false)} />
                </div>
            </div>
        </div>
    );
}

export default Settings;
