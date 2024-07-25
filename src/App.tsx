import { useState, useEffect } from 'react';
import './App.css';

// Function to format time with optional negative sign
function formatTime(time, isNegative) {
  return isNegative ? `-${Math.abs(time) < 10 ? `0${Math.abs(time)}` : Math.abs(time)}` : time < 10 ? `0${time}` : time;
}

// Function to update the countdown display
function updateTimerList(timers) {
  return timers.map(timer => {
    const { targetDate, targetTime } = timer;
    const targetDateTime = new Date(`${targetDate}T${targetTime}`);
    const currentDateTime = new Date();
    let totalSeconds = (targetDateTime - currentDateTime) / 1000;
    const isNegative = totalSeconds < 0;

    if (isNegative) {
      totalSeconds = -totalSeconds; // Use positive value for calculations
    }

    return {
      ...timer,
      days: formatTime(Math.floor(totalSeconds / 3600 / 24), isNegative),
      hours: formatTime(Math.floor(totalSeconds / 3600) % 24, isNegative),
      minutes: formatTime(Math.floor(totalSeconds / 60) % 60, isNegative),
      seconds: formatTime(Math.floor(totalSeconds % 60), isNegative),
    };
  });
}

function App() {
  const [timers, setTimers] = useState(() => {
    const savedTimers = window.localStorage.getItem("TimerCollection");
    return savedTimers ? JSON.parse(savedTimers) : [];
  });
  
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setTimers(prevTimers => updateTimerList(prevTimers));
    }, 1000);

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  function handleAddTimer() {
    if (!title || !date || !time) {
      alert('Please fill in all fields.');
      return;
    }

    const newTimer = {
      title,
      targetDate: date,
      targetTime: time,
      days: '00',
      hours: '00',
      minutes: '00',
      seconds: '00',
    };

    const updatedTimers = [...timers, newTimer];
    setTimers(updatedTimers);
    window.localStorage.setItem("TimerCollection", JSON.stringify(updatedTimers));

    // Clear inputs
    setTitle('');
    setDate('');
    setTime('');
  }

  function handleDeleteTimer(index) {
    const updatedTimers = timers.filter((_, i) => i !== index);
    setTimers(updatedTimers);
    window.localStorage.setItem("TimerCollection", JSON.stringify(updatedTimers));
  }

  return (
    <main>
      <div className='createTimer'>
        <h2>Create New Timer</h2>
        <span>
          Title: 
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
        </span>
        <span>
          Set Date: 
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </span>
        <span>
          Set Time: 
          <input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
        </span>
        <button onClick={handleAddTimer}>Add Timer</button>
      </div>
      <div className='showTimer'>
        <h2>Timers Created</h2>
        <ul className='timerList'>
          {timers.map((timer, index) => (
            <li key={index}>
              <span>
                <h3>{timer.title}</h3>
                <p>{timer.days} days {timer.hours} hours {timer.minutes} minutes {timer.seconds} seconds</p>
              </span>
              <button onClick={() => handleDeleteTimer(index)}>
              <i className="fa-solid fa-trash-can"></i>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}

export default App;
