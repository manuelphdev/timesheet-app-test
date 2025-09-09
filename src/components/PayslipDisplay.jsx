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
    const netPercentage = calculateNetPayPercentage();
    const taxPercentage = 20;
    const deductionPercentage = 14;
    
    return {
      background: `conic-gradient(
        #4CAF50 0% ${netPercentage}%, 
        #9C27B0 ${netPercentage}% ${netPercentage + taxPercentage}%, 
        #2196F3 ${netPercentage + taxPercentage}% 100%
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
              <span className="dot taxes">●</span> Taxes (20%)
            </div>
            <div className="legend-item">
              <span className="dot deductions">●</span> Deductions (14%)
            </div>
            <div className="legend-item">
              <span className="dot takehome">●</span> Take Home ({calculateNetPayPercentage()}%)
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
        <div className="accordion-section">
          <div 
            className="accordion-header" 
            onClick={() => toggleSection('payInfo')}
          >
            <span>Pay Info</span>
            <span className={`chevron ${expandedSections.payInfo ? 'expanded' : ''}`}>›</span>
          </div>
          <div className={`accordion-content ${expandedSections.payInfo ? 'expanded' : ''}`}>
            <div className="pay-info-content">
              {/* Earnings */}
              <div className="pay-item">
                <div className="pay-item-header">
                  <span className="pay-label bold">Earnings</span>
                  <span className="pay-amount bold">{formatCurrency(paystubData.earnings.gross)}</span>
                </div>
                <div className="pay-item-details">
                  <div className="pay-sub-item">
                    <span>Gross Earnings</span>
                    <span>{formatCurrency(paystubData.earnings.regular.amount)}</span>
                  </div>
                  <div className="pay-sub-item">
                    <span>Non-Taxable Earnings</span>
                    <span>$0.00</span>
                  </div>
                </div>
              </div>
              
              {/* Taxes */}
              <div className="pay-item">
                <div className="pay-item-header">
                  <span className="pay-label">Taxes</span>
                  <span className="pay-amount negative">({formatCurrency(paystubData.deductions.federalTax.current + paystubData.deductions.stateTax.current)})</span>
                </div>
              </div>
              
              {/* Deductions */}
              <div className="pay-item">
                <div className="pay-item-header">
                  <span className="pay-label">Deductions</span>
                  <span className="pay-amount negative">({formatCurrency(paystubData.deductions.socialSecurity.current + paystubData.deductions.medicare.current)})</span>
                </div>
              </div>
              
              {/* Take Home Earnings */}
              <div className="pay-item">
                <div className="pay-item-header">
                  <span className="pay-label bold">Take Home Earnings</span>
                  <span className="pay-amount bold">{formatCurrency(paystubData.netPay.current)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Gross Pay Section */}
        <div className="accordion-section">
          <div 
            className="accordion-header"
            onClick={() => toggleSection('grossPay')}
          >
            <span>Gross Pay</span>
            <span className={`chevron ${expandedSections.grossPay ? 'expanded' : ''}`}>›</span>
          </div>
          <div className={`accordion-content ${expandedSections.grossPay ? 'expanded' : ''}`}>
            <div className="gross-pay-content">
              {/* Earnings */}
              <div className="pay-item">
                <div className="pay-item-header">
                  <span className="pay-label bold">Earnings</span>
                  <span className="pay-amount bold">{formatCurrency(paystubData.earnings.gross)}</span>
                </div>
              </div>
              
              {/* Regular */}
              <div className="pay-item">
                <div className="pay-item-header">
                  <span className="pay-label">Regular</span>
                  <span className="pay-amount">{formatCurrency(paystubData.earnings.regular.amount)}</span>
                </div>
              </div>
              
              {/* Double Time */}
              <div className="pay-item">
                <div className="pay-item-header">
                  <span className="pay-label">Double Time</span>
                  <span className="pay-amount">$0.00</span>
                </div>
              </div>
              
              {/* Overtime */}
              {paystubData.earnings.overtime.hours > 0 && (
                <div className="pay-item">
                  <div className="pay-item-header">
                    <span className="pay-label">Overtime</span>
                    <span className="pay-amount">{formatCurrency(paystubData.earnings.overtime.amount)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Taxes and Deductions Section */}
        <div className="accordion-section">
          <div 
            className="accordion-header"
            onClick={() => toggleSection('taxesDeductions')}
          >
            <span>Taxes and Deductions</span>
            <span className={`chevron ${expandedSections.taxesDeductions ? 'expanded' : ''}`}>›</span>
          </div>
          <div className={`accordion-content ${expandedSections.taxesDeductions ? 'expanded' : ''}`}>
            <div className="taxes-deductions-content">
              {/* Pre Tax Deductions */}
              <div className="sub-accordion">
                <div 
                  className="sub-accordion-header"
                  onClick={() => toggleSection('preTaxDeductions')}
                >
                  <span>Pre Tax Deductions</span>
                  <span className="amount">{formatCurrency(paystubData.deductions.preTax || 0)}</span>
                  <span className={`chevron ${expandedSections.preTaxDeductions ? 'expanded' : ''}`}>›</span>
                </div>
                <div className={`sub-accordion-content ${expandedSections.preTaxDeductions ? 'expanded' : ''}`}>
                  <div className="sub-item-placeholder">No pre-tax deductions</div>
                </div>
              </div>

              {/* Post Tax Deductions */}
              <div className="sub-accordion">
                <div 
                  className="sub-accordion-header"
                  onClick={() => toggleSection('postTaxDeductions')}
                >
                  <span>Post Tax Deductions</span>
                  <span className="amount">{formatCurrency(paystubData.deductions.postTax || 0)}</span>
                  <span className={`chevron ${expandedSections.postTaxDeductions ? 'expanded' : ''}`}>›</span>
                </div>
                <div className={`sub-accordion-content ${expandedSections.postTaxDeductions ? 'expanded' : ''}`}>
                  <div className="sub-item-placeholder">No post-tax deductions</div>
                </div>
              </div>

              {/* Employee Taxes */}
              <div className="sub-accordion">
                <div 
                  className="sub-accordion-header"
                  onClick={() => toggleSection('employeeTaxes')}
                >
                  <span>Employee Taxes</span>
                  <span className="amount">{formatCurrency(paystubData.deductions.federalTax.current + paystubData.deductions.stateTax.current + paystubData.deductions.socialSecurity.current + paystubData.deductions.medicare.current)}</span>
                  <span className={`chevron ${expandedSections.employeeTaxes ? 'expanded' : ''}`}>›</span>
                </div>
                <div className={`sub-accordion-content ${expandedSections.employeeTaxes ? 'expanded' : ''}`}>
                  <div className="tax-breakdown">
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PayslipDisplay;
