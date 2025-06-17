import EventBrief from "./EventBrief";

export default function EventList({ eventList, handleClickButton = f => f }) {
    return (
        <div className="event-list">
            {eventList.map(event => 
                <EventBrief
                    key={event.eventId}
                    title={event.title}
                    organizer={event.organizer}
                    date={event.date}
                    time={event.time}
                    location={event.location}
                    description={event.description}
                    onClickButton={handleClickButton}
                />
            )}
        </div>
    );
};