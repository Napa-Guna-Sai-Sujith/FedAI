export type DiseaseModelId = 'cvd' | 'diabetes' | 'ckd' | 'copd' | 'oncology';

export interface DiseaseModel {
  id: DiseaseModelId;
  name: string;
  codeName: string;
  description: string;
  clinicalFocus: string;
  globalAccuracy: number;
  totalRounds: number;
  activeNodesCount: number;
  totalPatientRecords: number;
  inputFeatures: string[];
  privacyEpsilon: number;
  lastUpdated: string;
  architecture: string;
  weightsHash: string;
}

export interface HospitalNode {
  id: string;
  name: string;
  location: string;
  type: 'academic' | 'general' | 'specialized' | 'community' | 'wearable_aggregator';
  patientCount: number;
  localAccuracy: number;
  contributionWeight: number; // percentage
  status: 'online' | 'training' | 'aggregating' | 'offline';
  computePower: string;
  privacyNoiseLevel: number; // Epsilon value locally
  lastSync: string;
  latencyMs: number;
  dataDistribution: {
    label: string;
    percentage: number;
  }[];
}

export interface TrainingLog {
  id: string;
  round: number;
  timestamp: string;
  modelId: DiseaseModelId;
  modelName: string;
  participatingNodes: string[];
  globalLossBefore: number;
  globalLossAfter: number;
  globalAccuracyBefore: number;
  globalAccuracyAfter: number;
  aggregationMethod: 'FedAvg' | 'FedProx' | 'FedNova';
  privacyBudgetUsed: number;
  timeTakenMs: number;
  status: 'completed' | 'aggregating' | 'failed';
}

export interface PatientRiskInput {
  age: number;
  gender: 'male' | 'female' | 'other';
  bmi: number;
  bloodPressureSys: number;
  bloodPressureDia: number;
  cholesterolTotal: number;
  bloodGlucose: number;
  smoker: boolean;
  familyHistory: boolean;
  physicalActivity: 'low' | 'moderate' | 'high';
  creatinine?: number;
  fev1?: number; // For COPD
}

export interface RiskPredictionResult {
  riskScore: number; // 0 to 100
  riskLevel: 'Low' | 'Moderate' | 'High' | 'Critical';
  encryptedPayloadHash: string;
  decryptionTimeMs: number;
  confidenceInterval: [number, number];
  contributingFeatures: {
    feature: string;
    impact: number; // positive or negative percentage contribution
    description: string;
  }[];
  recommendations: string[];
}

export interface PrivacyMetric {
  round: number;
  epsilon: number;
  delta: number;
  miaResistance: number; // Membership Inference Attack resistance %
  noiseMultiplier: number;
}
