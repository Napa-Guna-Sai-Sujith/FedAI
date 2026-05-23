import { DiseaseModel, HospitalNode, TrainingLog, PrivacyMetric, PatientRiskInput } from '../types';

export const initialModels: DiseaseModel[] = [
  {
    id: 'cvd',
    name: 'Cardiovascular Disease Risk Prediction',
    codeName: 'CVD-Net v4.2',
    description: 'Predicts 10-year risk of major adverse cardiovascular events (MACE) using federated deep neural networks trained across diverse clinical demographics.',
    clinicalFocus: 'Cardiology, Preventive Medicine',
    globalAccuracy: 89.4,
    totalRounds: 142,
    activeNodesCount: 6,
    totalPatientRecords: 482500,
    inputFeatures: ['Age', 'Gender', 'BMI', 'Systolic BP', 'Diastolic BP', 'Total Cholesterol', 'Blood Glucose', 'Smoking Status', 'Family History', 'Physical Activity'],
    privacyEpsilon: 1.24,
    lastUpdated: '12 mins ago',
    architecture: '4-Layer MLP with BatchNorm & LeakyReLU (128->64->32->1)',
    weightsHash: '0x8f3c...9a12'
  },
  {
    id: 'diabetes',
    name: 'Type 2 Diabetes Progression AI',
    codeName: 'DiaFed-AI v3.0',
    description: 'Early detection and 5-year progression forecasting for Type 2 Diabetes mellitus, incorporating longitudinal glycemic trends and lifestyle factors.',
    clinicalFocus: 'Endocrinology, Metabolic Health',
    globalAccuracy: 91.2,
    totalRounds: 98,
    activeNodesCount: 5,
    totalPatientRecords: 315000,
    inputFeatures: ['Age', 'BMI', 'Blood Glucose', 'HbA1c (Estimated)', 'Systolic BP', 'Family History', 'Physical Activity'],
    privacyEpsilon: 0.85,
    lastUpdated: '1 hour ago',
    architecture: 'ResNet-style Tabular FNN with Skip Connections (64->64->32->1)',
    weightsHash: '0x4b1a...7c8f'
  },
  {
    id: 'ckd',
    name: 'Chronic Kidney Disease Stratification',
    codeName: 'RenalGuard FNN',
    description: 'Identifies patients at risk of rapid eGFR decline and end-stage renal disease (ESRD) without pooling sensitive renal biopsy or lab records.',
    clinicalFocus: 'Nephrology',
    globalAccuracy: 87.8,
    totalRounds: 65,
    activeNodesCount: 4,
    totalPatientRecords: 198000,
    inputFeatures: ['Age', 'Blood Pressure', 'Blood Glucose', 'Serum Creatinine', 'BMI', 'Smoking Status'],
    privacyEpsilon: 1.50,
    lastUpdated: '3 hours ago',
    architecture: 'Gradient-Boosted Decision Trees (Federated SecureXGB) / MLP Hybrid',
    weightsHash: '0x1c9d...3e4a'
  },
  {
    id: 'copd',
    name: 'COPD & Respiratory Exacerbation Risk',
    codeName: 'PneumoFed v2.1',
    description: 'Predicts acute respiratory exacerbations in COPD patients utilizing multi-center spirometry metrics and environmental risk factors.',
    clinicalFocus: 'Pulmonology',
    globalAccuracy: 85.6,
    totalRounds: 45,
    activeNodesCount: 4,
    totalPatientRecords: 124000,
    inputFeatures: ['Age', 'Smoking Status', 'FEV1 % Predicted', 'BMI', 'Physical Activity'],
    privacyEpsilon: 1.10,
    lastUpdated: '5 hours ago',
    architecture: '3-Layer Feedforward Neural Network with Dropout (0.3)',
    weightsHash: '0x7e2b...5f0c'
  },
  {
    id: 'oncology',
    name: 'Oncology Recurrence Risk (Breast/Colon)',
    codeName: 'OncoFed-Pro',
    description: 'Evaluates 3-year post-treatment solid tumor recurrence probability based on multi-omic biomarker panels and clinical history under strict differential privacy.',
    clinicalFocus: 'Oncology',
    globalAccuracy: 88.1,
    totalRounds: 110,
    activeNodesCount: 5,
    totalPatientRecords: 245000,
    inputFeatures: ['Age', 'Tumor Grade (Proxy)', 'Lymph Node Status (Proxy)', 'Biomarker Index', 'BMI', 'Family History'],
    privacyEpsilon: 0.65, // strict privacy
    lastUpdated: '1 day ago',
    architecture: 'DenseNet Tabular Architecture with Differential Privacy SGD',
    weightsHash: '0x9a4f...2d1b'
  }
];

export const initialNodes: HospitalNode[] = [
  {
    id: 'node-1',
    name: 'Metro General Hospital',
    location: 'New York, USA',
    type: 'general',
    patientCount: 145000,
    localAccuracy: 89.1,
    contributionWeight: 30,
    status: 'online',
    computePower: 'NVIDIA DGX A100 (Cluster)',
    privacyNoiseLevel: 1.2,
    lastSync: '2 mins ago',
    latencyMs: 24,
    dataDistribution: [
      { label: 'Cardiovascular', percentage: 40 },
      { label: 'Diabetes', percentage: 30 },
      { label: 'Renal/Other', percentage: 30 }
    ]
  },
  {
    id: 'node-2',
    name: 'St. Jude Medical Center',
    location: 'Chicago, USA',
    type: 'academic',
    patientCount: 120000,
    localAccuracy: 90.4,
    contributionWeight: 25,
    status: 'training',
    computePower: 'HPC Cloud Bio-Cluster',
    privacyNoiseLevel: 0.8, // High privacy
    lastSync: 'Just now',
    latencyMs: 18,
    dataDistribution: [
      { label: 'Oncology', percentage: 45 },
      { label: 'Cardiovascular', percentage: 35 },
      { label: 'Pulmonary', percentage: 20 }
    ]
  },
  {
    id: 'node-3',
    name: 'Apex Health Research Labs',
    location: 'Boston, USA',
    type: 'specialized',
    patientCount: 85000,
    localAccuracy: 88.7,
    contributionWeight: 18,
    status: 'online',
    computePower: 'AWS EC2 P4d Instances',
    privacyNoiseLevel: 1.5,
    lastSync: '5 mins ago',
    latencyMs: 35,
    dataDistribution: [
      { label: 'Diabetes', percentage: 50 },
      { label: 'Renal', percentage: 35 },
      { label: 'Other', percentage: 15 }
    ]
  },
  {
    id: 'node-4',
    name: 'Community Care Clinics Consortium',
    location: 'Austin, USA',
    type: 'community',
    patientCount: 95000,
    localAccuracy: 87.2,
    contributionWeight: 20,
    status: 'aggregating',
    computePower: 'Local Edge Server Farm',
    privacyNoiseLevel: 1.0,
    lastSync: '1 min ago',
    latencyMs: 42,
    dataDistribution: [
      { label: 'Cardiovascular', percentage: 55 },
      { label: 'Diabetes', percentage: 25 },
      { label: 'Pulmonary', percentage: 20 }
    ]
  },
  {
    id: 'node-5',
    name: 'Global Wearable IoT Health Aggregator',
    location: 'San Francisco, USA',
    type: 'wearable_aggregator',
    patientCount: 37500,
    localAccuracy: 85.9,
    contributionWeight: 7,
    status: 'online',
    computePower: 'Distributed Edge Enclaves',
    privacyNoiseLevel: 2.0, // More noise due to IoT nature
    lastSync: '12 mins ago',
    latencyMs: 65,
    dataDistribution: [
      { label: 'Cardiovascular', percentage: 70 },
      { label: 'Pulmonary', percentage: 20 },
      { label: 'Other', percentage: 10 }
    ]
  }
];

export const initialTrainingLogs: TrainingLog[] = [
  {
    id: 'log-142',
    round: 142,
    timestamp: '12 mins ago',
    modelId: 'cvd',
    modelName: 'Cardiovascular Disease Risk Prediction',
    participatingNodes: ['Metro General Hospital', 'St. Jude Medical Center', 'Apex Health Research Labs', 'Community Care Clinics Consortium'],
    globalLossBefore: 0.284,
    globalLossAfter: 0.262,
    globalAccuracyBefore: 88.9,
    globalAccuracyAfter: 89.4,
    aggregationMethod: 'FedAvg',
    privacyBudgetUsed: 0.042,
    timeTakenMs: 3450,
    status: 'completed'
  },
  {
    id: 'log-141',
    round: 141,
    timestamp: '1 hour ago',
    modelId: 'diabetes',
    modelName: 'Type 2 Diabetes Progression AI',
    participatingNodes: ['Metro General Hospital', 'Apex Health Research Labs', 'Community Care Clinics Consortium'],
    globalLossBefore: 0.245,
    globalLossAfter: 0.231,
    globalAccuracyBefore: 90.8,
    globalAccuracyAfter: 91.2,
    aggregationMethod: 'FedProx',
    privacyBudgetUsed: 0.035,
    timeTakenMs: 2980,
    status: 'completed'
  },
  {
    id: 'log-140',
    round: 140,
    timestamp: '3 hours ago',
    modelId: 'ckd',
    modelName: 'Chronic Kidney Disease Stratification',
    participatingNodes: ['Metro General Hospital', 'Apex Health Research Labs', 'St. Jude Medical Center'],
    globalLossBefore: 0.312,
    globalLossAfter: 0.295,
    globalAccuracyBefore: 87.1,
    globalAccuracyAfter: 87.8,
    aggregationMethod: 'FedAvg',
    privacyBudgetUsed: 0.051,
    timeTakenMs: 4120,
    status: 'completed'
  },
  {
    id: 'log-139',
    round: 139,
    timestamp: '5 hours ago',
    modelId: 'copd',
    modelName: 'COPD & Respiratory Exacerbation Risk',
    participatingNodes: ['St. Jude Medical Center', 'Community Care Clinics Consortium', 'Global Wearable IoT Health Aggregator'],
    globalLossBefore: 0.368,
    globalLossAfter: 0.354,
    globalAccuracyBefore: 85.0,
    globalAccuracyAfter: 85.6,
    aggregationMethod: 'FedNova',
    privacyBudgetUsed: 0.038,
    timeTakenMs: 3100,
    status: 'completed'
  },
  {
    id: 'log-138',
    round: 138,
    timestamp: '1 day ago',
    modelId: 'oncology',
    modelName: 'Oncology Recurrence Risk (Breast/Colon)',
    participatingNodes: ['Metro General Hospital', 'St. Jude Medical Center', 'Apex Health Research Labs'],
    globalLossBefore: 0.298,
    globalLossAfter: 0.285,
    globalAccuracyBefore: 87.6,
    globalAccuracyAfter: 88.1,
    aggregationMethod: 'FedProx',
    privacyBudgetUsed: 0.025,
    timeTakenMs: 5600,
    status: 'completed'
  }
];

export const initialPrivacyMetrics: PrivacyMetric[] = [
  { round: 10, epsilon: 0.15, delta: 1e-5, miaResistance: 99.8, noiseMultiplier: 1.8 },
  { round: 30, epsilon: 0.32, delta: 1e-5, miaResistance: 98.5, noiseMultiplier: 1.6 },
  { round: 50, epsilon: 0.54, delta: 1e-5, miaResistance: 97.2, noiseMultiplier: 1.4 },
  { round: 70, epsilon: 0.76, delta: 1e-5, miaResistance: 95.9, noiseMultiplier: 1.2 },
  { round: 90, epsilon: 0.95, delta: 1e-5, miaResistance: 94.8, noiseMultiplier: 1.1 },
  { round: 110, epsilon: 1.12, delta: 1e-5, miaResistance: 93.6, noiseMultiplier: 1.0 },
  { round: 130, epsilon: 1.21, delta: 1e-5, miaResistance: 92.4, noiseMultiplier: 0.95 },
  { round: 142, epsilon: 1.24, delta: 1e-5, miaResistance: 91.8, noiseMultiplier: 0.92 },
];

export const samplePatients: { name: string; description: string; data: PatientRiskInput }[] = [
  {
    name: 'Patient A (High CVD Risk)',
    description: '58yo Male, Smoker, Stage 2 Hypertension, High Cholesterol',
    data: {
      age: 58,
      gender: 'male',
      bmi: 31.2,
      bloodPressureSys: 158,
      bloodPressureDia: 96,
      cholesterolTotal: 265,
      bloodGlucose: 125,
      smoker: true,
      familyHistory: true,
      physicalActivity: 'low',
      creatinine: 1.2,
      fev1: 82
    }
  },
  {
    name: 'Patient B (Moderate Diabetes Risk)',
    description: '45yo Female, Overweight, Borderline Fasting Glucose, Sedentary',
    data: {
      age: 45,
      gender: 'female',
      bmi: 28.4,
      bloodPressureSys: 128,
      bloodPressureDia: 82,
      cholesterolTotal: 195,
      bloodGlucose: 118, // Prediabetic
      smoker: false,
      familyHistory: true,
      physicalActivity: 'low',
      creatinine: 0.9,
      fev1: 91
    }
  },
  {
    name: 'Patient C (Healthy Baseline / Low Risk)',
    description: '32yo Male, Active Lifestyle, Normal Vitals',
    data: {
      age: 32,
      gender: 'male',
      bmi: 22.5,
      bloodPressureSys: 115,
      bloodPressureDia: 75,
      cholesterolTotal: 168,
      bloodGlucose: 88,
      smoker: false,
      familyHistory: false,
      physicalActivity: 'high',
      creatinine: 0.8,
      fev1: 98
    }
  },
  {
    name: 'Patient D (COPD / Respiratory Risk)',
    description: '66yo Female, Former Smoker, Reduced FEV1, Mild Hypertension',
    data: {
      age: 66,
      gender: 'female',
      bmi: 24.1,
      bloodPressureSys: 135,
      bloodPressureDia: 85,
      cholesterolTotal: 210,
      bloodGlucose: 95,
      smoker: true,
      familyHistory: false,
      physicalActivity: 'moderate',
      creatinine: 1.0,
      fev1: 64 // Reduced FEV1
    }
  }
];
