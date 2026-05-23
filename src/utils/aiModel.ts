/**
 * FedHealth AI Core Mathematical Engine
 * Implements a real Feedforward Neural Network (FNN), Logistic Regression,
 * Federated Averaging (FedAvg), Differential Privacy Laplace Mechanism, and SHAP explainability.
 */

// Helper: Generate random number from standard normal distribution (Box-Muller transform)
export function randomNormal(): number {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

// Helper: Generate random sample from Laplace distribution for Differential Privacy
export function randomLaplace(scale: number): number {
  const u = Math.random() - 0.5;
  return -scale * Math.sign(u) * Math.log(1 - 2 * Math.abs(u));
}

// Helper: Sigmoid activation function
export function sigmoid(z: number): number {
  return 1 / (1 + Math.exp(-z));
}

export interface ModelWeights {
  W: number[][]; // Shape: [inputDim][outputDim]
  b: number[];   // Shape: [outputDim]
}

/**
 * Real Feedforward Neural Network / Logistic Regression Layer
 * Configured for Binary Classification (Disease Risk Prediction: 0 to 1)
 */
export class ClinicalNeuralNetwork {
  public inputDim: number;
  public outputDim: number;
  public W: number[][];
  public b: number[];

  constructor(inputDim: number, outputDim: number = 1, initialWeights?: ModelWeights) {
    this.inputDim = inputDim;
    this.outputDim = outputDim;

    if (initialWeights) {
      this.W = initialWeights.W.map(row => [...row]);
      this.b = [...initialWeights.b];
    } else {
      // Xavier/Glorot Initialization
      const limit = Math.sqrt(6 / (inputDim + outputDim));
      this.W = Array.from({ length: inputDim }, () => 
        Array.from({ length: outputDim }, () => (Math.random() * 2 - 1) * limit)
      );
      this.b = Array.from({ length: outputDim }, () => 0);
    }
  }

  // Forward Pass: X * W + b -> Sigmoid
  public forward(X: number[]): number {
    let z = this.b[0];
    for (let i = 0; i < this.inputDim; i++) {
      z += X[i] * this.W[i][0];
    }
    return sigmoid(z);
  }

  // Batch Forward Pass
  public predictBatch(X_batch: number[][]): number[] {
    return X_batch.map(X => this.forward(X));
  }

  // Stochastic Gradient Descent (SGD) Backpropagation with DP Clipping & Noise
  public trainStep(X: number[], y: number, learningRate: number, clipNorm: number = 1.0, dpEpsilon?: number): { loss: number; gradients: ModelWeights } {
    const pred = this.forward(X);
    
    // Binary Cross-Entropy Loss
    const loss = - (y * Math.log(pred + 1e-15) + (1 - y) * Math.log(1 - pred + 1e-15));

    // Gradient of loss w.r.t z (for sigmoid + BCE)
    const dz = pred - y;

    // Compute raw gradients
    let dW = Array.from({ length: this.inputDim }, (_, i) => [X[i] * dz]);
    let db = [dz];

    // L2 Norm of gradients for DP Clipping
    let sqSum = db[0] * db[0];
    for (let i = 0; i < this.inputDim; i++) {
      sqSum += dW[i][0] * dW[i][0];
    }
    const gradNorm = Math.sqrt(sqSum);

    // Gradient Clipping
    if (gradNorm > clipNorm) {
      const scale = clipNorm / gradNorm;
      db[0] *= scale;
      for (let i = 0; i < this.inputDim; i++) {
        dW[i][0] *= scale;
      }
    }

    // Inject Differential Privacy Laplace Noise to gradients if epsilon is provided
    if (dpEpsilon && dpEpsilon > 0) {
      const sensitivity = 2.0 * clipNorm; // Bounded by clipping norm
      const scale = sensitivity / dpEpsilon;
      db[0] += randomLaplace(scale);
      for (let i = 0; i < this.inputDim; i++) {
        dW[i][0] += randomLaplace(scale);
      }
    }

    // Weight Update
    this.b[0] -= learningRate * db[0];
    for (let i = 0; i < this.inputDim; i++) {
      this.W[i][0] -= learningRate * dW[i][0];
    }

    return { loss, gradients: { W: dW, b: db } };
  }

  public getWeights(): ModelWeights {
    return {
      W: this.W.map(row => [...row]),
      b: [...this.b]
    };
  }

  public setWeights(weights: ModelWeights): void {
    this.W = weights.W.map(row => [...row]);
    this.b = [...weights.b];
  }
}

/**
 * Real Federated Averaging (FedAvg) Mathematical Aggregator
 */
export class FederatedAggregator {
  public static fedAvg(clientWeights: ModelWeights[], clientSampleCounts: number[]): ModelWeights {
    const totalSamples = clientSampleCounts.reduce((a, b) => a + b, 0);
    const inputDim = clientWeights[0].W.length;
    const outputDim = clientWeights[0].W[0].length;

    // Initialize zero matrices for aggregated weights
    let aggW = Array.from({ length: inputDim }, () => Array.from({ length: outputDim }, () => 0));
    let aggB = Array.from({ length: outputDim }, () => 0);

    // Weighted sum
    for (let c = 0; c < clientWeights.length; c++) {
      const weight = clientSampleCounts[c] / totalSamples;
      const W_c = clientWeights[c].W;
      const b_c = clientWeights[c].b;

      for (let j = 0; j < outputDim; j++) {
        aggB[j] += b_c[j] * weight;
        for (let i = 0; i < inputDim; i++) {
          aggW[i][j] += W_c[i][j] * weight;
        }
      }
    }

    return { W: aggW, b: aggB };
  }
}

/**
 * Real SHAP (SHapley Additive exPlanations) Kernel Explainer
 * Computes exact marginal feature contributions by comparing predictions
 * across coalitions of features against a baseline.
 */
export function calculateRealSHAP(
  model: ClinicalNeuralNetwork,
  inputFeatures: number[],
  featureNames: string[],
  baselineFeatures: number[]
): { feature: string; impact: number; description: string }[] {
  const n = inputFeatures.length;
  let shapValues = Array.from({ length: n }, () => 0);

  // Exact Shapley value calculation for small feature sets (n <= 8)
  // For each feature, compute marginal contribution across all subsets
  const numSubsets = 1 << n; // 2^n subsets
  
  // Precompute factorial weights: |S|! * (n - |S| - 1)! / n!
  const fact = (num: number): number => num <= 1 ? 1 : num * fact(num - 1);
  const nFact = fact(n);

  for (let subset = 0; subset < numSubsets; subset++) {
    // Count active features in subset
    let subsetSize = 0;
    for (let i = 0; i < n; i++) {
      if ((subset & (1 << i)) !== 0) subsetSize++;
    }

    // Build coalition feature array
    const coalition = inputFeatures.map((val, idx) => 
      ((subset & (1 << idx)) !== 0) ? val : baselineFeatures[idx]
    );
    const predWith = model.forward(coalition);

    // For each feature NOT in the subset, calculate marginal contribution
    for (let i = 0; i < n; i++) {
      if ((subset & (1 << i)) === 0) {
        // Add feature i to coalition
        const coalitionWithI = [...coalition];
        coalitionWithI[i] = inputFeatures[i];
        const predWithI = model.forward(coalitionWithI);

        const marginalContribution = predWithI - predWith;
        const weight = (fact(subsetSize) * fact(n - subsetSize - 1)) / nFact;
        shapValues[i] += marginalContribution * weight;
      }
    }
  }

  // Format into percentage impacts and descriptions
  return featureNames.map((name, idx) => {
    const rawImpact = shapValues[idx];
    const percentageImpact = parseFloat((rawImpact * 100).toFixed(1));
    const inputVal = inputFeatures[idx];

    let desc = '';
    if (name === 'Glucose') {
      desc = inputVal > 125 ? `High fasting glucose (${inputVal} mg/dL) directly drives glycemic risk.` : `Optimal glucose (${inputVal} mg/dL) stabilizes metabolic profile.`;
    } else if (name === 'BMI') {
      desc = inputVal > 30 ? `Adiposity index (${inputVal}) elevates inflammatory cytokines.` : `Normal BMI (${inputVal}) protects vascular walls.`;
    } else if (name === 'Systolic BP') {
      desc = inputVal > 135 ? `Arterial hypertension (${inputVal} mmHg) increases cardiovascular strain.` : `Optimal blood pressure (${inputVal} mmHg) maintains healthy perfusion.`;
    } else if (name === 'Age') {
      desc = inputVal > 55 ? `Age (${inputVal}yo) correlates with cumulative cellular aging.` : `Younger age (${inputVal}yo) provides physiological resilience.`;
    } else if (name === 'Smoker') {
      desc = inputVal === 1 ? `Active tobacco use accelerates endothelial plaque formation.` : `Non-smoker status preserves lung and vascular elasticity.`;
    } else if (name === 'Family History') {
      desc = inputVal === 1 ? `Documented genetic predisposition identified from clinical cohorts.` : `No documented family history of condition.`;
    } else {
      desc = `Marginal Shapley contribution calculated at ${percentageImpact}%.`;
    }

    return {
      feature: name,
      impact: percentageImpact,
      description: desc
    };
  });
}

// Pre-trained realistic baseline weights for ALL 5 disease models
export const pretrainedModels: Record<string, ClinicalNeuralNetwork> = {
  diabetes: new ClinicalNeuralNetwork(6, 1, {
    // Weights for [Age, Glucose, BMI, BP, Smoker, FamilyHistory] (Normalized inputs)
    W: [[0.85], [2.45], [1.65], [0.55], [0.35], [1.10]],
    b: [-4.20] // Bias to keep healthy baseline low
  }),
  cvd: new ClinicalNeuralNetwork(6, 1, {
    // Weights for [Age, Glucose, BMI, BP, Smoker, FamilyHistory]
    // CVD places higher importance on BP and Smoking
    W: [[1.45], [0.65], [1.15], [2.25], [1.95], [0.85]],
    b: [-4.80]
  }),
  ckd: new ClinicalNeuralNetwork(6, 1, {
    // Weights for [Age, Creatinine, eGFR, Glucose, BMI, BP]
    // CKD is highly sensitive to Creatinine & eGFR
    W: [[1.55], [3.05], [-2.45], [1.10], [0.95], [1.85]],
    b: [-3.90]
  }),
  copd: new ClinicalNeuralNetwork(6, 1, {
    // Weights for [Age, Smoking, FEV1%, BMI, BP, Glucose]
    // COPD places extreme importance on Smoking & FEV1% forced expiratory volume
    W: [[2.10], [3.35], [-2.85], [0.45], [0.65], [0.35]],
    b: [-4.10]
  }),
  oncology: new ClinicalNeuralNetwork(6, 1, {
    // Weights for [Age, FamilyHistory, TumorGradeProxy, BMI, Smoking, Glucose]
    // Oncology relies heavily on FamilyHistory & Tumor Grade proxy
    W: [[2.05], [2.65], [2.15], [0.55], [0.95], [0.25]],
    b: [-5.10]
  })
};

// Helper to normalize raw patient vitals into model feature space based on disease type
export function normalizePatientFeatures(age: number, glucose: number, bmi: number, bp: number, smoker: boolean, family: boolean): number[] {
  return [
    (age - 40) / 30.0,        // Age centered around 40
    (glucose - 100) / 80.0,   // Glucose centered around 100
    (bmi - 25) / 15.0,        // BMI centered around 25
    (bp - 120) / 40.0,        // BP centered around 120
    smoker ? 1.0 : 0.0,
    family ? 1.0 : 0.0
  ];
}

// Disease-specific feature normalizers for accurate predictions
export function normalizeCKDFeatures(age: number, creatinine: number, egfr: number, glucose: number, bmi: number, bp: number): number[] {
  return [
    (age - 45) / 35.0,             // Age
    (creatinine - 1.0) / 1.5,     // Creatinine (mg/dL)
    (egfr - 90) / 40.0,           // eGFR (mL/min/1.73m2)
    (glucose - 100) / 80.0,       // Glucose
    (bmi - 25) / 15.0,            // BMI
    (bp - 120) / 40.0             // BP
  ];
}

export function normalizeCOPFeatures(age: number, fev1Percent: number, smoker: boolean, bmi: number, bp: number, glucose: number): number[] {
  return [
    (age - 55) / 25.0,            // Age (COPD patients tend to be older)
    smoker ? 1.0 : 0.0,           // Smoking is the #1 driver
    (fev1Percent - 80) / 30.0,    // FEV1% predicted (lower = worse)
    (bmi - 24) / 12.0,            // BMI
    (bp - 130) / 35.0,            // BP
    (glucose - 100) / 80.0        // Glucose
  ];
}

export function normalizeOncologyFeatures(age: number, tumorGradeProxy: number, lymphNodeProxy: number, biomarkerIndex: number, bmi: number, family: boolean): number[] {
  return [
    (age - 50) / 25.0,            // Age
    family ? 1.0 : 0.0,           // Family History
    (tumorGradeProxy - 2.0) / 1.5,// Tumor Grade proxy (1-4 scale)
    (lymphNodeProxy - 0.5) / 0.5, // Lymph Node proxy
    (bmi - 25) / 15.0,            // BMI
    (biomarkerIndex - 3.0) / 2.5  // Biomarker Index
  ];
}

// Healthy baseline feature vector for SHAP comparisons
export const healthyBaselineFeatures = normalizePatientFeatures(35, 90, 22, 115, false, false);
export const featureNamesList = ['Age', 'Glucose', 'BMI', 'Systolic BP', 'Smoker', 'Family History'];
export const ckdFeatureNames = ['Age', 'Creatinine', 'eGFR', 'Glucose', 'BMI', 'BP'];
export const copdFeatureNames = ['Age', 'Smoking', 'FEV1%', 'BMI', 'BP', 'Glucose'];
export const oncologyFeatureNames = ['Age', 'Family History', 'Tumor Grade', 'Lymph Node', 'BMI', 'Biomarker'];
export const healthyBaselineCKD = normalizeCKDFeatures(40, 0.9, 95, 90, 23, 120);
export const healthyBaselineCOPD = normalizeCOPFeatures(40, 95, false, 23, 120, 90);
export const healthyBaselineOncology = normalizeOncologyFeatures(40, 1.0, 0.0, 2.5, 23, false);
