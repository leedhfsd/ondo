import { useState, useEffect } from "react";
import { formatLocalDateToISO } from "../../utils/dateUtils";

const Calendar = ({ selectedDate, setSelectedDate }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    if (!selectedDate) {
      setSelectedDate(new Date(currentDate));
    }
  }, [currentDate, setSelectedDate, selectedDate]);

  const handleDateClick = (date) => {
    const newDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      date
    );
    if (newDate >= new Date(new Date().setHours(0, 0, 0, 0))) {
      setSelectedDate(newDate);
    }
  };

  const handleMonthChange = (increment) => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setMonth(prevDate.getMonth() + increment);
      return newDate;
    });
  };

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getMonthStart = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const isDateDisabled = (date) => {
    const fullDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      date
    );
    return fullDate < new Date(new Date().setHours(0, 0, 0, 0));
  };

  return (
    <div className="bg-white rounded-lg p-4">
      <div className="flex justify-between items-center text-gray-600 mb-2">
        <button
          onClick={() => handleMonthChange(-1)}
          className="text-sm p-1 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors"
        >
          &lt;
        </button>
        <span className="text-xl font-semibold">
          {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월
        </span>
        <button
          onClick={() => handleMonthChange(1)}
          className="text-sm p-1 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors"
        >
          &gt;
        </button>
      </div>
      <div className="grid grid-cols-7 gap-2 text-center">
        {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
          <div key={day} className="text-gray-700 font-semibold">
            {day}
          </div>
        ))}
        {Array.from({ length: getMonthStart(currentDate) }, (_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {Array.from(
          { length: getDaysInMonth(currentDate) },
          (_, i) => i + 1
        ).map((date) => {
          const isDisabled = isDateDisabled(date);
          return (
            <div
              key={date}
              className={`cursor-pointer ${
                selectedDate &&
                date === selectedDate.getDate() &&
                currentDate.getMonth() === selectedDate.getMonth() &&
                currentDate.getFullYear() === selectedDate.getFullYear()
                  ? "bg-blue-100 rounded-full"
                  : ""
              } ${
                [0, 6].includes(
                  new Date(
                    currentDate.getFullYear(),
                    currentDate.getMonth(),
                    date
                  ).getDay()
                )
                  ? "text-red-500"
                  : ""
              } ${
                isDisabled
                  ? "text-gray-300 cursor-not-allowed"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => !isDisabled && handleDateClick(date)}
            >
              {date}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;