import React, { useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import 'moment-timezone';

import { Icon } from 'shared/components';

import { DueDateSection, DueDateLabel, DueDateValue, NoDueDate, ClearButton, DatePickerModal, DatePickerHeader, DatePickerContent, Calendar, CalendarHeader, WeekDays, Days, Day, TimeSection, ActionButtons, Button } from './Styles';

const propTypes = {
  issue: PropTypes.object.isRequired,
  updateIssue: PropTypes.func.isRequired,
};

const ProjectBoardIssueDetailsDueDate = ({ issue, updateIssue }) => {
  const [isPickerOpen, setPickerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    issue.dueDate ? moment.utc(issue.dueDate).tz('America/Los_Angeles') : moment().tz('America/Los_Angeles')
  );

  const handleDueDateChange = () => {
    updateIssue({ dueDate: selectedDate.toISOString() });
    setPickerOpen(false);
  };

  const clearDueDate = () => {
    updateIssue({ dueDate: null });
    setPickerOpen(false);
  };

  const formatDisplayDate = (date) => {
    if (!date) return '';
    return moment.utc(date).tz('America/Los_Angeles').format('MMM D, YYYY [at] h:mm A [PST]');
  };

  const renderCalendar = () => {
    const startOfMonth = selectedDate.clone().startOf('month');
    const endOfMonth = selectedDate.clone().endOf('month');
    const startOfWeek = startOfMonth.clone().startOf('week');
    const endOfWeek = endOfMonth.clone().endOf('week');
    
    const days = [];
    const current = startOfWeek.clone();
    
    while (current.isSameOrBefore(endOfWeek)) {
      days.push(current.clone());
      current.add(1, 'day');
    }

    return days;
  };

  const isToday = (date) => {
    return moment().tz('America/Los_Angeles').isSame(date, 'day');
  };

  const isSelected = (date) => {
    return selectedDate.isSame(date, 'day');
  };

  const isCurrentMonth = (date) => {
    return selectedDate.isSame(date, 'month');
  };

  const previousMonth = () => {
    setSelectedDate(selectedDate.clone().subtract(1, 'month'));
  };

  const nextMonth = () => {
    setSelectedDate(selectedDate.clone().add(1, 'month'));
  };

  const selectDay = (date) => {
    setSelectedDate(date.clone().hour(selectedDate.hour()).minute(selectedDate.minute()));
  };

  const setTime = (hour, minute) => {
    setSelectedDate(selectedDate.clone().hour(hour).minute(minute));
  };

  return (
    <DueDateSection>
      <DueDateLabel>Due Date</DueDateLabel>
      {issue.dueDate ? (
        <DueDateValue onClick={() => setPickerOpen(true)}>
          <Icon type="calendar" size={16} />
          {formatDisplayDate(issue.dueDate)}
          <ClearButton onClick={(e) => {
            e.stopPropagation();
            clearDueDate();
          }}>
            <Icon type="close" size={14} />
          </ClearButton>
        </DueDateValue>
      ) : (
        <NoDueDate onClick={() => setPickerOpen(true)}>
          <Icon type="calendar" size={16} />
          Set due date
        </NoDueDate>
      )}
      
      {isPickerOpen && (
        <DatePickerModal>
          <DatePickerHeader>
            <h3>Set Due Date</h3>
            <Icon type="close" onClick={() => setPickerOpen(false)} />
          </DatePickerHeader>
          
          <DatePickerContent>
            <Calendar>
              <CalendarHeader>
                <Icon type="chevron-left" onClick={previousMonth} />
                <span>{selectedDate.format('MMMM YYYY')}</span>
                <Icon type="chevron-right" onClick={nextMonth} />
              </CalendarHeader>
              
              <WeekDays>
                {moment.weekdaysMin().map(day => (
                  <div key={day}>{day}</div>
                ))}
              </WeekDays>
              
              <Days>
                {renderCalendar().map((date, index) => (
                  <Day
                    key={index}
                    isToday={isToday(date)}
                    isSelected={isSelected(date)}
                    isCurrentMonth={isCurrentMonth(date)}
                    onClick={() => selectDay(date)}
                  >
                    {date.date()}
                  </Day>
                ))}
              </Days>
            </Calendar>
            
            <TimeSection>
              <h4>Time (PST)</h4>
              <div className="time-inputs">
                <select 
                  value={selectedDate.hour()} 
                  onChange={(e) => setTime(parseInt(e.target.value), selectedDate.minute())}
                >
                  {Array.from({length: 24}, (_, i) => (
                    <option key={i} value={i}>{i.toString().padStart(2, '0')}</option>
                  ))}
                </select>
                <span>:</span>
                <select 
                  value={selectedDate.minute()} 
                  onChange={(e) => setTime(selectedDate.hour(), parseInt(e.target.value))}
                >
                  {Array.from({length: 60}, (_, i) => (
                    <option key={i} value={i}>{i.toString().padStart(2, '0')}</option>
                  ))}
                </select>
              </div>
              <div className="time-display">
                {selectedDate.format('h:mm A [PST]')}
              </div>
            </TimeSection>
          </DatePickerContent>
          
          <ActionButtons>
            <Button variant="secondary" onClick={() => setPickerOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleDueDateChange}>
              Set Due Date
            </Button>
          </ActionButtons>
        </DatePickerModal>
      )}
    </DueDateSection>
  );
};

ProjectBoardIssueDetailsDueDate.propTypes = propTypes;

export default ProjectBoardIssueDetailsDueDate;
