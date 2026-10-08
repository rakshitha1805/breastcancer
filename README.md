# Breast Cancer Detection Using Machine Learning

A modern, professional web application designed for educational and research decision-support purposes to evaluate nuclear morphometry measurements from digitized Fine-Needle Aspirates (FNA) of breast masses.

> **Important Disclaimer:** This application is an **AI/ML decision-support and research prototype**, not a clinical diagnosis tool or replacement for a qualified healthcare professional. Do not use for medical diagnosis without prospective clinical validation.

---

## 🌟 Key Features

1. **Intelligent Prediction Engine**: Analyzes nuclear morphometry metrics (Radius, Texture, Perimeter, Area, Smoothness, Compactness, Concavity, Concave Points, Symmetry, Fractal Dimension) and predicts **Benign** vs **Malignant** with confidence percentages.
2. **Explainable AI (SHAP)**: Visual feature importance and local contribution breakdown showing how each clinical measurement influences the prediction towards Benign or Malignant.
3. **Multi-Model Benchmark (6 Algorithms)**:
   - Logistic Regression
   - Decision Tree
   - Random Forest
   - Support Vector Machine (SVM)
   - K-Nearest Neighbors (KNN)
   - Gradient Boosting
4. **Diagnostic Metrics & False-Negative Emphasis**: Evaluates Accuracy, Precision, Recall / Sensitivity, Specificity, F1-Score, ROC-AUC, Confusion Matrix, and ROC Curves with a dedicated emphasis on minimizing False Negatives.
5. **Interactive Dashboard**: Real-time stats overview, class distribution analysis, correlation heatmap, recent predictions, and model performance rankings.
6. **Model Training Page**: Authorized interface to upload custom CSV datasets, configure preprocessing scaling (StandardScaler), set train/test ratios, select ML algorithms, train models live, and save the active model.
7. **Prediction History & Export**: De-identified historical log with search, diagnosis filtering, detail inspection modals, and export capabilities to CSV and JSON.
8. **Academic Research Paper**: Full documentation page with Abstract, Introduction, Problem Statement, Literature Survey, Methodology, Algorithms, System Architecture, Limitations, Future Scope, and References.

---

## 🏗️ Project Architecture

```
Breast-Cancer-Detection/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── DisclaimerBanner.tsx
│   │   │   ├── FeatureImportanceChart.tsx
│   │   │   ├── ConfusionMatrixView.tsx
│   │   │   ├── ROCCurveView.tsx
│   │   │   └── SampleDataPresets.tsx
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── SinglePrediction.tsx
│   │   │   ├── ModelPerformance.tsx
│   │   │   ├── DatasetAnalysis.tsx
│   │   │   ├── ModelTraining.tsx
│   │   │   ├── PredictionHistory.tsx
│   │   │   └── ResearchProjectDoc.tsx
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   └── package.json
│
├── backend/
│   ├── main.py              # FastAPI REST Server
│   ├── history_store.py     # Prediction history persistence
│   └── requirements.txt
│
├── ml/
│   ├── dataset/
│   │   └── wdbc.csv          # Wisconsin Diagnostic Breast Cancer Dataset
│   ├── generate_wdbc_dataset.py
│   ├── preprocessing.py     # Missing values, scaling, stratified split
│   ├── train.py             # Multi-model training & 5-fold CV
│   ├── evaluate.py          # Metrics, confusion matrix, ROC data
│   └── predict.py           # Single sample inference & SHAP explainability
│
├── saved_models/
│   ├── best_model.pkl        # Active model pipeline bundle
│   ├── all_models.pkl
│   ├── model_metrics.json    # Benchmark metrics
│   └── dataset_stats.json    # EDA statistics
│
├── notebooks/
│   ├── exploratory_analysis.ipynb   # Complete Jupyter Notebook
│   └── create_notebook.py
│
├── start_app.py              # One-click startup script
└── README.md
```

---

## ⚡ Quick Start & Installation

### Prerequisites
- Python 3.9+
- Node.js 18+

### 1. Install Backend Dependencies
```bash
python -m pip install -r backend/requirements.txt
```

### 2. Install Frontend Dependencies
```bash
cd frontend
npm install
cd ..
```

### 3. Run the Application
Launch both backend REST API and frontend UI with a single command:
```bash
python start_app.py
```

- **Frontend Application**: `http://localhost:5173`
- **FastAPI REST API Docs (Swagger)**: `http://127.0.0.1:8000/docs`

---

## 📊 REST API Endpoints

- `POST /api/predict`: Runs sample classification & SHAP explainability analysis.
- `GET /api/model-performance`: Returns 6-model benchmark metrics, confusion matrices, and ROC curves.
- `GET /api/dataset-statistics`: Returns WDBC dataset EDA, class balance, and feature correlations.
- `POST /api/train`: Re-trains models on uploaded or default dataset.
- `GET /api/history`: Retrieves prediction history log (with search and filter query parameters).
- `GET /api/history/export`: Exports prediction history as CSV or JSON file.

---

## 🔮 Future Scope

1. **Deep Learning Mammography**: Integration of Convolutional Neural Networks (CNNs) for raw mammography image analysis.
2. **External Multi-Center Validation**: Testing on larger multi-institutional patient cohorts.
3. **Federated Learning**: Decentralized privacy-preserving training across hospital networks.
4. **Clinical Decision Support System (CDSS)**: Interoperable EHR integration via FHIR protocols.

---

## 📜 License & Disclaimers

Distributed for educational, academic, and research decision-support evaluation. Not for clinical diagnosis.
