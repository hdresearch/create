import React from 'react'
import './App.css'
import { listenToStream, stopListening } from './lib/events'

function App() {
  const [url, setUrl] = React.useState('https://www.google.com');
  const [objective, setObjective] = React.useState('where can I get food in the west village?');
  const [status, setStatus] = React.useState('idle');
  const [events, setEvents] = React.useState<string[]>([]);
  const [restaurants, setRestaurants] = React.useState<string[]>([]);

  const handleEvent = (input) => {
    const parsedInput = input;
    console.log(parsedInput);
    setEvents((prev: string[]) => {
      if (parsedInput?.restaurants) {
        setRestaurants(parsedInput.restaurants);
      }
      if (parsedInput?.progressAssessment) {
        return [...prev, `Progress: ${parsedInput.progressAssessment}`];
      }
      return prev;
    });

    if (parsedInput?.result) {
      if (parsedInput.result.kind === "ObjectiveComplete") {
        setStatus('success')
        setEvents((prev: string[]) => [...prev, `Success: ${parsedInput.result.result.progressAssessment}`]);
      } else if (parsedInput.result.kind === "ObjectiveFailed") {
        setStatus('fail')
        setEvents((prev: string[]) => [...prev, `Fail: ${parsedInput.result.result}`]);
      }
    }
  };

  const newest = events[events.length - 1];

  return (
    <div className="items-center justify-center" style={{ padding: "8rem" }}>
    <div className="flex-col space-y-4">
      <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} />
      <input type="text" value={objective} onChange={(e) => setObjective(e.target.value)} />
      <button onClick={() => {
        setStatus('working'); 
        if (status === 'working') {
          stopListening();
          setStatus('idle');
          return;
        }
        listenToStream(url, objective, handleEvent)
        }}>
          {status !== 'working' ? 'Start' : 'Stop'}
        </button>
        <div className="flex items-center">
          <Icon status={status}/>
      <p>{newest || "No events yet."}</p>
      </div>
      <p>Restaurants: {restaurants.join(', ')}</p>
    </div>
    </div>
  );
}

const Icon = ({ status }) => {
  if (status === 'working') {
    return <div className="animate-spin h-5 w-5 rounded-full bg-green-500">...</div>
  } else if (status === 'success') {
    return <div className="h-5 w-5 rounded-full bg-green-500">✅</div>
  } else if (status === 'fail') {
    return <div className="h-5 w-5 rounded-full bg-red-500">❌</div>
  }
  return <div className="h-5 w-5 rounded-full bg-gray-500">❔</div>
}

export default App
