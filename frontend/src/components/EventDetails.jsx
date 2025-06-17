import { useState } from "react";

export default function EventDetails({ title, organizer, date, time, location, description, isUserSigned = false, onSignUp = f => f, onSignOut = f => f, onClickBack = f => f }) {
    const [signed, setSigned] = useState(isUserSigned);

    const handleSignUp = () => {
        setSigned(true);
        onSignUp();
    };

    const handleSignOut = () => {
        setSigned(false);
        onSignOut();
    }

    return (
        <div className="event-details">
            <p>{title}</p>
            <p>Event organizer: {organizer}</p>
            <p>Event date: {date}</p>
            <p>Start time: {time}</p>
            <p>Event location: {location}</p>
            <div className="description">{description}</div>
            {signed ? (
                <button onClick={handleSignOut}>Sign out</button>
            ) : (
                <button onClick={handleSignUp}>Sign up</button>
            )}
            <button onClick={onClickBack}>Back</button>
        </div>
    );
};