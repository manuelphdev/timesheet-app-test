// US Payroll Calculations - 2024 Tax Year
// This includes federal taxes, FICA, and common deductions

export const TAX_BRACKETS_2024 = [
  { min: 0, max: 11000, rate: 0.10 },
  { min: 11000, max: 44725, rate: 0.12 },
  { min: 44725, max: 95375, rate: 0.22 },
  { min: 95375, max: 182050, rate: 0.24 },
  { min: 182050, max: 231250, rate: 0.32 },
  { min: 231250, max: 578125, rate: 0.35 },
  { min: 578125, max: Infinity, rate: 0.37 }
];

export const FICA_RATES = {
  socialSecurity: 0.062, // 6.2%
  medicare: 0.0145, // 1.45%
  additionalMedicare: 0.009 // 0.9% on income over $200,000
};

export const STATE_TAX_RATE = 0.05; // 5% default state tax
export const STANDARD_DEDUCTION = 13850; // 2024 standard deduction (single)

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

export function calculateFederalTax(grossPay) {
  let tax = 0;
  let remainingIncome = grossPay;
  
  for (const bracket of TAX_BRACKETS_2024) {
    if (remainingIncome <= 0) break;
    
    const taxableInThisBracket = Math.min(
      remainingIncome,
      bracket.max - bracket.min
    );
    
    tax += taxableInThisBracket * bracket.rate;
    remainingIncome -= taxableInThisBracket;
  }
  
  return tax;
}

export function calculateFICA(grossPay) {
  const socialSecurity = Math.min(grossPay * FICA_RATES.socialSecurity, 9932.40); // 2024 SS wage base limit
  const medicare = grossPay * FICA_RATES.medicare;
  const additionalMedicare = grossPay > 200000 ? (grossPay - 200000) * FICA_RATES.additionalMedicare : 0;
  
  return {
    socialSecurity,
    medicare,
    additionalMedicare,
    total: socialSecurity + medicare + additionalMedicare
  };
}

export function calculateStateTax(grossPay) {
  return grossPay * STATE_TAX_RATE;
}

export function calculatePaystub(employeeInfo, timeWorked, payPeriod) {
  const { hourlyRate = 25.00, name = 'John Doe', employeeId = '200000', address = '1234 Main Street\nSanta Monica, CA 90401' } = employeeInfo;
  const { clockIn, clockOut } = timeWorked;
  
  // Calculate hours and gross pay
  const hoursWorked = calculateHoursWorked(clockIn, clockOut);
  const grossPayInfo = calculateGrossPay(hoursWorked, hourlyRate);
  
  // Calculate deductions
  const federalTax = calculateFederalTax(grossPayInfo.grossPay);
  const stateTax = calculateStateTax(grossPayInfo.grossPay);
  const fica = calculateFICA(grossPayInfo.grossPay);
  
  // Calculate net pay
  const totalDeductions = federalTax + stateTax + fica.total;
  const netPay = grossPayInfo.grossPay - totalDeductions;
  
  // Year-to-date calculations (simplified - in real app would come from database)
  const ytdMultiplier = 26; // Assume bi-weekly pay, 26 pay periods per year
  const ytdGross = grossPayInfo.grossPay * ytdMultiplier;
  const ytdFederalTax = federalTax * ytdMultiplier;
  const ytdStateTax = stateTax * ytdMultiplier;
  const ytdNetPay = netPay * ytdMultiplier;
  
  // Additional deduction categories
  const preTaxDeductions = 0; // Health insurance, 401k, etc.
  const postTaxDeductions = 0; // Parking, union dues, etc.
  
  return {
    employee: {
      name,
      employeeId,
      address
    },
    payPeriod,
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
      gross: grossPayInfo.grossPay
    },
    deductions: {
      preTax: preTaxDeductions,
      postTax: postTaxDeductions,
      federalTax: {
        current: federalTax,
        ytd: ytdFederalTax
      },
      stateTax: {
        current: stateTax,
        ytd: ytdStateTax
      },
      socialSecurity: {
        current: fica.socialSecurity,
        ytd: fica.socialSecurity * ytdMultiplier
      },
      medicare: {
        current: fica.medicare + fica.additionalMedicare,
        ytd: (fica.medicare + fica.additionalMedicare) * ytdMultiplier
      },
      total: {
        current: totalDeductions,
        ytd: totalDeductions * ytdMultiplier
      }
    },
    netPay: {
      current: netPay,
      ytd: ytdNetPay
    },
    ytd: {
      gross: ytdGross,
      deductions: totalDeductions * ytdMultiplier,
      net: ytdNetPay
    }
  };
}
