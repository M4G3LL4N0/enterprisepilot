export const STARTUP_CATEGORIES = [
  "AI / automation",
  "Data infrastructure",
  "Security / compliance",
  "Developer tools",
  "Revenue operations",
  "Customer experience",
] as const;

export const BUYER_TYPES = [
  "CIO / IT",
  "Head of Operations",
  "VP Finance",
  "Procurement",
  "CISO / Security",
  "Line-of-business executive",
] as const;

export const USE_CASES = [
  "Workflow automation",
  "Legacy integration",
  "Cost reduction",
  "Compliance acceleration",
  "Revenue enablement",
  "Incident response",
] as const;

export const PILOT_DURATIONS = ["2 weeks", "4 weeks", "8 weeks", "12 weeks"] as const;

export const SECURITY_POSTURES = ["basic", "moderate", "advanced", "enterprise"] as const;

export const DATA_EXPOSURE_LEVELS = [
  "No production data",
  "Synthetic / anonymized",
  "Limited production subset",
  "Full production access",
] as const;

export const STAKEHOLDER_ROLES = [
  "Executive sponsor",
  "Procurement",
  "Security",
  "Finance",
  "Legal",
  "IT operations",
  "Business champion",
] as const;

export type StartupCategory = (typeof STARTUP_CATEGORIES)[number];
export type BuyerType = (typeof BUYER_TYPES)[number];
export type UseCase = (typeof USE_CASES)[number];
export type PilotDuration = (typeof PILOT_DURATIONS)[number];
export type SecurityPosture = (typeof SECURITY_POSTURES)[number];
export type DataExposure = (typeof DATA_EXPOSURE_LEVELS)[number];
export type StakeholderRole = (typeof STAKEHOLDER_ROLES)[number];

export type RoiAssumptions = {
  hoursSavedPerWeek: number;
  hourlyCost: number;
  errorReductionPercent: number;
  contractValue: number;
};

export type PilotInput = {
  startupCategory: StartupCategory;
  buyerType: BuyerType;
  useCase: UseCase;
  pilotDuration: PilotDuration;
  roiAssumptions: RoiAssumptions;
  securityPosture: SecurityPosture;
  dataExposure: DataExposure;
  stakeholders: StakeholderRole[];
  startupProduct: string;
};

export type ProcurementItem = {
  id: string;
  label: string;
  stage: string;
  required: boolean;
  completed: boolean;
};

export type StakeholderConcern = {
  role: StakeholderRole;
  priority: "high" | "medium" | "low";
  concern: string;
  mitigation: string;
};

export type TimelineMilestone = {
  week: number;
  label: string;
  owner: string;
  status: "upcoming" | "active" | "complete";
};

export type RiskConcern = {
  id: string;
  category: string;
  severity: "high" | "medium" | "low";
  concern: string;
  mitigation: string;
};

export type RoiProjection = {
  annualizedSavings: number;
  paybackMonths: number;
  pilotCostEstimate: number;
  netFirstYearValue: number;
  summary: string;
  assumptions: string[];
};

export type PilotPackageResult = {
  enterpriseReadinessScore: number;
  approvalProbability: number;
  procurementComplexity: "low" | "moderate" | "high" | "critical";
  pilotProposal: string[];
  roiCase: RoiProjection;
  procurementChecklist: ProcurementItem[];
  buyerSummary: string;
  riskConcerns: RiskConcern[];
  stakeholderMap: StakeholderConcern[];
  approvalTimeline: TimelineMilestone[];
  pilotTimeline: TimelineMilestone[];
  modelVersion: string;
};
