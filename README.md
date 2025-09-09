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
- **PDF Export**: Download payslips as PDF documents for printing and record-keeping
- **Visual Analytics**: Interactive pie chart showing tax, deduction, and take-home percentages

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
6. Use the "Download PDF" button to save the payslip as a PDF file
7. View interactive tax breakdown with expandable sections
8. Toggle between "Current" and "Year-To-Date" views for comprehensive payroll data

## Built With

- React 18
- Modern CSS with responsive design
- US payroll tax calculations for 2024
- Browser-based PDF generation for payslip exports

## Key Features

### Payroll Calculations
- **Federal Tax**: 2024 tax brackets with standard deduction
- **State Tax**: Configurable rates by state
- **FICA Taxes**: Social Security (6.2%) and Medicare (1.45%) with wage base limits
- **Pre-tax Deductions**: Health insurance & 401(k)
- **Post-tax Deductions**: Parking fees

### User Interface
- **Interactive Charts**: Visual breakdown of taxes, deductions, and take-home pay
- **Accordion Layout**: Expandable sections for detailed tax information
- **Dual Views**: Current pay period and year-to-date summaries
- **PDF Export**: Print-ready payslip generation using browser print functionality

## PDF Export

The application includes a "Download PDF" button that uses the browser's built-in print functionality to generate PDF versions of payslips.
