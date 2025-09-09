import React, { useState } from 'react';

function PayslipDisplay({ paystubData, onBack }) {
  const [activeTab, setActiveTab] = useState('current');
  const [expandedSections, setExpandedSections] = useState({
    payInfo: true,
    grossPay: true,
    taxesDeductions: true,
    incomeTaxes: false,
    ficaTaxes: false,
    preTaxDeductions: false,
    postTaxDeductions: false
  });

  if (!paystubData) return null;

  const formatCurrency = (amount) => {
    const safeAmount = parseFloat(amount) || 0;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(safeAmount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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
    const netPercentage = paystubData.summary?.netPercentage || calculateNetPayPercentage();
    const taxPercentage = paystubData.summary?.taxPercentage || 0;
    const benefitPercentage = paystubData.summary?.benefitPercentage || 0;
    
    const total = netPercentage + taxPercentage + benefitPercentage;
    const normalizedNet = (netPercentage / total) * 100;
    const normalizedTax = (taxPercentage / total) * 100;
    
    return {
      background: `conic-gradient(
        #4CAF50 0% ${normalizedNet}%, 
        #9C27B0 ${normalizedNet}% ${normalizedNet + normalizedTax}%, 
        #2196F3 ${normalizedNet + normalizedTax}% 100%
      )`
    };
  };
  return (
    <div className="modern-payslip">
      <div className="payslip-header">
        <div className="header-controls">
          <div className="header-left">
            <button onClick={onBack} className="back-button">‹</button>
            <div className="title">Go Back</div>
          </div>
          <button onClick={() => window.print()} className="download-pdf-button">
            Download PDF
          </button>
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
              <div>{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</div>
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
              <span className="dot taxes">●</span> Taxes ({paystubData.summary?.taxPercentage || 0}%)
            </div>
            <div className="legend-item">
              <span className="dot deductions">●</span> Deductions ({paystubData.summary?.benefitPercentage || 0}%)
            </div>
            <div className="legend-item">
              <span className="dot takehome">●</span> Take Home ({paystubData.summary?.netPercentage || calculateNetPayPercentage()}%)
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
            <div className="pay-date">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</div>
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
                  <span className="pay-amount bold">
                    {activeTab === 'current' 
                      ? formatCurrency(paystubData.earnings.gross)
                      : formatCurrency(paystubData.ytd.gross)
                    }
                  </span>
                </div>
                <div className="pay-item-details">
                  <div className="pay-sub-item">
                    <span>Gross Earnings</span>
                    <span>
                      {activeTab === 'current' 
                        ? formatCurrency(paystubData.earnings.regular.amount)
                        : formatCurrency(paystubData.ytd.gross)
                      }
                    </span>
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
                  <span className="pay-amount negative">
                    ({activeTab === 'current' 
                      ? formatCurrency(paystubData.summary?.totalTaxes || (paystubData.deductions.federalTax.current + paystubData.deductions.stateTax.current + paystubData.deductions.socialSecurity.current + paystubData.deductions.medicare.current))
                      : formatCurrency((paystubData.deductions.federalTax.ytd || 0) + (paystubData.deductions.stateTax.ytd || 0) + (paystubData.deductions.socialSecurity.ytd || 0) + (paystubData.deductions.medicare.ytd || 0))
                    })
                  </span>
                </div>
                <div className="pay-item-details">
                  <div className="pay-sub-item">
                    <span>Federal Income Tax</span>
                    <span>
                      {activeTab === 'current' 
                        ? formatCurrency(paystubData.deductions.federalTax.current)
                        : formatCurrency(paystubData.deductions.federalTax.ytd || 0)
                      }
                    </span>
                  </div>
                  <div className="pay-sub-item">
                    <span>State Income Tax</span>
                    <span>
                      {activeTab === 'current' 
                        ? formatCurrency(paystubData.deductions.stateTax.current)
                        : formatCurrency(paystubData.deductions.stateTax.ytd || 0)
                      }
                    </span>
                  </div>
                  <div className="pay-sub-item">
                    <span>Social Security</span>
                    <span>
                      {activeTab === 'current' 
                        ? formatCurrency(paystubData.deductions.socialSecurity.current)
                        : formatCurrency(paystubData.deductions.socialSecurity.ytd || 0)
                      }
                    </span>
                  </div>
                  <div className="pay-sub-item">
                    <span>Medicare</span>
                    <span>
                      {activeTab === 'current' 
                        ? formatCurrency(paystubData.deductions.medicare.current)
                        : formatCurrency(paystubData.deductions.medicare.ytd || 0)
                      }
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Benefit Deductions */}
              <div className="pay-item">
                <div className="pay-item-header">
                  <span className="pay-label">Deductions</span>
                  <span className="pay-amount negative">
                    ({activeTab === 'current' 
                      ? formatCurrency(paystubData.summary?.totalBenefitDeductions || ((paystubData.deductions.preTax?.total || 0) + (paystubData.deductions.postTax?.total || 0)))
                      : formatCurrency(((paystubData.deductions.preTax?.total || 0) + (paystubData.deductions.postTax?.total || 0)) * (paystubData.payInfo?.currentPeriod || 1))
                    })
                  </span>
                </div>
              </div>
              
              {/* Take Home Earnings */}
              <div className="pay-item">
                <div className="pay-item-header">
                  <span className="pay-label bold">Take Home Earnings</span>
                  <span className="pay-amount bold">
                    {activeTab === 'current' 
                      ? formatCurrency(paystubData.netPay.current)
                      : formatCurrency(paystubData.ytd.net)
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Gross Pay Section */}
        <div className="accordion-section">
          <div 
            className="accordion-header enhanced-header"
            onClick={() => toggleSection('grossPay')}
          >
            <div className="header-content">
              <div className="header-top">
                <span className="header-title">Gross Pay</span>
                <span className={`chevron ${expandedSections.grossPay ? 'expanded' : ''}`}>›</span>
              </div>
              <div className="header-amount">
                {activeTab === 'current' 
                  ? formatCurrency(paystubData.earnings.gross)
                  : formatCurrency(paystubData.ytd.gross)
                }
              </div>
              <div className="progress-bar-container">
                <div 
                  className="progress-bar gross-bar" 
                  style={{
                    width: `${(() => {
                      const grossAmount = activeTab === 'current' 
                        ? (paystubData.earnings.gross || 0)
                        : (paystubData.ytd.gross || 0);
                      const taxesAmount = activeTab === 'current' 
                        ? ((paystubData.deductions.federalTax.current || 0) + (paystubData.deductions.stateTax.current || 0) + (paystubData.deductions.socialSecurity.current || 0) + (paystubData.deductions.medicare.current || 0) + (paystubData.deductions.preTax?.total || 0) + (paystubData.deductions.postTax?.total || 0))
                        : ((paystubData.deductions.federalTax.ytd || 0) + (paystubData.deductions.stateTax.ytd || 0) + (paystubData.deductions.socialSecurity.ytd || 0) + (paystubData.deductions.medicare.ytd || 0) + ((paystubData.deductions.preTax?.total || 0) + (paystubData.deductions.postTax?.total || 0)) * (paystubData.payInfo?.currentPeriod || 1));
                      const netPayPercentage = grossAmount > 0 ? Math.round(((grossAmount - taxesAmount) / grossAmount) * 100) : 100;
                      return netPayPercentage;
                    })()}%`
                  }}
                ></div>
              </div>
              <div className="percentage-label">
                {(() => {
                  const grossAmount = activeTab === 'current' 
                    ? (paystubData.earnings.gross || 0)
                    : (paystubData.ytd.gross || 0);
                  const taxesAmount = activeTab === 'current' 
                    ? ((paystubData.deductions.federalTax.current || 0) + (paystubData.deductions.stateTax.current || 0) + (paystubData.deductions.socialSecurity.current || 0) + (paystubData.deductions.medicare.current || 0) + (paystubData.deductions.preTax?.total || 0) + (paystubData.deductions.postTax?.total || 0))
                    : ((paystubData.deductions.federalTax.ytd || 0) + (paystubData.deductions.stateTax.ytd || 0) + (paystubData.deductions.socialSecurity.ytd || 0) + (paystubData.deductions.medicare.ytd || 0) + ((paystubData.deductions.preTax?.total || 0) + (paystubData.deductions.postTax?.total || 0)) * (paystubData.payInfo?.currentPeriod || 1));
                  const netPayPercentage = grossAmount > 0 ? ((grossAmount - taxesAmount) / grossAmount * 100).toFixed(2) : '100.00';
                  return `${netPayPercentage}% Take Home Pay`;
                })()}
              </div>
            </div>
          </div>
          <div className={`accordion-content ${expandedSections.grossPay ? 'expanded' : ''}`}>
            <div className="gross-pay-content">
              {/* Earnings */}
              <div className="pay-item">
                <div className="pay-item-header">
                  <span className="pay-label bold">Earnings</span>
                  <span className="pay-amount bold">
                    {activeTab === 'current' 
                      ? formatCurrency(paystubData.earnings.gross)
                      : formatCurrency(paystubData.ytd.gross)
                    }
                  </span>
                </div>
              </div>
              
              {/* Regular */}
              <div className="pay-item">
                <div className="pay-item-header">
                  <span className="pay-label">Regular</span>
                  <span className="pay-amount">
                    {activeTab === 'current' 
                      ? formatCurrency(paystubData.earnings.regular.amount)
                      : formatCurrency(paystubData.ytd.gross)
                    }
                  </span>
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
            className="accordion-header enhanced-header"
            onClick={() => toggleSection('taxesDeductions')}
          >
            <div className="header-content">
              <div className="header-top">
                <span className="header-title">Taxes and Deductions</span>
                <span className={`chevron ${expandedSections.taxesDeductions ? 'expanded' : ''}`}>›</span>
              </div>
              <div className="header-amount">
                {(() => {
                  const taxesAmount = activeTab === 'current' 
                    ? ((paystubData.deductions.federalTax.current || 0) + (paystubData.deductions.stateTax.current || 0) + (paystubData.deductions.socialSecurity.current || 0) + (paystubData.deductions.medicare.current || 0) + (paystubData.deductions.preTax?.total || 0) + (paystubData.deductions.postTax?.total || 0))
                    : ((paystubData.deductions.federalTax.ytd || 0) + (paystubData.deductions.stateTax.ytd || 0) + (paystubData.deductions.socialSecurity.ytd || 0) + (paystubData.deductions.medicare.ytd || 0) + ((paystubData.deductions.preTax?.total || 0) + (paystubData.deductions.postTax?.total || 0)) * (paystubData.payInfo?.currentPeriod || 1));
                  return formatCurrency(taxesAmount);
                })()}
              </div>
              <div className="progress-bar-container">
                <div 
                  className="progress-bar taxes-bar" 
                  style={{
                    width: `${(() => {
                      const grossAmount = activeTab === 'current' 
                        ? (paystubData.earnings.gross || 0)
                        : (paystubData.ytd.gross || 0);
                      const taxesAmount = activeTab === 'current' 
                        ? ((paystubData.deductions.federalTax.current || 0) + (paystubData.deductions.stateTax.current || 0) + (paystubData.deductions.socialSecurity.current || 0) + (paystubData.deductions.medicare.current || 0) + (paystubData.deductions.preTax?.total || 0) + (paystubData.deductions.postTax?.total || 0))
                        : ((paystubData.deductions.federalTax.ytd || 0) + (paystubData.deductions.stateTax.ytd || 0) + (paystubData.deductions.socialSecurity.ytd || 0) + (paystubData.deductions.medicare.ytd || 0) + ((paystubData.deductions.preTax?.total || 0) + (paystubData.deductions.postTax?.total || 0)) * (paystubData.payInfo?.currentPeriod || 1));
                      return grossAmount > 0 ? Math.round((taxesAmount / grossAmount) * 100) : 0;
                    })()}%`
                  }}
                ></div>
              </div>
              <div className="percentage-label">
                {(() => {
                  const grossAmount = activeTab === 'current' 
                    ? (paystubData.earnings.gross || 0)
                    : (paystubData.ytd.gross || 0);
                  const taxesAmount = activeTab === 'current' 
                    ? ((paystubData.deductions.federalTax.current || 0) + (paystubData.deductions.stateTax.current || 0) + (paystubData.deductions.socialSecurity.current || 0) + (paystubData.deductions.medicare.current || 0) + (paystubData.deductions.preTax?.total || 0) + (paystubData.deductions.postTax?.total || 0))
                    : ((paystubData.deductions.federalTax.ytd || 0) + (paystubData.deductions.stateTax.ytd || 0) + (paystubData.deductions.socialSecurity.ytd || 0) + (paystubData.deductions.medicare.ytd || 0) + ((paystubData.deductions.preTax?.total || 0) + (paystubData.deductions.postTax?.total || 0)) * (paystubData.payInfo?.currentPeriod || 1));
                  const percentage = grossAmount > 0 ? ((taxesAmount / grossAmount) * 100).toFixed(2) : '0.00';
                  return `${percentage}% of Gross Pay`;
                })()}
              </div>
            </div>
          </div>
          <div className={`accordion-content ${expandedSections.taxesDeductions ? 'expanded' : ''}`}>
            <div className="taxes-deductions-content">
              
              {/* Income Taxes */}
              <div className="sub-accordion">
                <div 
                  className="sub-accordion-header"
                  onClick={() => toggleSection('incomeTaxes')}
                >
                  <span>Income Taxes</span>
                  <span className="amount">
                    {formatCurrency((paystubData.deductions.federalTax.current || 0) + (paystubData.deductions.stateTax.current || 0))}
                  </span>
                  <span className={`chevron ${expandedSections.incomeTaxes ? 'expanded' : ''}`}>›</span>
                </div>
                <div className={`sub-accordion-content ${expandedSections.incomeTaxes ? 'expanded' : ''}`}>
                  <div className="tax-breakdown">
                    <div className="tax-item">
                      <span>Federal Income Tax</span>
                      <span>{formatCurrency(paystubData.deductions.federalTax.current)}</span>
                    </div>
                    <div className="tax-item">
                      <span>State Income Tax</span>
                      <span>{formatCurrency(paystubData.deductions.stateTax.current)}</span>
                    </div>
                    {paystubData.deductions.taxes?.sdi?.current > 0 && (
                      <div className="tax-item">
                        <span>State Disability Insurance</span>
                        <span>{formatCurrency(paystubData.deductions.taxes.sdi.current)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* FICA Taxes */}
              <div className="sub-accordion">
                <div 
                  className="sub-accordion-header"
                  onClick={() => toggleSection('ficaTaxes')}
                >
                  <span>FICA Taxes (Payroll Taxes)</span>
                  <span className="amount">
                    {formatCurrency((paystubData.deductions.socialSecurity.current || 0) + (paystubData.deductions.medicare.current || 0))}
                  </span>
                  <span className={`chevron ${expandedSections.ficaTaxes ? 'expanded' : ''}`}>›</span>
                </div>
                <div className={`sub-accordion-content ${expandedSections.ficaTaxes ? 'expanded' : ''}`}>
                  <div className="tax-breakdown">
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
              {/* Pre Tax Deductions */}
              <div className="sub-accordion">
                <div 
                  className="sub-accordion-header"
                  onClick={() => toggleSection('preTaxDeductions')}
                >
                  <span>Pre Tax Deductions</span>
                  <span className="amount">{formatCurrency(paystubData.deductions.preTax?.total || 0)}</span>
                  <span className={`chevron ${expandedSections.preTaxDeductions ? 'expanded' : ''}`}>›</span>
                </div>
                <div className={`sub-accordion-content ${expandedSections.preTaxDeductions ? 'expanded' : ''}`}>
                  <div className="tax-breakdown">
                    {paystubData.deductions.preTax?.items?.health > 0 && (
                      <div className="tax-item">
                        <span>Health Insurance</span>
                        <span>{formatCurrency(paystubData.deductions.preTax.items.health)}</span>
                      </div>
                    )}
                    {paystubData.deductions.preTax?.items?.retirement401k > 0 && (
                      <div className="tax-item">
                        <span>401(k) Contribution</span>
                        <span>{formatCurrency(paystubData.deductions.preTax.items.retirement401k)}</span>
                      </div>
                    )}
                    {paystubData.deductions.preTax?.items?.dental > 0 && (
                      <div className="tax-item">
                        <span>Dental Insurance</span>
                        <span>{formatCurrency(paystubData.deductions.preTax.items.dental)}</span>
                      </div>
                    )}
                    {paystubData.deductions.preTax?.items?.hsa > 0 && (
                      <div className="tax-item">
                        <span>HSA Contribution</span>
                        <span>{formatCurrency(paystubData.deductions.preTax.items.hsa)}</span>
                      </div>
                    )}
                    {(paystubData.deductions.preTax?.total || 0) === 0 && (
                      <div className="sub-item-placeholder">No pre-tax deductions</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Post Tax Deductions */}
              <div className="sub-accordion">
                <div 
                  className="sub-accordion-header"
                  onClick={() => toggleSection('postTaxDeductions')}
                >
                  <span>Post Tax Deductions</span>
                  <span className="amount">{formatCurrency(paystubData.deductions.postTax?.total || 0)}</span>
                  <span className={`chevron ${expandedSections.postTaxDeductions ? 'expanded' : ''}`}>›</span>
                </div>
                <div className={`sub-accordion-content ${expandedSections.postTaxDeductions ? 'expanded' : ''}`}>
                  <div className="tax-breakdown">
                    {paystubData.deductions.postTax?.items?.parking > 0 && (
                      <div className="tax-item">
                        <span>Parking Fee</span>
                        <span>{formatCurrency(paystubData.deductions.postTax.items.parking)}</span>
                      </div>
                    )}
                    {paystubData.deductions.postTax?.items?.lifeInsurance > 0 && (
                      <div className="tax-item">
                        <span>Life Insurance</span>
                        <span>{formatCurrency(paystubData.deductions.postTax.items.lifeInsurance)}</span>
                      </div>
                    )}
                    {paystubData.deductions.postTax?.items?.garnishment > 0 && (
                      <div className="tax-item">
                        <span>Garnishment</span>
                        <span>{formatCurrency(paystubData.deductions.postTax.items.garnishment)}</span>
                      </div>
                    )}
                    {(paystubData.deductions.postTax?.total || 0) === 0 && (
                      <div className="sub-item-placeholder">No post-tax deductions</div>
                    )}
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
