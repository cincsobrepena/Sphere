import './App.css';
import Pomodoro from './components/Pomodoro/Pomodoro';
import WeatherForecast from './components/WeatherForecast/WeatherForecast';

function App() {

  return (
    <div className='container-main'>
      <div>
        <Pomodoro/>
        <WeatherForecast/>
      </div>
    </div>
  );
}

export default App;
