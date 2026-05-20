import type {
  InvestmentAccount,
  Liability,
  NonRetirementAccount,
  ReportData,
  ReportTotals,
} from "../types/report";

export const formatCurrency = (value: number): string =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number.isFinite(value) ? value : 0);

export const formatDate = (dateValue: string): string => {
  if (!dateValue) return "Not set";
  const date = new Date(`${dateValue}T00:00:00`);
  if (Number.isNaN(date.getTime())) return "Not set";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

export const calculateAge = (dob: string, referenceDate = new Date()): number => {
  if (!dob) return 0;
  const birthDate = new Date(`${dob}T00:00:00`);
  if (Number.isNaN(birthDate.getTime())) return 0;

  let age = referenceDate.getFullYear() - birthDate.getFullYear();
  const monthDelta = referenceDate.getMonth() - birthDate.getMonth();
  const dayDelta = referenceDate.getDate() - birthDate.getDate();

  if (monthDelta < 0 || (monthDelta === 0 && dayDelta < 0)) {
    age -= 1;
  }

  return Math.max(age, 0);
};

export const sumBalances = (
  accounts: Array<InvestmentAccount | NonRetirementAccount | Liability>,
): number => accounts.reduce((total, account) => total + Number(account.balance || 0), 0);

export const calculateReportTotals = (data: ReportData): ReportTotals => {
  const client1RetirementTotal = sumBalances(data.client1RetirementAccounts);
  const client2RetirementTotal = sumBalances(data.client2RetirementAccounts);
  const nonRetirementTotal = sumBalances(data.nonRetirementAccounts);
  const trustTotal = Number(data.trust.estimatedHomeValue || 0);
  const liabilitiesTotal = sumBalances(data.liabilities);
  const privateReserveTarget =
    Number(data.sacs.monthlyOutflow || 0) * 6 + Number(data.sacs.insuranceDeductibles || 0);

  return {
    monthlyExcessTransfer: Number(data.sacs.monthlyInflow || 0) - Number(data.sacs.monthlyOutflow || 0),
    privateReserveTarget,
    privateReserveGap: privateReserveTarget - Number(data.sacs.privateReserveBalance || 0),
    client1RetirementTotal,
    client2RetirementTotal,
    nonRetirementTotal,
    trustTotal,
    grandTotalNetWorth:
      client1RetirementTotal + client2RetirementTotal + nonRetirementTotal + trustTotal,
    liabilitiesTotal,
  };
};
