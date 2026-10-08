import numpy as np
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    roc_auc_score, confusion_matrix, roc_curve
)

def evaluate_model_performance(y_true, y_pred, y_prob):
    acc = float(accuracy_score(y_true, y_pred))
    prec = float(precision_score(y_true, y_pred, zero_division=0))
    rec = float(recall_score(y_true, y_pred, zero_division=0)) # Recall / Sensitivity
    f1 = float(f1_score(y_true, y_pred, zero_division=0))
    
    # ROC AUC
    try:
        auc = float(roc_auc_score(y_true, y_prob))
    except Exception:
        auc = 0.5
        
    # Confusion Matrix
    cm = confusion_matrix(y_true, y_pred)
    if cm.shape == (2, 2):
        tn, fp, fn, tp = cm.ravel()
    else:
        tn = fp = fn = tp = 0
        
    tn = int(tn)
    fp = int(fp)
    fn = int(fn)
    tp = int(tp)
    
    # Specificity = TN / (TN + FP)
    specificity = float(tn / (tn + fp)) if (tn + fp) > 0 else 0.0
    
    # ROC Curve Data
    fpr_vals, tpr_vals, thresholds = roc_curve(y_true, y_prob)
    step = max(1, len(fpr_vals) // 30)
    roc_data = []
    for i in range(0, len(fpr_vals), step):
        t_val = float(thresholds[i])
        if np.isinf(t_val) or np.isnan(t_val):
            t_val = 1.0
        roc_data.append({
            "fpr": round(float(fpr_vals[i]), 4),
            "tpr": round(float(tpr_vals[i]), 4),
            "threshold": round(t_val, 4)
        })
    if len(roc_data) == 0 or roc_data[-1]["fpr"] != 1.0:
        roc_data.append({"fpr": 1.0, "tpr": 1.0, "threshold": 0.0})

    # False-Negative Analysis (Crucial in medical context)
    total_malignant = tp + fn
    fn_rate = float(fn / total_malignant) if total_malignant > 0 else 0.0
    
    fn_analysis = {
        "false_negatives_count": fn,
        "false_positives_count": fp,
        "true_positives_count": tp,
        "true_negatives_count": tn,
        "false_negative_rate": round(fn_rate * 100, 2),
        "sensitivity_percentage": round(rec * 100, 2),
        "clinical_impact_note": (
            "In clinical screening, False Negatives (predicting Benign when actual is Malignant) "
            "carry severe risks of delayed treatment. High Recall / Sensitivity (>95%) minimizes "
            "undetected malignant cases."
        )
    }

    return {
        "accuracy": round(acc, 4),
        "precision": round(prec, 4),
        "recall": round(rec, 4),
        "sensitivity": round(rec, 4),
        "specificity": round(specificity, 4),
        "f1_score": round(f1, 4),
        "roc_auc": round(auc, 4),
        "confusion_matrix": {
            "tn": tn,
            "fp": fp,
            "fn": fn,
            "tp": tp,
            "matrix": [[tn, fp], [fn, tp]]
        },
        "roc_curve": roc_data,
        "fn_analysis": fn_analysis
    }
