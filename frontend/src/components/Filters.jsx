import { useState } from "react";

export default function Filters() {
    const [eventName, setEventName] = useState("");
    const [localization, setLocaliation] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Filter with:", { eventName, localization, date, time });
    };

    return (
        <div className="filter-container">
            <p><strong>Find events</strong></p>
            <form className="filter-form" onSubmit={handleSubmit}>
                <p>
                    <label htmlFor="eventName">Event name:</label>
                    <input
                        type="text"
                        name="eventName"
                        id="eventName"
                        placeholder="Enter event name"
                        value={eventName}
                        onChange={(e) => setEventName(e.target.value)}
                    />
                </p>

                <p>
                    <label htmlFor="localization">Localization:</label>
                    <input
                        type="text"
                        name="localization"
                        id="localization"
                        placeholder="Enter event localization"
                        value={localization}
                        onChange={(e) => setLocaliation(e.target.value)}
                    />
                </p>

                <p>
                    <label htmlFor="date">Date:</label>
                    <input
                        type="date"
                        name="date"
                        id="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                </p>

                <p>
                    <label htmlFor="time">Time:</label>
                    <input
                        type="time"
                        name="time"
                        id="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                    />
                </p>

                <button type="submit">Filter</button>
            </form>
        </div>
    );
};