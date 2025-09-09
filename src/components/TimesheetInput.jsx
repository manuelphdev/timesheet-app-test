import React, { useState } from 'react';

const TIME_OPTIONS = [
  '06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '09:00', '09:30',
  '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00'
];

const TIME_LABELS = {
  '06:00': '6:00 AM', '06:30': '6:30 AM', '07:00': '7:00 AM', '07:30': '7:30 AM',
  '08:00': '8:00 AM', '08:30': '8:30 AM', '09:00': '9:00 AM', '09:30': '9:30 AM',
  '10:00': '10:00 AM', '10:30': '10:30 AM', '11:00': '11:00 AM', '11:30': '11:30 AM',
  '12:00': '12:00 PM', '12:30': '12:30 PM', '13:00': '1:00 PM', '13:30': '1:30 PM',
  '14:00': '2:00 PM', '14:30': '2:30 PM', '15:00': '3:00 PM', '15:30': '3:30 PM',
  '16:00': '4:00 PM', '16:30': '4:30 PM', '17:00': '5:00 PM', '17:30': '5:30 PM',
  '18:00': '6:00 PM', '18:30': '6:30 PM', '19:00': '7:00 PM', '19:30': '7:30 PM',
  '20:00': '8:00 PM', '20:30': '8:30 PM', '21:00': '9:00 PM', '21:30': '9:30 PM',
  '22:00': '10:00 PM'
};

function TimesheetInput({ onGeneratePaystub }) {
  const [employeeInfo, setEmployeeInfo] = useState({
    name: 'John Doe',
    employeeId: '200000',
    hourlyRate: 25.00,
    address: '1234 Main Street\nSanta Monica, CA 90401'
  });

  const [timeWorked, setTimeWorked] = useState({
    clockIn: '08:00',
    clockOut: '17:00'
  });

  const [payPeriod, setPayPeriod] = useState({
    start: '2024-04-01',
    end: '2024-04-15'
  });

  const handleEmployeeChange = (field, value) => {
    setEmployeeInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTimeChange = (field, value) => {
    setTimeWorked(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePayPeriodChange = (field, value) => {
    setPayPeriod(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleGeneratePaystub = () => {
    onGeneratePaystub(employeeInfo, timeWorked, payPeriod);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="timesheet-input">
      <div className="header">
        <h1>Employee Timesheet</h1>
        <p>Enter your work hours to generate a payslip</p>
      </div>

      <div className="form-section">
        <h3>Employee Information</h3>
        <div className="form-group">
          <label htmlFor="employeeName">Employee Name:</label>
          <input
            type="text"
            id="employeeName"
            value={employeeInfo.name}
            onChange={(e) => handleEmployeeChange('name', e.target.value)}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="employeeId">Employee ID:</label>
          <input
            type="text"
            id="employeeId"
            value={employeeInfo.employeeId}
            onChange={(e) => handleEmployeeChange('employeeId', e.target.value)}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="hourlyRate">Hourly Rate ($):</label>
          <input
            type="number"
            id="hourlyRate"
            value={employeeInfo.hourlyRate}
            onChange={(e) => handleEmployeeChange('hourlyRate', parseFloat(e.target.value))}
            className="form-input"
            step="0.01"
            min="0"
          />
        </div>
      </div>

      <div className="form-section">
        <h3>Work Hours</h3>
        <div className="time-inputs">
          <div className="form-group">
            <label htmlFor="clockIn">Clock In:</label>
            <select
              id="clockIn"
              value={timeWorked.clockIn}
              onChange={(e) => handleTimeChange('clockIn', e.target.value)}
              className="form-select"
            >
              {TIME_OPTIONS.map(time => (
                <option key={time} value={time}>
                  {TIME_LABELS[time]}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="clockOut">Clock Out:</label>
            <select
              id="clockOut"
              value={timeWorked.clockOut}
              onChange={(e) => handleTimeChange('clockOut', e.target.value)}
              className="form-select"
            >
              {TIME_OPTIONS.map(time => (
                <option key={time} value={time}>
                  {TIME_LABELS[time]}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3>Pay Period</h3>
        <div className="pay-period-inputs">
          <div className="form-group">
            <label htmlFor="payStart">Pay Period Start:</label>
            <input
              type="date"
              id="payStart"
              value={payPeriod.start}
              onChange={(e) => handlePayPeriodChange('start', e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="payEnd">Pay Period End:</label>
            <input
              type="date"
              id="payEnd"
              value={payPeriod.end}
              onChange={(e) => handlePayPeriodChange('end', e.target.value)}
              className="form-input"
            />
          </div>
        </div>
        <p className="pay-period-display">
          {formatDate(payPeriod.start)} - {formatDate(payPeriod.end)}
        </p>
      </div>

      <button 
        onClick={handleGeneratePaystub}
        className="generate-btn"
      >
        Generate Paystub
      </button>
    </div>
  );
}

export default TimesheetInput;
