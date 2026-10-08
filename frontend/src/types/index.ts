export interface FeatureContribution {
  feature: string;
  value: number;
  impact: number;
  signed_impact: number;
  direction: 'Malignant' | 'Benign';
}

export interface PredictionResult {
  prediction: 'Benign' | 'Malignant';
  is_malignant: boolean;
  confidence: number;
  probabilities: {
    Benign: number;
    Malignant: number;
  };
  model_used: string;
  top_features: FeatureContribution[];
  all_feature_contributions?: FeatureContribution[];
  disclaimer: string;
}

export interface ConfusionMatrix {
  tn: number;
  fp: number;
  fn: number;
  tp: number;
  matrix: number[][];
}

export interface ROCPoint {
  fpr: number;
  tpr: number;
  threshold: number;
}

export interface FalseNegativeAnalysis {
  false_negatives_count: number;
  false_positives_count: number;
  true_positives_count: number;
  true_negatives_count: number;
  false_negative_rate: number;
  sensitivity_percentage: number;
  clinical_impact_note: string;
}

export interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  sensitivity: number;
  specificity: number;
  f1_score: number;
  roc_auc: number;
  cv_roc_auc_mean: number;
  cv_roc_auc_std: number;
  confusion_matrix: ConfusionMatrix;
  roc_curve: ROCPoint[];
  feature_importances: Record<string, number>;
  fn_analysis: FalseNegativeAnalysis;
}

export interface ModelPerformanceResponse {
  best_model_name: string;
  models: Record<string, ModelMetrics>;
}

export interface DatasetStatistics {
  total_samples: number;
  feature_count: number;
  benign_count: number;
  malignant_count: number;
  missing_values: Record<string, number>;
  duplicate_rows: number;
  class_balance: {
    Benign: number;
    Malignant: number;
  };
  target_correlations: Record<string, number>;
  feature_means: Record<string, number>;
  feature_stds: Record<string, number>;
  feature_mins: Record<string, number>;
  feature_maxs: Record<string, number>;
}

export interface HistoryRecord {
  id: string;
  date: string;
  prediction: 'Benign' | 'Malignant';
  is_malignant: boolean;
  confidence: number;
  benign_prob: number;
  malignant_prob: number;
  model_used: string;
  features_summary: string;
  sample_inputs: Record<string, number>;
  top_features?: FeatureContribution[];
}
