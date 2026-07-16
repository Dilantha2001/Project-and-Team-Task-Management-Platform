"use client";

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  type: 'task' | 'meeting' | 'deadline';
}

interface CalendarProps {
  events?: CalendarEvent[];
}

export function Calendar({ events = [] }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Helper to check if a date has events
  const getEventsForDate = (day: number) => {
    return events.filter(e => 
      e.date.getDate() === day && 
      e.date.getMonth() === currentDate.getMonth() && 
      e.date.getFullYear() === currentDate.getFullYear()
    );
  };

  const renderCells = () => {
    const cells = [];
    
    // Empty cells for days before the 1st
    for (let i = 0; i < firstDayOfMonth; i++) {
      cells.push(<div key={`empty-${i}`} className="h-24 border border-gray-100 bg-gray-50/50 p-2 opacity-50"></div>);
    }
    
    // Cells for each day
    for (let i = 1; i <= daysInMonth; i++) {
      const isToday = i === new Date().getDate() && 
                      currentDate.getMonth() === new Date().getMonth() && 
                      currentDate.getFullYear() === new Date().getFullYear();
                      
      const dayEvents = getEventsForDate(i);
      
      cells.push(
        <div key={i} className={`h-24 border border-gray-100 p-2 flex flex-col transition-colors hover:bg-gray-50 ${isToday ? 'bg-indigo-50/30' : 'bg-white'}`}>
          <div className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full mb-1 ${isToday ? 'bg-indigo-600 text-white' : 'text-gray-700'}`}>
            {i}
          </div>
          <div className="flex-1 overflow-y-auto space-y-1 no-scrollbar">
            {dayEvents.map(event => (
              <div 
                key={event.id} 
                className={`text-[10px] px-1.5 py-0.5 rounded truncate font-medium ${
                  event.type === 'deadline' ? 'bg-red-100 text-red-700' :
                  event.type === 'meeting' ? 'bg-amber-100 text-amber-700' :
                  'bg-indigo-100 text-indigo-700'
                }`}
                title={event.title}
              >
                {event.title}
              </div>
            ))}
          </div>
        </div>
      );
    }
    
    return cells;
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      
      <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-white">
        <h2 className="text-lg font-bold text-gray-900">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <div className="flex space-x-2">
          <button 
            onClick={prevMonth}
            className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button 
            onClick={nextMonth}
            className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      
      <div className="grid grid-cols-7 border-b border-gray-100 bg-gray-50/80">
        {days.map(day => (
          <div key={day} className="py-2 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7">
        {renderCells()}
      </div>
    </div>
  );
}
