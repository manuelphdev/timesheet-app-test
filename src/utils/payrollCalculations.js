// US Payroll Calculations - 2024 Tax Year
// Based on IRS Pub. 15-T (2024) and current wage bases

// 2024 Annual Federal Income Tax Brackets (for annualized calculation)
export const TAX_BRACKETS_2024 = {
  single: [
    { min: 0, max: 11000, rate: 0.10 },
    { min: 11000, max: 44725, rate: 0.12 },
    { min: 44725, max: 95375, rate: 0.22 },
    { min: 95375, max: 182050, rate: 0.24 },
    { min: 182050, max: 231250, rate: 0.32 },
    { min: 231250, max: 578125, rate: 0.35 },
    { min: 578125, max: Infinity, rate: 0.37 }
  ],
  marriedJointly: [
    { min: 0, max: 22000, rate: 0.10 },
    { min: 22000, max: 89450, rate: 0.12 },
    { min: 89450, max: 190750, rate: 0.22 },
    { min: 190750, max: 364200, rate: 0.24 },
    { min: 364200, max: 462500, rate: 0.32 },
    { min: 462500, max: 693750, rate: 0.35 },
    { min: 693750, max: Infinity, rate: 0.37 }
  ]
};

// 2024 Standard Deductions
export const STANDARD_DEDUCTION_2024 = {
  single: 14600,
  marriedJointly: 29200,
  marriedSeparately: 14600,
  headOfHousehold: 21900
};

// 2024 FICA Rates and Wage Bases
export const FICA_2024 = {
  socialSecurity: {
    rate: 0.062, // 6.2%
    wageBase: 168600, // 2024 SS wage base
    maxTax: 10453.20 // 6.2% of $168,600
  },
  medicare: {
    rate: 0.0145, // 1.45%
    additionalRate: 0.009, // 0.9% additional
    additionalThreshold: 200000 // Additional Medicare threshold
  }
};

// State Tax Rates (expandable by state)
export const STATE_TAX_RATES = {
  CA: { rate: 0.01, sdi: 0.009, sdiWageBase: 153164 }, // California with SDI
  TX: { rate: 0.00 }, // No state income tax
  NY: { rate: 0.04 }, // Simplified NY rate
  FL: { rate: 0.00 }, // No state income tax
  DEFAULT: { rate: 0.05 } // Default 5% for demo
};

// Pay Frequencies
export const PAY_FREQUENCIES = {
  weekly: 52,
  biweekly: 26,
  semimonthly: 24,
  monthly: 12
};

export function calculateHoursWorked(clockIn, clockOut) {
  const [inHour, inMinute] = clockIn.split(':').map(Number);
  const [outHour, outMinute] = clockOut.split(':').map(Number);
  
  const clockInMinutes = inHour * 60 + inMinute;
  let clockOutMinutes = outHour * 60 + outMinute;
  
  // Handle next day clock out
  if (clockOutMinutes < clockInMinutes) {
    clockOutMinutes += 24 * 60;
  }
  
  return (clockOutMinutes - clockInMinutes) / 60;
}

export function calculateGrossPay(hoursWorked, hourlyRate, overtimeRate = 1.5) {
  const regularHours = Math.min(hoursWorked, 40);
  const overtimeHours = Math.max(0, hoursWorked - 40);
  
  const regularPay = regularHours * hourlyRate;
  const overtimePay = overtimeHours * hourlyRate * overtimeRate;
  
  return {
    regularHours,
    overtimeHours,
    regularPay,
    overtimePay,
    grossPay: regularPay + overtimePay
  };
}

// Calculate Federal Income Tax using annualized method with standard deduction
export function calculateFederalTax(taxableWages, filingStatus = 'single', periodsPerYear = 26, ytdWages = 0) {
  // Annualize the taxable wages
  const annualizedWages = taxableWages * periodsPerYear;
  
  // Apply standard deduction
  const standardDeduction = STANDARD_DEDUCTION_2024[filingStatus] || STANDARD_DEDUCTION_2024.single;
  const taxableAnnualIncome = Math.max(0, annualizedWages - standardDeduction);
  
  // Calculate annual tax using brackets
  const brackets = TAX_BRACKETS_2024[filingStatus] || TAX_BRACKETS_2024.single;
  let annualTax = 0;
  let remainingIncome = taxableAnnualIncome;
  
  for (const bracket of brackets) {
    if (remainingIncome <= 0) break;
    
    const taxableInThisBracket = Math.min(
      remainingIncome,
      bracket.max - bracket.min
    );
    
    annualTax += taxableInThisBracket * bracket.rate;
    remainingIncome -= taxableInThisBracket;
  }
  
  // De-annualize back to period tax
  return annualTax / periodsPerYear;
}

// Calculate FICA with proper wage bases and YTD awareness
export function calculateFICA(grossWages, ytdGross = 0) {
  // Social Security calculation with wage base limit
  const ssWageBase = FICA_2024.socialSecurity.wageBase;
  const ssRate = FICA_2024.socialSecurity.rate;
  
  let socialSecurity = 0;
  if (ytdGross < ssWageBase) {
    const remainingSSWages = ssWageBase - ytdGross;
    const ssWagesThisPeriod = Math.min(grossWages, remainingSSWages);
    socialSecurity = ssWagesThisPeriod * ssRate;
  }
  
  // Medicare calculation (no wage base limit)
  const medicare = grossWages * FICA_2024.medicare.rate;
  
  // Additional Medicare (0.9% on wages over $200K YTD)
  let additionalMedicare = 0;
  const additionalThreshold = FICA_2024.medicare.additionalThreshold;
  if (ytdGross + grossWages > additionalThreshold) {
    const excessWages = Math.min(grossWages, (ytdGross + grossWages) - additionalThreshold);
    if (ytdGross < additionalThreshold) {
      additionalMedicare = excessWages * FICA_2024.medicare.additionalRate;
    } else {
      additionalMedicare = grossWages * FICA_2024.medicare.additionalRate;
    }
  }
  
  return {
    socialSecurity,
    medicare,
    additionalMedicare,
    total: socialSecurity + medicare + additionalMedicare
  };
}

// Calculate State Income Tax (configurable by state)
export function calculateStateTax(taxableWages, stateCode = 'DEFAULT') {
  const stateConfig = STATE_TAX_RATES[stateCode] || STATE_TAX_RATES.DEFAULT;
  
  const stateTax = taxableWages * stateConfig.rate;
  
  // Calculate SDI if applicable (California example)
  let sdi = 0;
  if (stateConfig.sdi && stateConfig.sdiWageBase) {
    sdi = Math.min(taxableWages * stateConfig.sdi, stateConfig.sdiWageBase * stateConfig.sdi);
  }
  
  return {
    stateTax,
    sdi,
    total: stateTax + sdi
  };
}

const safeNumber = (value, defaultValue = 0) => {
  const num = parseFloat(value);
  return isNaN(num) ? defaultValue : num;
};

export function calculatePaystub(employeeInfo, timeWorked, payPeriod) {
  const safeEmployeeInfo = {
    ...employeeInfo,
    hourlyRate: safeNumber(employeeInfo.hourlyRate, 25.00),
    ytdGross: safeNumber(employeeInfo.ytdGross, 0)
  };
  
  const customDeductions = employeeInfo.deductions || {};
  const safeHealthInsurance = safeNumber(customDeductions.healthInsurance, 0);
  const safe401kPercent = safeNumber(customDeductions.retirement401k, 0);
  const safeParkingFee = safeNumber(customDeductions.parkingFee, 0);
  
  const { 
    hourlyRate = 25.00,
    name = 'John Doe', 
    employeeId = '200000', 
    address = '1234 Main Street\nSanta Monica, CA 90401',
    filingStatus = 'single',
    stateCode = 'DEFAULT',
    payFrequency = 'biweekly',
    ytdGross = 0,
    // Pre-tax deductions (reduce taxable income) - include user inputs
    preTaxDeductions = {
      health: safeHealthInsurance,      // User's health insurance premium
      dental: 0,                        // Section 125 dental
      retirement401k: 0,                // Will be calculated from percentage
      hsa: 0                           // Health Savings Account
    },
    // Post-tax deductions (after taxes) - include user inputs
    postTaxDeductions = {
      parking: safeParkingFee,         // User's parking fee
      lifeInsurance: 0,
      garnishment: 0
    }
  } = safeEmployeeInfo;
  
  const { clockIn, clockOut } = timeWorked;
  const periodsPerYear = PAY_FREQUENCIES[payFrequency] || 26;
  
  // Calculate hours and gross pay
  const hoursWorked = calculateHoursWorked(clockIn, clockOut);
  const grossPayInfo = calculateGrossPay(hoursWorked, hourlyRate);
  const grossWages = grossPayInfo.grossPay;
  
  // Calculate 401(k) contribution from percentage
  const calculated401k = (safe401kPercent / 100) * grossWages;
  preTaxDeductions.retirement401k = calculated401k;
  
  // Calculate total pre-tax and post-tax deductions
  const totalPreTax = Object.values(preTaxDeductions).reduce((sum, amount) => sum + amount, 0);
  const totalPostTax = Object.values(postTaxDeductions).reduce((sum, amount) => sum + amount, 0);
  
  // Calculate taxable wages (gross - pre-tax deductions)
  const section125Total = (preTaxDeductions.health || 0) + (preTaxDeductions.dental || 0) + (preTaxDeductions.hsa || 0);
  
  // Taxable wages for Federal Income Tax (reduced by all pre-tax)
  const fitTaxableWages = grossWages - totalPreTax;
  
  // Taxable wages for FICA (reduced by Section 125, but NOT 401k)
  const ficaTaxableWages = grossWages - section125Total;
  
  // Taxable wages for State Income Tax (typically same as FIT)
  const sitTaxableWages = grossWages - totalPreTax;
  
  // Calculate taxes using accurate methods
  const federalTax = calculateFederalTax(fitTaxableWages, filingStatus, periodsPerYear, ytdGross);
  const stateInfo = calculateStateTax(sitTaxableWages, stateCode);
  const fica = calculateFICA(ficaTaxableWages, ytdGross);
  
  // Calculate total taxes and deductions
  const totalTaxes = federalTax + stateInfo.total;
  const totalFicaAndTaxes = federalTax + stateInfo.total + fica.total;
  const totalAllDeductions = totalFicaAndTaxes + totalPreTax + totalPostTax;
  
  // Calculate net pay
  const netPay = grossWages - totalAllDeductions;
  
  // Year-to-date calculations (simplified estimation)
  const currentPeriodNumber = ytdGross > 0 ? Math.floor(ytdGross / grossWages) + 1 : 1;
  
  const ytdFederalTax = federalTax * currentPeriodNumber;
  const ytdStateTax = stateInfo.total * currentPeriodNumber;
  const ytdNetPay = netPay * currentPeriodNumber;
  
  return {
    employee: {
      name,
      employeeId,
      address,
      filingStatus,
      stateCode
    },
    payPeriod,
    payInfo: {
      frequency: payFrequency,
      periodsPerYear,
      currentPeriod: currentPeriodNumber
    },
    earnings: {
      regular: {
        hours: grossPayInfo.regularHours,
        rate: hourlyRate,
        amount: grossPayInfo.regularPay
      },
      overtime: {
        hours: grossPayInfo.overtimeHours,
        rate: hourlyRate * 1.5,
        amount: grossPayInfo.overtimePay
      },
      doubleTime: {
        hours: 0,
        rate: hourlyRate * 2.0,
        amount: 0
      },
      gross: grossWages,
      nonTaxable: 0 // Reimbursements, per diem, etc.
    },
    deductions: {
      preTax: {
        items: preTaxDeductions,
        total: totalPreTax
      },
      postTax: {
        items: postTaxDeductions,
        total: totalPostTax
      },
      taxes: {
        federalIncomeTax: {
          taxableWages: fitTaxableWages,
          current: federalTax,
          ytd: ytdFederalTax
        },
        stateIncomeTax: {
          taxableWages: sitTaxableWages,
          current: stateInfo.stateTax,
          ytd: ytdStateTax
        },
        sdi: {
          current: stateInfo.sdi || 0,
          ytd: (stateInfo.sdi || 0) * currentPeriodNumber
        },
        socialSecurity: {
          taxableWages: ficaTaxableWages,
          current: fica.socialSecurity,
          ytd: fica.socialSecurity * currentPeriodNumber,
          wageBase: FICA_2024.socialSecurity.wageBase,
          maxTax: FICA_2024.socialSecurity.maxTax
        },
        medicare: {
          taxableWages: ficaTaxableWages,
          current: fica.medicare,
          ytd: fica.medicare * currentPeriodNumber
        },
        additionalMedicare: {
          taxableWages: ficaTaxableWages,
          current: fica.additionalMedicare,
          ytd: fica.additionalMedicare * currentPeriodNumber,
          threshold: FICA_2024.medicare.additionalThreshold
        }
      },
      // Legacy format for UI compatibility
      federalTax: {
        current: federalTax,
        ytd: ytdFederalTax
      },
      stateTax: {
        current: stateInfo.total,
        ytd: ytdStateTax
      },
      socialSecurity: {
        current: fica.socialSecurity,
        ytd: fica.socialSecurity * currentPeriodNumber
      },
      medicare: {
        current: fica.medicare + fica.additionalMedicare,
        ytd: (fica.medicare + fica.additionalMedicare) * currentPeriodNumber
      },
      total: {
        current: totalAllDeductions,
        ytd: totalAllDeductions * currentPeriodNumber
      }
    },
    netPay: {
      current: netPay,
      ytd: ytdNetPay
    },
    ytd: {
      gross: ytdGross > 0 ? ytdGross + grossWages : grossWages * currentPeriodNumber,
      deductions: totalAllDeductions * currentPeriodNumber,
      net: ytdNetPay
    },
    // Summary for UI charts and percentages
    summary: {
      grossWages,
      totalTaxes,
      totalBenefitDeductions: totalPreTax + totalPostTax,
      netPay,
      taxPercentage: Math.round((totalTaxes / grossWages) * 100),
      benefitPercentage: Math.round(((totalPreTax + totalPostTax) / grossWages) * 100),
      netPercentage: Math.round((netPay / grossWages) * 100)
    }
  };
}
