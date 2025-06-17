export default function EventBrief({ title, organizer, date, time, location, description, onClickButton = f => f }) {
    const eventData = { title, organizer, date, time, location, description };

    return (
        <div className="event-element">
            <div className="event-brief">
                <p><strong>{title}</strong></p>
                <p>{organizer}</p>
                <p>{location}, {date}, {time}</p>
                <p>{description?.length > 100 ? description.slice(0, 100) + "..." : description}</p>
            </div>
            <button onClick={() => onClickButton(eventData)}>Show more</button>
        </div>
    );
};