export interface ClientProfile {
  client1Name: string;
  client1Dob: string;
  client1SsnLastFour: string;
  client2Name: string;
  client2Dob: string;
  client2SsnLastFour: string;
  reportDate: string;
}

export interface SacsData {
  monthlyInflow: number;
  monthlyOutflow: number;
  bufferFloor: number;
  privateReserveBalance: number;
  schwabBrokerageBalance: number;
  insuranceDeductibles: number;
  inflowAccount: SacsAccount;
  outflowAccount: SacsAccount;
  privateReserveAccount: SacsAccount;
  budgetWorksheet: BudgetLineItem[];
}

export interface SacsAccount {
  id: string;
  label: string;
  institutionName: string;
  lastFour: string;
  currency: string;
  localBalance: number;
  usdValue: number;
}

export interface BudgetLineItem {
  id: string;
  category: string;
  monthlyAmount: number;
  amountToTransfer: number;
}

export interface InvestmentAccount {
  id: string;
  accountType: string;
  lastFour: string;
  balance: number;
  cashBalance: number;
  asOfDate: string;
}

export interface NonRetirementAccount {
  id: string;
  accountType: string;
  institutionName: string;
  lastFour: string;
  balance: number;
  asOfDate: string;
}

export interface TrustData {
  trustName: string;
  propertyAddress: string;
  estimatedHomeValue: number;
  asOfDate: string;
}

export interface Liability {
  id: string;
  liabilityType: string;
  lenderName: string;
  interestRate: number;
  balance: number;
  asOfDate: string;
}

export interface ReportData {
  id: string;
  householdName: string;
  profile: ClientProfile;
  sacs: SacsData;
  client1RetirementAccounts: InvestmentAccount[];
  client2RetirementAccounts: InvestmentAccount[];
  nonRetirementAccounts: NonRetirementAccount[];
  trust: TrustData;
  liabilities: Liability[];
}

export interface ReportTotals {
  monthlyExcessTransfer: number;
  privateReserveTarget: number;
  privateReserveGap: number;
  client1RetirementTotal: number;
  client2RetirementTotal: number;
  nonRetirementTotal: number;
  trustTotal: number;
  grandTotalNetWorth: number;
  liabilitiesTotal: number;
}
