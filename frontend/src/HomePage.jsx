import { useState, useEffect } from "react";

import PageHeader from "./components/PageHeader";
import EventDetails from "./components/EventDetails";
import EventList from "./components/EventList";
import Filters from "./components/Filters";

export default function HomePage() {
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);

    useEffect(() => {
        fetch("/data/sample-events.json")
            .then(response => response.json())
            .then(data => setEvents(data));
    }, []);

    const handleShowMore = (eventData) => {
        console.log("Selected event:", eventData);
        setSelectedEvent(eventData);
    }

    return (
        <>
            <PageHeader />
            <h1>Home Page</h1>
            <p>Page under construction</p>
            <hr />
            <Filters />
            {selectedEvent ? (
                <EventDetails
                    title={selectedEvent.title}
                    organizer={selectedEvent.organizer}
                    date={selectedEvent.organizer}
                    time={selectedEvent.time}
                    location={selectedEvent.location}
                    description={selectedEvent.description}
                    onClickBack={() => setSelectedEvent(null)}
                />
            ) : (
                <EventList eventList={events} handleClickButton={handleShowMore} />
            )}
        </>
    );
};