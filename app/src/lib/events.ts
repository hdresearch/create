let eventSource: EventSource | null = null;

const baseUrl = process.env.NODE_ENV === 'development' ? `http://localhost:3040` : '';

type ObjectiveCompleteResult = {
  description: string;
  objectiveComplete: {
    kind: "ObjectiveComplete";
    restaurants: string[];
    result: string;
  }
};

type ObjectiveFailedResult = {
  description: string;
  kind: "ObjectiveFailed";
  result: string;
};

type Result = ObjectiveCompleteResult | ObjectiveFailedResult;

export type AgentEvent = {
  done?: boolean;
  kind?: "ObjectiveComplete";
  result?: Result;
  progressAssessment?: string;
  description?: string;
};
export const listenToStream = (
  url: string,
  objective: string,
  location: string,
  callback: (res: AgentEvent) => void,
) => {
  eventSource = new EventSource(
    `${baseUrl}/api/browse?url=${encodeURIComponent(url)}&objective=${encodeURIComponent(objective)}%20${encodeURIComponent(location)}&maxIterations=10`,
  );
  eventSource.onmessage = function (event) {
    const response = JSON.parse(event.data);
    console.log(response);
    if (response.done) {
      console.log("done");
      eventSource?.close();
    }
    if (!response.done) {
      callback(response);
    }
  };
  eventSource.onerror = function (error) {
    console.error("EventSource failed:", error);
    eventSource?.close();
  };
};
export const stopListening = () => {
  eventSource?.close();
};
