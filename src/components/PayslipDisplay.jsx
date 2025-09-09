import React, { useState } from 'react';

function PayslipDisplay({ paystubData, onBack }) {
  const [activeTab, setActiveTab] = useState('current');
  const [expandedSections, setExpandedSections] = useState({
    payInfo: true,
    grossPay: true,
    taxesDeductions: true,
    preTaxDeductions: false,
    postTaxDeductions: false,
    employeeTaxes: false
  });

  if (!paystubData) return null;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatHours = (hours) => {
    return hours.toFixed(2);
  };

  const calculateNetPayPercentage = () => {
    return Math.round((paystubData.netPay.current / paystubData.earnings.gross) * 100);
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getCircleStyle = () => {
    const percentage = calculateNetPayPercentage();
    return {
      background: `conic-gradient(
        #4CAF50 0% ${percentage}%, 
        #FFC107 ${percentage}% ${percentage + 15}%, 
        #f0f0f0 ${percentage + 15}% 100%
      )`
    };
  };

  return (
    <div className="modern-payslip">
      <div className="payslip-header">
        <div className="header-controls">
          <button onClick={onBack} className="back-button">‹</button>
          <div className="home-icon">🏠</div>
          <div className="title">Pay Details</div>
        </div>
      </div>

      <div className="payslip-body">
        {/* Employee Info Header */}
        <div className="employee-header">
          <div className="employee-info">
            <div className="employee-name">{paystubData.employee.name}</div>
            <div className="employee-address">
              {paystubData.employee.address.split('\n').map((line, index) => (
                <div key={index}>{line}</div>
              ))}
            </div>
          </div>
          <div className="pay-period-info">
            <div className="employee-id">
              <strong>Employee ID</strong>
              <div>{paystubData.employee.employeeId}</div>
              <div>Paycheck</div>
              <div>#{paystubData.employee.employeeId}</div>
            </div>
            <div className="pay-dates">
              <div><strong>Paid</strong></div>
              <div>Pay Period</div>
              <div className="date-range">
                {formatDate(paystubData.payPeriod.start)} - {formatDate(paystubData.payPeriod.end)}
              </div>
            </div>
          </div>
        </div>

        {/* Circle Chart and Legend */}
        <div className="chart-section">
          <div className="circle-chart">
            <div className="circle-container" style={getCircleStyle()}>
              <div className="circle-inner">
                <div className="percentage">{calculateNetPayPercentage()}%</div>
              </div>
            </div>
          </div>
          <div className="chart-legend">
            <div className="legend-item">
              <span className="dot current">●</span> Current (20%)
            </div>
            <div className="legend-item">
              <span className="dot deductions">●</span> Deductions (44%)
            </div>
            <div className="legend-item">
              <span className="dot other">●</span> Other Expenses (36%)
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs-section">
          <div className="tab-headers">
            <button 
              className={`tab ${activeTab === 'current' ? 'active' : ''}`}
              onClick={() => setActiveTab('current')}
            >
              Current
            </button>
            <button 
              className={`tab ${activeTab === 'ytd' ? 'active' : ''}`}
              onClick={() => setActiveTab('ytd')}
            >
              Year-To-Date
            </button>
          </div>

          <div className="pay-summary">
            <div className="pay-date">Dec 13, 2024</div>
            <div className="net-pay-amount">
              {activeTab === 'current' 
                ? formatCurrency(paystubData.netPay.current)
                : formatCurrency(paystubData.ytd.net)
              }
            </div>
          </div>
        </div>

        {/* Pay Info Section */}
        <div className="expandable-section">
          <div 
            className="section-header clickable" 
            onClick={() => toggleSection('payInfo')}
          >
            <span>Pay Info</span>
            <span className="expand-icon">{expandedSections.payInfo ? '⌄' : '›'}</span>
          </div>
          {expandedSections.payInfo && (
            <div className="section-content">
              {/* Earnings */}
              <div className="earnings-section">
                <div className="earnings-label">Earnings</div>
                <div className="earnings-total">{formatCurrency(paystubData.earnings.gross)}</div>
                <div className="earnings-details">
                  <div className="earnings-item">
                    <span>Regular</span>
                    <span>{formatHours(paystubData.earnings.regular.hours)}</span>
                    <span>{formatCurrency(paystubData.earnings.regular.amount)}</span>
                  </div>
                  <div className="earnings-item">
                    <span>Taxes</span>
                    <span>—</span>
                    <span>—</span>
                  </div>
                  <div className="earnings-item">
                    <span>Other</span>
                    <span>—</span>
                    <span>—</span>
                  </div>
                  {paystubData.earnings.overtime.hours > 0 && (
                    <div className="earnings-item">
                      <span>Overtime</span>
                      <span>{formatHours(paystubData.earnings.overtime.hours)}</span>
                      <span>{formatCurrency(paystubData.earnings.overtime.amount)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Gross Pay */}
              <div className="expandable-section">
                <div 
                  className="section-header clickable"
                  onClick={() => toggleSection('grossPay')}
                >
                  <span>Gross Pay</span>
                  <span className="expand-icon">{expandedSections.grossPay ? '⌄' : '›'}</span>
                </div>
                {expandedSections.grossPay && (
                  <div className="section-content">
                    <div className="gross-pay-amount">
                      {formatCurrency(paystubData.earnings.gross)}
                    </div>
                    <div className="progress-bar-container">
                      <div className="progress-bar gross" style={{width: '100%'}}></div>
                    </div>
                    <div className="earnings-breakdown">
                      <div className="breakdown-header">Earnings</div>
                      <div className="breakdown-total">{formatCurrency(paystubData.earnings.gross)}</div>
                      <div className="breakdown-items">
                        <div className="breakdown-item">
                          <span>Regular</span>
                          <span>{formatHours(paystubData.earnings.regular.hours)}</span>
                          <span>{formatCurrency(paystubData.earnings.regular.amount)}</span>
                        </div>
                        <div className="breakdown-item">
                          <span>Taxes</span>
                          <span>0.00</span>
                          <span>$0.00</span>
                        </div>
                        <div className="breakdown-item">
                          <span>Other</span>
                          <span>0.00</span>
                          <span>$0.00</span>
                        </div>
                        {paystubData.earnings.overtime.hours > 0 && (
                          <div className="breakdown-item">
                            <span>Overtime</span>
                            <span>{formatHours(paystubData.earnings.overtime.hours)}</span>
                            <span>{formatCurrency(paystubData.earnings.overtime.amount)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Taxes and Deductions */}
              <div className="expandable-section">
                <div 
                  className="section-header clickable"
                  onClick={() => toggleSection('taxesDeductions')}
                >
                  <span>Taxes and Deductions</span>
                  <span className="expand-icon">{expandedSections.taxesDeductions ? '⌄' : '›'}</span>
                </div>
                {expandedSections.taxesDeductions && (
                  <div className="section-content">
                    <div className="deductions-amount">
                      {formatCurrency(paystubData.deductions.total.current)}
                    </div>
                    <div className="deductions-percentage">
                      {Math.round((paystubData.deductions.total.current / paystubData.earnings.gross) * 100)}% of Gross Pay
                    </div>
                    <div className="progress-bar-container">
                      <div 
                        className="progress-bar deductions" 
                        style={{
                          width: `${(paystubData.deductions.total.current / paystubData.earnings.gross) * 100}%`
                        }}
                      ></div>
                    </div>

                    {/* Pre Tax Deductions */}
                    <div className="sub-section">
                      <div 
                        className="sub-section-header"
                        onClick={() => toggleSection('preTaxDeductions')}
                      >
                        <span>Pre Tax Deductions</span>
                        <span className="amount">{formatCurrency(paystubData.deductions.preTax || 0)}</span>
                        <span className="expand-icon">{expandedSections.preTaxDeductions ? '⌄' : '›'}</span>
                      </div>
                    </div>

                    {/* Post Tax Deductions */}
                    <div className="sub-section">
                      <div 
                        className="sub-section-header"
                        onClick={() => toggleSection('postTaxDeductions')}
                      >
                        <span>Post Tax Deductions</span>
                        <span className="amount">{formatCurrency(paystubData.deductions.postTax || 0)}</span>
                        <span className="expand-icon">{expandedSections.postTaxDeductions ? '⌄' : '›'}</span>
                      </div>
                    </div>

                    {/* Employee Taxes */}
                    <div className="sub-section">
                      <div 
                        className="sub-section-header"
                        onClick={() => toggleSection('employeeTaxes')}
                      >
                        <span>Employee Taxes</span>
                        <span className="amount">{formatCurrency(paystubData.deductions.total.current)}</span>
                        <span className="expand-icon">{expandedSections.employeeTaxes ? '⌄' : '›'}</span>
                      </div>
                      {expandedSections.employeeTaxes && (
                        <div className="sub-section-content">
                          <div className="tax-item">
                            <span>Federal Tax</span>
                            <span>{formatCurrency(paystubData.deductions.federalTax.current)}</span>
                          </div>
                          <div className="tax-item">
                            <span>State Tax</span>
                            <span>{formatCurrency(paystubData.deductions.stateTax.current)}</span>
                          </div>
                          <div className="tax-item">
                            <span>Social Security</span>
                            <span>{formatCurrency(paystubData.deductions.socialSecurity.current)}</span>
                          </div>
                          <div className="tax-item">
                            <span>Medicare</span>
                            <span>{formatCurrency(paystubData.deductions.medicare.current)}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PayslipDisplay;
