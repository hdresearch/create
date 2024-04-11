import React from "react";
import "./App.css";
import { AgentEvent, listenToStream, stopListening } from "./lib/events";

type Status = "working" | "success" | "fail" | "idle";

function App() {
  const [url] = React.useState("https://www.google.com");
  const [objective, setObjective] = React.useState(
    "West Village",
  );
  const [status, setStatus] = React.useState<Status>("idle");
  const [events, setEvents] = React.useState<string[]>([]);
  const [restaurants, setRestaurants] = React.useState<string[]>([]);

  const handleEvent = (input: AgentEvent) => {
    setEvents((prev: string[]) => {
      if (input?.result?.kind === "ObjectiveComplete") {
        if (input?.result?.result?.objectiveComplete?.restaurants) {
          setRestaurants(input?.result?.result?.objectiveComplete?.restaurants);
        }
    }
      if (input?.progressAssessment) {
        return [...prev, `Progress: ${input.description}`];
      }
      return prev;
    });

    if (input?.result) {
      if (input.result.kind === "ObjectiveComplete") {
        setStatus("success");
        setEvents((prev: string[]) => [
          ...prev,
          `Success: ${typeof input?.result?.result !== "string" ? input?.result?.result.progressAssessment : input?.result?.result}`,
        ]);
      } else if (input.result.kind === "ObjectiveFailed") {
        setStatus("fail");
        setEvents((prev: string[]) => [
          ...prev,
          `Fail: ${input?.result?.result}`,
        ]);
      }
    }
  };

  const start = () => {
    if (status === "working") {
      stopListening();
      setStatus("idle");
      return;
    }
    setStatus("working");
    setRestaurants([]);
    setEvents([]);
    listenToStream(url, objective, handleEvent);
  };

  const newest = events[events.length - 1];

  return (
    <div className="items-center justify-center" style={{ padding: "8rem" }}>
      <div className="flex-col space-y-4">
      <p>Enter a location where you want to find food.</p>
        <input
          type="text"
          value={objective}
          onChange={(e) => setObjective(e.target.value)}
        />
        <button onClick={() => start()}>
          {status !== "working" ? "Start" : "Stop"}
        </button>
        <div className="flex items-center">
          <Icon status={status} />
          <p>{newest || "No events yet."}</p>
        </div>
        {restaurants.length > 0 && <p>Restaurants: {restaurants.join(", ")}</p>}
      </div>
    </div>
  );
}

const Icon = ({
  status,
}: {
  status: "working" | "success" | "fail" | "idle";
}) => {
  if (status === "working") {
    return <div className="mr-2 blinker"></div>;
  } else if (status === "success") {
    return <div className="mr-2">✅</div>;
  } else if (status === "fail") {
    return <div className="mr-2">❌</div>;
  }
  return <div className="mr-2">❔</div>;
};

export default App;
