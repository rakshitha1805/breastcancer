import os
import sys
import json
import joblib
import numpy as np
import pandas as pd

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.svm import SVC
from sklearn.neighbors import KNeighborsClassifier
from sklearn.model_selection import StratifiedKFold, cross_val_score

from ml.preprocessing import load_and_preprocess_dataset
from ml.evaluate import evaluate_model_performance

MODEL_ALGORITHMS = {
    "Logistic Regression": LogisticRegression(max_iter=1000, random_state=42),
    "Decision Tree": DecisionTreeClassifier(random_state=42, max_depth=5),
    "Random Forest": RandomForestClassifier(n_estimators=100, random_state=42),
    "Support Vector Machine": SVC(probability=True, kernel='rbf', C=1.0, random_state=42),
    "K-Nearest Neighbors": KNeighborsClassifier(n_neighbors=5),
    "Gradient Boosting": GradientBoostingClassifier(n_estimators=100, random_state=42)
}

def train_all_models(csv_path="ml/dataset/wdbc.csv", save_dir="saved_models"):
    os.makedirs(save_dir, exist_ok=True)
    
    # 1. Preprocess Dataset
    data_dict = load_and_preprocess_dataset(csv_path)
    X_train_scaled = data_dict["X_train_scaled"]
    X_test_scaled = data_dict["X_test_scaled"]
    y_train = data_dict["y_train"]
    y_test = data_dict["y_test"]
    scaler = data_dict["scaler"]
    feature_names = data_dict["feature_names"]
    eda_summary = data_dict["eda_summary"]
    
    results = {}
    trained_models = {}
    
    skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
    
    best_name = None
    best_score = -1.0
    best_model_obj = None
    
    for name, model in MODEL_ALGORITHMS.items():
        print(f"Training {name}...")
        # Fit on training data
        model.fit(X_train_scaled, y_train)
        
        # Test set predictions & probabilities
        y_pred = model.predict(X_test_scaled)
        if hasattr(model, "predict_proba"):
            y_prob = model.predict_proba(X_test_scaled)[:, 1]
        elif hasattr(model, "decision_function"):
            df_vals = model.decision_function(X_test_scaled)
            y_prob = (df_vals - df_vals.min()) / (df_vals.max() - df_vals.min() + 1e-8)
        else:
            y_prob = y_pred.astype(float)
            
        # Perform 5-fold CV on train set
        cv_scores = cross_val_score(model, X_train_scaled, y_train, cv=skf, scoring='roc_auc')
        
        # Calculate Evaluation Metrics
        eval_metrics = evaluate_model_performance(y_test, y_pred, y_prob)
        eval_metrics["cv_roc_auc_mean"] = round(float(np.mean(cv_scores)), 4)
        eval_metrics["cv_roc_auc_std"] = round(float(np.std(cv_scores)), 4)
        
        # Extract Feature Importances if available
        feature_importances = {}
        if hasattr(model, "feature_importances_"):
            importances = model.feature_importances_
            for fn, imp in zip(feature_names, importances):
                feature_importances[fn] = round(float(imp), 4)
        elif hasattr(model, "coef_"):
            coefs = np.abs(model.coef_[0])
            norm_coefs = coefs / (np.sum(coefs) + 1e-8)
            for fn, imp in zip(feature_names, norm_coefs):
                feature_importances[fn] = round(float(imp), 4)
                
        eval_metrics["feature_importances"] = feature_importances
        
        results[name] = eval_metrics
        trained_models[name] = model
        
        # Determine best model based on weighted combination of ROC-AUC and Recall
        composite_score = eval_metrics["roc_auc"] * 0.6 + eval_metrics["recall"] * 0.4
        if composite_score > best_score:
            best_score = composite_score
            best_name = name
            best_model_obj = model
            
    print(f"\nBest Model Selected: {best_name} with Composite Score: {round(best_score, 4)}")
    
    # Save Best Model Bundle
    best_bundle = {
        "model": best_model_obj,
        "scaler": scaler,
        "feature_names": feature_names,
        "model_name": best_name,
        "metrics": results[best_name]
    }
    joblib.dump(best_bundle, os.path.join(save_dir, "best_model.pkl"))
    
    # Save all models
    joblib.dump({
        "models": trained_models,
        "scaler": scaler,
        "feature_names": feature_names
    }, os.path.join(save_dir, "all_models.pkl"))
    
    # Save metrics JSON
    metrics_export = {
        "best_model_name": best_name,
        "models": results
    }
    with open(os.path.join(save_dir, "model_metrics.json"), "w") as f:
        json.dump(metrics_export, f, indent=2)
        
    # Save dataset stats JSON
    with open(os.path.join(save_dir, "dataset_stats.json"), "w") as f:
        json.dump(eda_summary, f, indent=2)
        
    print(f"Training artifacts successfully saved in '{save_dir}'")
    return results, best_name

if __name__ == "__main__":
    train_all_models()
