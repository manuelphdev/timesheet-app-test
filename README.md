# Timesheet Payslip App

A simple React-based timesheet application that allows employees to select clock-in and clock-out times and generates payslips with US payroll tax calculations.

## Features

- **Time Selection**: Dropdown menus for clock-in/out times (6 AM - 10 PM in 30-minute intervals)
- **Employee Information**: Input fields for employee details and pay period
- **US Payroll Calculations**: 2024 tax calculations including:
  - Federal income tax with standard deductions
  - State income tax (configurable by state)
  - FICA (Social Security and Medicare)
  - Overtime pay calculations
  - Pre-tax and post-tax deductions
- **Professional Payslip**: Clean, modern payslip display matching industry standards
- **Tax Breakdown**: Detailed view of all taxes and deductions

## Getting Started

1. Install dependencies:
   ```
   npm install
   ```

2. Start the development server:
   ```
   npm start
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. Enter employee information (name, ID, pay rate)
2. Select clock-in and clock-out times from dropdowns
3. Choose filing status, state, and pay frequency
4. Enter year-to-date gross earnings for accurate tax calculations
5. Click "Generate Paystub" to view the detailed payslip

## Built With

- React 18
- Modern CSS with responsive design
- US payroll tax calculations for 2024
