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
    address: '1234 Main Street\nSanta Monica, CA 90401',
    filingStatus: 'single',
    stateCode: 'DEFAULT',
    payFrequency: 'biweekly',
    ytdGross: 12000
  });

  const [deductions, setDeductions] = useState({
    healthInsurance: 0,
    retirement401k: 0,
    parkingFee: 0
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

  const handleDeductionChange = (field, value) => {
    setDeductions(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }));
  };

  const handleGeneratePaystub = () => {
    onGeneratePaystub({ ...employeeInfo, deductions }, timeWorked, payPeriod);
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
        <div className="form-row">
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
            <label htmlFor="hourlyRate">Hourly Rate ($):</label>
            <input
              type="number"
              id="hourlyRate"
              value={employeeInfo.hourlyRate}
              onChange={(e) => handleEmployeeChange('hourlyRate', parseFloat(e.target.value) || 0)}
              className="form-input"
              step="0.01"
              min="0"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="filingStatus">Filing Status:</label>
            <select
              id="filingStatus"
              value={employeeInfo.filingStatus}
              onChange={(e) => handleEmployeeChange('filingStatus', e.target.value)}
              className="form-select"
            >
              <option value="single">Single</option>
              <option value="marriedJointly">Married Filing Jointly</option>
              <option value="marriedSeparately">Married Filing Separately</option>
              <option value="headOfHousehold">Head of Household</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="stateCode">State:</label>
            <select
              id="stateCode"
              value={employeeInfo.stateCode}
              onChange={(e) => handleEmployeeChange('stateCode', e.target.value)}
              className="form-select"
            >
              <option value="DEFAULT">Default (5%)</option>
              <option value="CA">California</option>
              <option value="TX">Texas (No Tax)</option>
              <option value="NY">New York</option>
              <option value="FL">Florida (No Tax)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3>Deductions (Optional)</h3>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="healthInsurance">Health Insurance ($/month):</label>
            <input
              type="number"
              id="healthInsurance"
              value={deductions.healthInsurance}
              onChange={(e) => handleDeductionChange('healthInsurance', e.target.value)}
              className="form-input"
              step="0.01"
              min="0"
              placeholder="e.g. 150.00"
            />
          </div>

          <div className="form-group">
            <label htmlFor="retirement401k">401(k) Contribution (%):</label>
            <input
              type="number"
              id="retirement401k"
              value={deductions.retirement401k}
              onChange={(e) => handleDeductionChange('retirement401k', e.target.value)}
              className="form-input"
              step="0.1"
              min="0"
              max="100"
              placeholder="e.g. 5"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="parkingFee">Parking Fee ($/month):</label>
            <input
              type="number"
              id="parkingFee"
              value={deductions.parkingFee}
              onChange={(e) => handleDeductionChange('parkingFee', e.target.value)}
              className="form-input"
              step="0.01"
              min="0"
              placeholder="e.g. 25.00"
            />
          </div>
          <div className="form-group">
            {/* Empty space for symmetry */}
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3>Work Hours</h3>
        <div className="form-row">
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
        <div className="hours-display">
          <strong>Total Hours: </strong>
          {(() => {
            const [inHour, inMinute] = timeWorked.clockIn.split(':').map(Number);
            const [outHour, outMinute] = timeWorked.clockOut.split(':').map(Number);
            const clockInMinutes = inHour * 60 + inMinute;
            let clockOutMinutes = outHour * 60 + outMinute;
            if (clockOutMinutes < clockInMinutes) clockOutMinutes += 24 * 60;
            const hours = (clockOutMinutes - clockInMinutes) / 60;
            return `${hours.toFixed(2)} hours`;
          })()}
        </div>
      </div>

      <div className="form-section">
        <h3>Pay Period</h3>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="payStart">Start Date:</label>
            <input
              type="date"
              id="payStart"
              value={payPeriod.start}
              onChange={(e) => handlePayPeriodChange('start', e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="payEnd">End Date:</label>
            <input
              type="date"
              id="payEnd"
              value={payPeriod.end}
              onChange={(e) => handlePayPeriodChange('end', e.target.value)}
              className="form-input"
            />
          </div>
        </div>
        <div className="pay-period-display">
          <strong>Period: </strong>{formatDate(payPeriod.start)} - {formatDate(payPeriod.end)}
        </div>
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
