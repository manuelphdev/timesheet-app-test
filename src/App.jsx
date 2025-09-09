import React, { useState } from 'react';
import './App.css';
import TimesheetInput from './components/TimesheetInput';
import PayslipDisplay from './components/PayslipDisplay';
import { calculatePaystub } from './utils/payrollCalculations';

function App() {
  const [currentView, setCurrentView] = useState('timesheet');
  const [paystubData, setPaystubData] = useState(null);

  const handleGeneratePaystub = (employeeInfo, timeWorked, payPeriod) => {
    const paystub = calculatePaystub(employeeInfo, timeWorked, payPeriod);
    setPaystubData(paystub);
    setCurrentView('payslip');
  };

  const handleBackToTimesheet = () => {
    setCurrentView('timesheet');
  };

  return (
    <div className="App">
      <div className="container">
        {currentView === 'timesheet' ? (
          <TimesheetInput onGeneratePaystub={handleGeneratePaystub} />
        ) : (
          <PayslipDisplay 
            paystubData={paystubData} 
            onBack={handleBackToTimesheet} 
          />
        )}
      </div>
    </div>
  );
}

export default App;
