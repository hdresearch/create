let eventSource: EventSource | null = null;
export const listenToStream = (url: string, objective: string, callback: (res: unknown) => void) => {
    eventSource = new EventSource(`http://localhost:3040/api/browse?url=${encodeURIComponent(url)}&objective=${encodeURIComponent(objective)}&maxIterations=10`);
    eventSource.onmessage = function(event) {
      const response = JSON.parse(event.data);
      if (response.done) {
        console.log('done');
        eventSource?.close();
      }
      console.log(response);
      callback(response);
    };
    eventSource.onerror = function(error) {
      console.error("EventSource failed:", error);
      eventSource?.close();
    };
  };
export const stopListening = () => {
    eventSource?.close();
  };