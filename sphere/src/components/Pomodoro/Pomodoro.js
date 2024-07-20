import Countdown from "./Countdown";
import Settings from "./Settings";
import {useState} from "react";
import SettingsContext from "./SettingsContext";

function Pomodoro() {

    const [showSettings, setShowSettings] = useState(false);
    const [workMinutes, setWorkMinutes] = useState(45);
    const [breakMinutes, setBreakMinutes] = useState(15);

    return (
        <SettingsContext.Provider value={{
            showSettings,
            setShowSettings,
            workMinutes,
            breakMinutes,
            setWorkMinutes,
            setBreakMinutes,
        }}>
            {showSettings ? <Settings /> : <Countdown />}
        </SettingsContext.Provider>
    );
  }
  
  export default Pomodoro;
  