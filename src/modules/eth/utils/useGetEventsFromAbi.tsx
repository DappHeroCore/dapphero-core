import {useEffect, useState} from "react"

//This takes an ABI file and returns only the Events
export const useGetEventsFromAbi: any = abi => {
  const [events, setEvents] = useState(null);

  useEffect(() => {
    const getEvents = abi => {
      const events = abi.filter(method => {
        return method.type === "event";
      });
      setEvents(events);
    };
    getEvents(abi);
  }, []);

  return events;
};
