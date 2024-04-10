let eventSource: EventSource | null = null;

type ObjectiveCompleteResult = {
  kind: "ObjectiveComplete";
  result: {
    progressAssessment: string;
  };
};

type ObjectiveFailedResult = {
  kind: "ObjectiveFailed";
  result: string;
};

type Result = ObjectiveCompleteResult | ObjectiveFailedResult;

export type AgentEvent = {
    done?: boolean;
    result?: Result;
    progressAssessment?: string;
    restaurants?: string[];
};
export const listenToStream = (url: string, objective: string, callback: (res: AgentEvent) => void) => {
    eventSource = new EventSource(`http://localhost:3040/api/browse?url=${encodeURIComponent(url)}&objective=${encodeURIComponent(objective)}&maxIterations=10`);
    eventSource.onmessage = function(event) {
      const response = JSON.parse(event.data);
      if (response.done) {
        console.log('done');
        eventSource?.close();
      }
      if (!response.done) {
        callback(response);
      }
    };
    eventSource.onerror = function(error) {
      console.error("EventSource failed:", error);
      eventSource?.close();
    };
  };
export const stopListening = () => {
    eventSource?.close();
  };