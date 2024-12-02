import React, { useEffect, useState } from 'react';
import { formatLocalDateToISO } from "../../utils/dateUtils";

const TimeSlots = ({
  selectedDate,
  selectedTime,
  setSelectedTime,
  unavailableTimes,
}) => {
  const [disabledTimes, setDisabledTimes] = useState([]);

  useEffect(() => {
    if (selectedDate) {
      const formattedDate = formatLocalDateToISO(selectedDate).split('T')[0];
      const unavailable = unavailableTimes[formattedDate] || [];
      setDisabledTimes(unavailable);

      // 날짜가 변경될 때 선택된 시간이 불가능한 시간이면 선택 해제
      if (unavailable.includes(selectedTime)) {
        setSelectedTime(null);
      }
    }
  }, [selectedDate, unavailableTimes, selectedTime, setSelectedTime]);

  const handleTimeClick = (time) => {
    if (selectedDate && !disabledTimes.includes(time)) {
      setSelectedTime(time);
    }
  };

  const renderTimeButton = (time) => {
    const isUnavailable = disabledTimes.includes(time);

    return (
      <button
        key={time}
        className={`py-2 ${
          selectedTime === time
            ? "bg-blue-500 text-white"
            : isUnavailable
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-white"
        } rounded`}
        onClick={() => handleTimeClick(time)}
        disabled={isUnavailable}
      >
        {time}
      </button>
    );
  };

  const allTimes = [
    "09:00", "10:00", "11:00", "12:00", "13:00", 
    "14:00", "15:00", "16:00", "17:00"
  ];

  return (
    <div className="mt-4 no-outline">
      <h3 className="font-bold mb-2">오전</h3>
      <div className="grid grid-cols-3 gap-2 mb-4">
        {allTimes.slice(0, 3).map(renderTimeButton)}
      </div>
      <h3 className="font-bold mb-2">오후</h3>
      <div className="grid grid-cols-3 gap-2">
        {allTimes.slice(3).map(renderTimeButton)}
      </div>
    </div>
  );
};

export default TimeSlots;