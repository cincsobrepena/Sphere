import WeatherForecast from "./WeatherForecast/WeatherForecast";
import Pomodoro from "./Pomodoro/Pomodoro";
import ToDoList from "./ToDoList";
import TitleBar from "./TitleBar";
import './HomeWrapper.css';

const HomeWrapper = ({ tasks, categories }) => {

    return (
        <>  
            <TitleBar/>
            <div className="container-home">
                <Pomodoro/>
                <ToDoList tasks={tasks} categories={categories}/>
                <WeatherForecast/>
            </div>
        </>
    );
};

export default HomeWrapper;