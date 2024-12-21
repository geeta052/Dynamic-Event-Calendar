import React, { useState, useEffect } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  startOfDay,
  addDays,
  subMonths,
  addMonths,
  eachDayOfInterval,
  isToday,
} from "date-fns";

const CalendarApp = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [eventDetails, setEventDetails] = useState({
    name: "",
    start: "",
    end: "",
    description: "",
    type: "work", // Default to 'work' event type
  });
  const [view, setView] = useState("month"); // Track the current view: month, week, day

  useEffect(() => {
    const storedEvents = JSON.parse(localStorage.getItem("events")) || {};
    setEvents(storedEvents);
  }, []);

  useEffect(() => {
    localStorage.setItem("events", JSON.stringify(events));
  }, [events]);

  const renderCells = () => {
    let days = [];
    let day = startOfMonth(currentDate);

    if (view === "month") {
      const monthStart = startOfMonth(currentDate);
      const monthEnd = endOfMonth(monthStart);
      const startDate = startOfWeek(monthStart);
      const endDate = endOfWeek(monthEnd);
      day = startDate;

      while (day <= endDate) {
        const formattedDate = format(day, "yyyy-MM-dd");
        const isTodayDay = formattedDate === format(new Date(), "yyyy-MM-dd");
        const hasEvents = events[formattedDate] && events[formattedDate].length > 0;

        days.push(
          <div
            key={day}
            className={`p-4 border rounded transition-transform transform hover:scale-105 ${
              isTodayDay ? "bg-blue-300" : "bg-white"
            } hover:bg-blue-100 cursor-pointer shadow-md`}
            onClick={() => onDayClick(formattedDate)}
          >
            <div className="text-lg font-semibold">{format(day, "d")}</div>
            {hasEvents && (
              <div className="mt-1 text-xs text-blue-500">
                {events[formattedDate].length} event(s)
              </div>
            )}
          </div>
        );
        day = addDays(day, 1);
      }
    }

    if (view === "week") {
      const weekStart = startOfWeek(currentDate);
      const weekEnd = endOfWeek(currentDate);
      const daysInWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });

      daysInWeek.forEach((dayInWeek) => {
        const formattedDate = format(dayInWeek, "yyyy-MM-dd");
        const isTodayDay = formattedDate === format(new Date(), "yyyy-MM-dd");
        const hasEvents = events[formattedDate] && events[formattedDate].length > 0;

        days.push(
          <div
            key={dayInWeek}
            className={`p-4 border rounded transition-transform transform hover:scale-105 ${
              isTodayDay ? "bg-blue-300" : "bg-white"
            } hover:bg-blue-100 cursor-pointer shadow-md`}
            onClick={() => onDayClick(formattedDate)}
          >
            <div className="text-lg font-semibold">{format(dayInWeek, "d")}</div>
            {hasEvents && (
              <div className="mt-1 text-xs text-blue-500">
                {events[formattedDate].length} event(s)
              </div>
            )}
          </div>
        );
      });
    }

    if (view === "day") {
      const dayStart = startOfDay(currentDate);
      const formattedDate = format(dayStart, "yyyy-MM-dd");
      const hasEvents = events[formattedDate] && events[formattedDate].length > 0;

      days.push(
        <div
          key={formattedDate}
          className="p-4 border rounded bg-white shadow-md"
        >
          <div className="text-lg font-semibold">{format(dayStart, "MMMM d, yyyy")}</div>
          {hasEvents && (
            <div className="mt-1 text-xs text-blue-500">
              {events[formattedDate].length} event(s)
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-7 gap-2 mb-4">
        {days}
      </div>
    );
  };

  const onDayClick = (formattedDate) => {
    setSelectedDate(formattedDate);
    setIsModalOpen(true);
  };

  const handleSaveEvent = () => {
    const newEvent = { ...eventDetails };
    const updatedEvents = { ...events };
    if (!updatedEvents[selectedDate]) updatedEvents[selectedDate] = [];
    updatedEvents[selectedDate].push(newEvent);
    setEvents(updatedEvents);
    setIsModalOpen(false);
    setEventDetails({ name: "", start: "", end: "", description: "", type: "work" });
  };

  const handleEventDelete = (index) => {
    const updatedEvents = { ...events };
    updatedEvents[selectedDate].splice(index, 1);
    setEvents(updatedEvents);
  };

  const handleEventEdit = (index) => {
    // Edit event logic (can be added later)
  };

  const goToPreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const switchView = (newView) => {
    setView(newView);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <button
          onClick={goToPreviousMonth}
          className="px-4 py-2 bg-gray-200 rounded shadow-md hover:bg-gray-300 transition-all"
        >
          Previous
        </button>
        <div className="text-lg font-bold text-center">{format(currentDate, "MMMM yyyy")}</div>
        <button
          onClick={goToNextMonth}
          className="px-4 py-2 bg-gray-200 rounded shadow-md hover:bg-gray-300 transition-all"
        >
          Next
        </button>
      </div>

      <div className="flex justify-center mb-6 space-x-4">
        <button
          onClick={() => switchView("month")}
          className={`px-4 py-2 rounded shadow-md ${
            view === "month" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
          } hover:bg-blue-600 transition-all`}
        >
          Month
        </button>
        <button
          onClick={() => switchView("week")}
          className={`px-4 py-2 rounded shadow-md ${
            view === "week" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
          } hover:bg-blue-600 transition-all`}
        >
          Week
        </button>
        <button
          onClick={() => switchView("day")}
          className={`px-4 py-2 rounded shadow-md ${
            view === "day" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
          } hover:bg-blue-600 transition-all`}
        >
          Day
        </button>
      </div>

      <div>{renderCells()}</div>

      <EventList
        events={events[selectedDate] || []}
        onEdit={handleEventEdit}
        onDelete={handleEventDelete}
      />

      {isModalOpen && (
        <EventModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveEvent}
          eventDetails={eventDetails}
          setEventDetails={setEventDetails}
        />
      )}
    </div>
  );
};

const EventList = ({ events, onEdit, onDelete }) => {
  if (!events.length) return <div className="text-gray-500">No events for this day.</div>;

  const getEventColor = (type) => {
    switch (type) {
      case "work":
        return "bg-blue-100";
      case "personal":
        return "bg-green-100";
      case "others":
        return "bg-yellow-100";
      default:
        return "bg-gray-100";
    }
  };

  return (
    <div className="space-y-4 mt-6">
      {events.map((event, index) => (
        <div
          key={index}
          className={`p-4 rounded shadow ${getEventColor(event.type)} transition-all`}
        >
          <h3 className="font-semibold text-lg">{event.name}</h3>
          <span className="text-sm bg-blue-200 px-2 py-1 rounded">
            {event.start} - {event.end}
          </span>
          <p className="text-gray-600 mt-2">{event.description}</p>
          <div className="mt-4 flex space-x-2">
            <button
              onClick={() => onEdit(index)}
              className="px-3 py-1 bg-yellow-500 text-white rounded shadow-md hover:bg-yellow-600 transition-all"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(index)}
              className="px-3 py-1 bg-red-500 text-white rounded shadow-md hover:bg-red-600 transition-all"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

const EventModal = ({ isOpen, onClose, onSave, eventDetails, setEventDetails }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full transition-all transform scale-95 hover:scale-100">
        <h2 className="text-lg font-bold mb-4">Add/Edit Event</h2>
        <input
          type="text"
          value={eventDetails.name}
          onChange={(e) => setEventDetails({ ...eventDetails, name: e.target.value })}
          placeholder="Event Name"
          className="border p-2 w-full rounded mb-4 shadow-sm focus:ring focus:border-blue-300 transition-all"
        />
        <input
          type="time"
          value={eventDetails.start}
          onChange={(e) => setEventDetails({ ...eventDetails, start: e.target.value })}
          className="border p-2 w-full rounded mb-4 shadow-sm focus:ring focus:border-blue-300 transition-all"
        />
        <input
          type="time"
          value={eventDetails.end}
          onChange={(e) => setEventDetails({ ...eventDetails, end: e.target.value })}
          className="border p-2 w-full rounded mb-4 shadow-sm focus:ring focus:border-blue-300 transition-all"
        />
        <textarea
          value={eventDetails.description}
          onChange={(e) => setEventDetails({ ...eventDetails, description: e.target.value })}
          placeholder="Event Description"
          className="border p-2 w-full rounded mb-4 shadow-sm focus:ring focus:border-blue-300 transition-all"
        />
        <div className="mb-4">
          <label>Event Type</label>
          <select
            value={eventDetails.type}
            onChange={(e) => setEventDetails({ ...eventDetails, type: e.target.value })}
            className="border p-2 w-full rounded mb-4 shadow-sm focus:ring focus:border-blue-300 transition-all"
          >
            <option value="work">Work</option>
            <option value="personal">Personal</option>
            <option value="others">Others</option>
          </select>
        </div>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded mr-2 transition-all hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="px-4 py-2 bg-blue-500 text-white rounded transition-all hover:bg-blue-600"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default CalendarApp;
