import React from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from 'date-fns';
import { Activity } from '../../types/trip';

interface CalendarProps {
  activities: Activity[];
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

const Calendar: React.FC<CalendarProps> = ({
  activities,
  selectedDate,
  onDateSelect,
}) => {
  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(selectedDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const hasActivities = (date: Date) => {
    return activities.some(activity => 
      activity.date === format(date, 'yyyy-MM-dd')
    );
  };

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-gray-900">
          {format(selectedDate, 'MMMM yyyy')}
        </h2>
      </div>
      <div className="grid grid-cols-7 gap-4">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}
        {days.map(day => (
          <button
            key={day.toString()}
            onClick={() => onDateSelect(day)}
            className={`
              aspect-square flex items-center justify-center rounded-lg
              transition-colors relative
              ${!isSameMonth(day, selectedDate) ? 'text-gray-400' : 'text-gray-900'}
              ${isToday(day) ? 'bg-blue-50 font-semibold' : 'hover:bg-gray-50'}
              ${format(day, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd') ? 'ring-2 ring-blue-500' : ''}
            `}
          >
            <span className="relative z-10">{format(day, 'd')}</span>
            {hasActivities(day) && (
              <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Calendar;