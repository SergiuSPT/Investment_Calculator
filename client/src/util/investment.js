// This function expects a JS object as an argument
// The object should contain the following properties
// - initialInvestment: The initial investment amount
// - annualInvestment: The amount invested every year
// - expectedReturn: The expected (annual) rate of return
// - duration: The investment duration (time frame)
export function calculateInvestmentResults({
  initialInvestment,
  annualInvestment,
  expectedReturn,
  duration,
}) {
  const annualData = [];
  let investmentValue = initialInvestment;

  for (let i = 0; i < duration; i++) {
    const interestEarnedInYear = investmentValue * (expectedReturn / 100);
    investmentValue += interestEarnedInYear + annualInvestment;
    annualData.push({
      year: i + 1, // year identifier
      interest: interestEarnedInYear, // the amount of interest earned in this year
      valueEndOfYear: investmentValue, // investment value at end of year
      annualInvestment: annualInvestment, // investment added in this year
    });
  }

  return annualData;
}

export function twelveDataExtract(data) {
  const values = data.values;
  const lastYearValue = parseFloat(values[values.length -1 ].open);
  const thisYearValue = parseFloat(values[0].close);
  return [lastYearValue, thisYearValue];
}

export function eodhdDataExtract(data) {
  const thisYearValue = parseFloat(data[data.length -1 ].close);
  const lastYearValue = parseFloat(data[0].open);
  return [lastYearValue, thisYearValue];
}

export function calculateAnnualReturn(lastYearValue, thisYearValue) {
  const annualReturn = ((thisYearValue - lastYearValue) / lastYearValue) * 100;
  return Math.floor(annualReturn);
}

// The browser-provided Intl API is used to prepare a formatter object
// This object offers a "format()" method that can be used to format numbers as currency
// Example Usage: formatter.format(1000) => yields "$1,000"
export const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});
