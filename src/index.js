import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function App() {
  const [displayTime, setDisplayTime] = React.useState(25 * 60);
  const [breakTime, setBreakTime] = React.useState(5 * 60);
  const [sessionTime, setSessionTime] = React.useState(25 * 60);
  const [timerOn, setTimerOn] = React.useState(false);
  const [onBreak, setOnBreak] = React.useState(false);
  const [breakAudio, setBreakAudio] = React.useState(new Audio('./breakAlarm.mp3'))

  const playBreakSound = () =>{
    breakAudio.currentTime = 0;
    breakAudio.play();
  }

  const formatTime = (time) =>{

    let minutes = Math.floor(time/60);
    let seconds = time % 60;
    return(
      (minutes < 10 ? "0" + minutes: minutes) + 
      ":" +
      (seconds < 10 ? "0" + seconds: seconds)
    );
  }

  const changeTime = (amount, type) =>{
    if(type == "Descanso"){
      if(breakTime <= 60 && amount < 0){
        return;
      }
      setBreakTime((prev) => prev + amount);
    }else{
      if(sessionTime <= 60 && amount < 0){
        return;
      }
      setSessionTime((prev) => prev + amount);
      if(!timerOn){
        setDisplayTime(sessionTime + amount);
      }
    }
  }

  const controlTime = () =>{

    let second = 1000;
    let date = new Date().getTime();
    let nextDate = new Date().getTime() + second;
    let onBreakVariable = onBreak;

    if(!timerOn){
      let interval = setInterval(() =>{

        date = new Date().getTime();
        if(date > nextDate){
          setDisplayTime(prev =>{
            if(prev <= 0 && !onBreakVariable){
              playBreakSound();
              onBreakVariable = true;
              setOnBreak(true);
              return breakTime;
            }else if(prev <= 0 && onBreakVariable){
              playBreakSound();
              onBreakVariable = false;
              setOnBreak(false);
              return sessionTime;
            }
            return prev - 1;
          })

          nextDate += second;
        }
        
      }, 30);
      localStorage.clear();
      localStorage.setItem('interval-id', interval);
    }

    if(timerOn){
      clearInterval(localStorage.getItem('interval-id'));
    }
    setTimerOn(!timerOn)
  }
  const resetTime = () =>{
    setDisplayTime(25 * 60);
    setBreakTime(5 * 60);
    setSessionTime(25 * 60)
  }

  return(
    <div className="text-center bg-info text-white">

      <h1>Reloj Pomodoro</h1>
      <div className="container clock-container">
      <Length 
      title={"Tiempo de descanso"} 
      changeTime={changeTime} 
      type={"Descanso"} 
      time={breakTime} 
      formatTime={formatTime}/>

     <Length 
      title={"Tiempo de Trabajo"} 
      changeTime={changeTime} 
      type={"Trabajo"} 
      time={sessionTime} 
      formatTime={formatTime}/>
      </div>
      <h3>{onBreak ? "Descanso" : "Trabajo"}</h3>
      <h1>{formatTime(displayTime)}</h1>

      <button className="btn btn-warning" onClick={controlTime}>
        {timerOn ? (
          <h3>Pausar</h3>
        ): (
          <h3>Play</h3>
        )}
      </button>
      <button className="btn btn-danger" onClick={resetTime}>
        <h3>Reiniciar</h3>
      </button>
    </div>
  )
}

function Length({title, changeTime, type, time, formatTime}){
  return(
    <div>
      <h3>{title}</h3>
      <div className="time-sets">
        <button className="btn btn-success"
        onClick={() => changeTime(-60, type)}>
          Menos Tiempo
        </button>
        <h3>{formatTime(time)}</h3>
        <button className="btn btn-success"
        onClick={() => changeTime(60, type)}>
          Más Tiempo
        </button>

      </div>
    </div>
  )
}


ReactDOM.render(<App />, document.getElementById('root'));


