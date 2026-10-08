import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

FEATURE_NAMES = [
    "mean radius", "mean texture", "mean perimeter", "mean area",
    "mean smoothness", "mean compactness", "mean concavity",
    "mean concave points", "mean symmetry", "mean fractal dimension",
    "radius error", "texture error", "perimeter error", "area error",
    "smoothness error", "compactness error", "concavity error",
    "concave points error", "symmetry error", "fractal dimension error",
    "worst radius", "worst texture", "worst perimeter", "worst area",
    "worst smoothness", "worst compactness", "worst concavity",
    "worst concave points", "worst symmetry", "worst fractal dimension"
]

PRIMARY_10_FEATURES = [
    "mean radius", "mean texture", "mean perimeter", "mean area",
    "mean smoothness", "mean compactness", "mean concavity",
    "mean concave points", "mean symmetry", "mean fractal dimension"
]

def load_and_preprocess_dataset(csv_path="ml/dataset/wdbc.csv", test_size=0.2, random_state=42):
    df = pd.read_csv(csv_path)
    
    # 1. Missing Value Check
    missing_count = df.isnull().sum().to_dict()
    has_missing = df.isnull().sum().sum() > 0
    if has_missing:
        df = df.fillna(df.mean(numeric_only=True))
        
    # 2. Duplicate Check
    duplicate_count = int(df.duplicated().sum())
    if duplicate_count > 0:
        df = df.drop_duplicates()
        
    # 3. Identify Target and Features
    target_col = 'diagnosis' if 'diagnosis' in df.columns else df.columns[-1]
    
    # Ensure numeric columns
    numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
    feature_cols = [c for c in numeric_cols if c != target_col and c != 'id']
    
    X = df[feature_cols]
    y = df[target_col]
    
    # Class Distribution Analysis
    class_counts = y.value_counts().to_dict()
    benign_count = int(class_counts.get(0, 0))
    malignant_count = int(class_counts.get(1, 0))
    total_samples = len(y)
    
    # 4. Train / Test Split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=test_size, random_state=random_state, stratify=y
    )
    
    # 5. Feature Scaling
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Feature Correlations with Target
    corr_matrix = df[feature_cols + [target_col]].corr().to_dict()
    target_corr = df[feature_cols].apply(lambda col: col.corr(y)).to_dict()
    
    eda_summary = {
        "total_samples": total_samples,
        "feature_count": len(feature_cols),
        "benign_count": benign_count,
        "malignant_count": malignant_count,
        "missing_values": missing_count,
        "duplicate_rows": duplicate_count,
        "class_balance": {
            "Benign": round(benign_count / total_samples * 100, 2),
            "Malignant": round(malignant_count / total_samples * 100, 2)
        },
        "target_correlations": target_corr,
        "feature_means": df[feature_cols].mean().to_dict(),
        "feature_stds": df[feature_cols].std().to_dict(),
        "feature_mins": df[feature_cols].min().to_dict(),
        "feature_maxs": df[feature_cols].max().to_dict()
    }
    
    return {
        "X_train": X_train,
        "X_test": X_test,
        "X_train_scaled": X_train_scaled,
        "X_test_scaled": X_test_scaled,
        "y_train": y_train,
        "y_test": y_test,
        "scaler": scaler,
        "feature_names": feature_cols,
        "eda_summary": eda_summary,
        "raw_df": df
    }
