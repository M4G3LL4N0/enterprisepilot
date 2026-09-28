import {
  BASE_PROCUREMENT_ITEMS,
  MODEL_VERSION,
  RISK_LIBRARY,
  STAKEHOLDER_CONCERN_LIBRARY,
} from "./enterprisepilot-data";
import type {
  PilotDuration,
  PilotInput,
  PilotPackageResult,
  ProcurementItem,
  RiskConcern,
  RoiProjection,
  SecurityPosture,
  StakeholderConcern,
  TimelineMilestone,
} from "./types";

const DURATION_WEEKS: Record<PilotDuration, number> = {
  "2 weeks": 2,
  "4 weeks": 4,
  "8 weeks": 8,
  "12 weeks": 12,
};

const SECURITY_WEIGHT: Record<SecurityPosture, number> = {
  basic: 8,
  moderate: 16,
  advanced: 24,
  enterprise: 32,
};

const DATA_EXPOSURE_WEIGHT = {
  "No production data": 0,
  "Synthetic / anonymized": 6,
  "Limited production subset": 14,
  "Full production access": 22,
} as const;

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function estimateProcurementComplexity(input: PilotInput): PilotPackageResult["procurementComplexity"] {
  const exposure = DATA_EXPOSURE_WEIGHT[input.dataExposure];
  const securityGap =
    input.securityPosture === "basic" ? 18 : input.securityPosture === "moderate" ? 10 : input.securityPosture === "advanced" ? 4 : 0;
  const stakeholderLoad = input.stakeholders.length * 3;
  const durationLoad = DURATION_WEEKS[input.pilotDuration] >= 8 ? 6 : 0;
  const score = exposure + securityGap + stakeholderLoad + durationLoad;

  if (score >= 42) return "critical";
  if (score >= 30) return "high";
  if (score >= 18) return "moderate";
  return "low";
}

function scoreEnterpriseReadiness(input: PilotInput): number {
  const security = SECURITY_WEIGHT[input.securityPosture];
  const exposurePenalty = DATA_EXPOSURE_WEIGHT[input.dataExposure] * 0.55;
  const stakeholderBonus = Math.min(18, input.stakeholders.length * 2.5);
  const durationBonus = DURATION_WEEKS[input.pilotDuration] >= 8 ? 8 : 4;
  const useCaseBonus =
    input.useCase === "Compliance acceleration" || input.useCase === "Legacy integration" ? 6 : 4;

  return clamp(Math.round(48 + security * 0.9 + stakeholderBonus + durationBonus + useCaseBonus - exposurePenalty), 34, 97);
}

function estimateApprovalProbability(readiness: number, complexity: PilotPackageResult["procurementComplexity"]) {
  const complexityPenalty = { low: 4, moderate: 10, high: 18, critical: 28 }[complexity];
  return clamp(Math.round(readiness * 0.82 - complexityPenalty + 8), 18, 92);
}

function buildPilotProposal(input: PilotInput): string[] {
  const weeks = DURATION_WEEKS[input.pilotDuration];
  return [
    `Week 0: Align ${input.buyerType}, procurement, and security on scope, data boundaries, and success metrics for ${input.startupProduct}.`,
    `Weeks 1-${Math.max(1, Math.floor(weeks * 0.25))}: Stand up the pilot environment for ${input.useCase.toLowerCase()} with named owners on both sides.`,
    `Weeks ${Math.max(2, Math.floor(weeks * 0.25) + 1)}-${Math.max(3, Math.floor(weeks * 0.7))}: Run the business workflow with ${input.stakeholders.length} stakeholder workstreams and weekly risk reviews.`,
    `Final ${Math.max(1, weeks - Math.floor(weeks * 0.7))} weeks: Publish ROI evidence, procurement path, and executive go/no-go recommendation.`,
  ];
}

function buildRoiSummary(input: PilotInput): RoiProjection {
  const weeks = DURATION_WEEKS[input.pilotDuration];
  const weeklySavings = input.roiAssumptions.hoursSavedPerWeek * input.roiAssumptions.hourlyCost;
  const annualizedSavings = Math.round(weeklySavings * 52 * (1 + input.roiAssumptions.errorReductionPercent / 100));
  const pilotCostEstimate = Math.max(12000, Math.round(input.roiAssumptions.contractValue * (weeks / 52) * 0.35));
  const netFirstYearValue = annualizedSavings - pilotCostEstimate;
  const paybackMonths = weeklySavings > 0 ? clamp(Math.round((pilotCostEstimate / (weeklySavings * 4.33)) * 10) / 10, 1.5, 18) : 12;

  return {
    annualizedSavings,
    paybackMonths,
    pilotCostEstimate,
    netFirstYearValue,
    summary: `A ${input.pilotDuration} pilot for ${input.useCase.toLowerCase()} can capture roughly $${annualizedSavings.toLocaleString()} in annualized value if ${input.buyerType} signs off on the operating assumptions below.`,
    assumptions: [
      `${input.roiAssumptions.hoursSavedPerWeek} hours saved per week at $${input.roiAssumptions.hourlyCost}/hour loaded cost.`,
      `${input.roiAssumptions.errorReductionPercent}% reduction in rework or exception handling tied to ${input.useCase.toLowerCase()}.`,
      `Pilot commercial envelope anchored around $${input.roiAssumptions.contractValue.toLocaleString()} annual contract value.`,
    ],
  };
}

function buildProcurementChecklist(input: PilotInput, complexity: PilotPackageResult["procurementComplexity"]): ProcurementItem[] {
  const requiredIds = new Set<string>(["intake", "business-case", "soc", "msa", "pricing", "exec"]);
  if (input.dataExposure !== "No production data") requiredIds.add("data-map");
  if (input.stakeholders.includes("Legal")) requiredIds.add("dpa");
  if (complexity === "high" || complexity === "critical") {
    requiredIds.add("budget");
    requiredIds.add("dpa");
  }

  return BASE_PROCUREMENT_ITEMS.map((item) => ({
    ...item,
    required: requiredIds.has(item.id),
    completed: input.securityPosture === "enterprise" && (item.id === "soc" || item.id === "data-map"),
  }));
}

function buildStakeholderMap(input: PilotInput): StakeholderConcern[] {
  const roles = input.stakeholders.length > 0 ? input.stakeholders : (["Business champion", "Procurement", "Security"] as const);
  return roles.map((role, index) => {
    const entry = STAKEHOLDER_CONCERN_LIBRARY[role];
    return {
      role,
      priority: index === 0 ? "high" : index < 3 ? "medium" : "low",
      concern: entry.concern,
      mitigation: entry.mitigation,
    };
  });
}

function buildRiskConcerns(input: PilotInput): RiskConcern[] {
  const severityBoost =
    input.dataExposure === "Full production access" || input.securityPosture === "basic" ? 1 : 0;

  return RISK_LIBRARY.map((risk, index) => ({
    ...risk,
    severity: (index + severityBoost >= 3 ? "high" : index + severityBoost === 2 ? "medium" : "low") as RiskConcern["severity"],
    concern:
      risk.id === "data-exposure"
        ? `${risk.concern} Current posture: ${input.dataExposure.toLowerCase()}.`
        : risk.concern,
    mitigation:
      risk.id === "procurement"
        ? `${risk.mitigation} Target buyer path: ${input.buyerType}.`
        : risk.mitigation,
  }));
}

function buildTimeline(weeks: number, kind: "approval" | "pilot", input: PilotInput): TimelineMilestone[] {
  const labels =
    kind === "approval"
      ? [
          "Procurement intake opened",
          "Security review complete",
          "Legal redlines resolved",
          "Commercial terms approved",
          "Executive sign-off",
        ]
      : [
          "Pilot kickoff and success metrics locked",
          "Environment and integrations ready",
          "Business workflow in production use",
          "ROI evidence collected",
          "Go / no-go decision",
        ];

  const step = Math.max(1, Math.floor(weeks / labels.length));
  return labels.map((label, index) => ({
    week: index === 0 ? 0 : step * index,
    label,
    owner: index === labels.length - 1 ? input.buyerType : input.stakeholders[index % Math.max(1, input.stakeholders.length)] ?? "Procurement",
    status: index === 0 ? "active" : "upcoming",
  }));
}

function buildBuyerSummary(input: PilotInput, readiness: number, complexity: PilotPackageResult["procurementComplexity"]) {
  return [
    `${input.startupProduct} is positioned as a ${input.startupCategory.toLowerCase()} pilot for ${input.useCase.toLowerCase()}.`,
    `${input.buyerType} should expect a ${input.pilotDuration} evaluation with ${input.securityPosture} security posture and ${input.dataExposure.toLowerCase()}.`,
    `Enterprise readiness is ${readiness}/100 with ${complexity} procurement complexity across ${input.stakeholders.length || 3} stakeholder workstreams.`,
    "The package includes proposal structure, ROI framing, procurement checklist, risk mitigations, and an approval timeline sized for enterprise evaluation.",
  ].join(" ");
}

export function generatePilotPackage(input: PilotInput): PilotPackageResult {
  const procurementComplexity = estimateProcurementComplexity(input);
  const enterpriseReadinessScore = scoreEnterpriseReadiness(input);
  const approvalProbability = estimateApprovalProbability(enterpriseReadinessScore, procurementComplexity);
  const weeks = DURATION_WEEKS[input.pilotDuration];

  return {
    enterpriseReadinessScore,
    approvalProbability,
    procurementComplexity,
    pilotProposal: buildPilotProposal(input),
    roiCase: buildRoiSummary(input),
    procurementChecklist: buildProcurementChecklist(input, procurementComplexity),
    buyerSummary: buildBuyerSummary(input, enterpriseReadinessScore, procurementComplexity),
    riskConcerns: buildRiskConcerns(input),
    stakeholderMap: buildStakeholderMap(input),
    approvalTimeline: buildTimeline(Math.max(4, Math.round(weeks * 0.75)), "approval", input),
    pilotTimeline: buildTimeline(weeks, "pilot", input),
    modelVersion: MODEL_VERSION,
  };
}

export function generatePilot(input: PilotInput): PilotPackageResult {
  return generatePilotPackage(input);
}
