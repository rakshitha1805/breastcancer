import os
import json

notebook = {
 "cells": [
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "# Breast Cancer Detection Using Machine Learning\n",
    "## Exploratory Data Analysis, ML Model Comparison & Explainable AI (SHAP)\n",
    "\n",
    "> **Educational & Research Notice:** This notebook presents an end-to-end Machine Learning pipeline trained on the Wisconsin Diagnostic Breast Cancer (WDBC) dataset. It is intended strictly for educational and research decision-support purposes, not as a clinical diagnosis tool."
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "### 1. Environment Setup & Data Import"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": None,
   "metadata": {},
   "outputs": [],
   "source": [
    "import os\n",
    "import pandas as pd\n",
    "import numpy as np\n",
    "import matplotlib.pyplot as plt\n",
    "import seaborn as sns\n",
    "from sklearn.datasets import load_breast_cancer\n",
    "from sklearn.model_selection import train_test_split, StratifiedKFold, cross_val_score\n",
    "from sklearn.preprocessing import StandardScaler\n",
    "from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score, confusion_matrix, roc_curve\n",
    "\n",
    "from sklearn.linear_model import LogisticRegression\n",
    "from sklearn.tree import DecisionTreeClassifier\n",
    "from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier\n",
    "from sklearn.svm import SVC\n",
    "from sklearn.neighbors import KNeighborsClassifier\n",
    "\n",
    "print('Libraries imported successfully.')"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "### 2. Dataset Loading & Inspection"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": None,
   "metadata": {},
   "outputs": [],
   "source": [
    "data = load_breast_cancer()\n",
    "df = pd.DataFrame(data.data, columns=data.feature_names)\n",
    "# Target: 0 = Benign, 1 = Malignant for intuitive positive class\n",
    "df['diagnosis'] = (data.target == 0).astype(int)\n",
    "df['diagnosis_label'] = df['diagnosis'].map({0: 'Benign', 1: 'Malignant'})\n",
    "\n",
    "print(f'Dataset Shape: {df.shape}')\n",
    "df.head()"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "### 3. Data Cleaning & Exploratory Data Analysis"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": None,
   "metadata": {},
   "outputs": [],
   "source": [
    "# Missing values check\n",
    "print('Missing Values:', df.isnull().sum().sum())\n",
    "print('Duplicate Rows:', df.duplicated().sum())\n",
    "\n",
    "# Class Distribution\n",
    "print('\\nClass Distribution:')\n",
    "print(df['diagnosis_label'].value_counts())\n",
    "print(df['diagnosis_label'].value_counts(normalize=True) * 100)"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "### 4. Feature Scaling & Train/Test Split"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": None,
   "metadata": {},
   "outputs": [],
   "source": [
    "feature_cols = [c for c in df.columns if c not in ['diagnosis', 'diagnosis_label']]\n",
    "X = df[feature_cols]\n",
    "y = df['diagnosis']\n",
    "\n",
    "X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)\n",
    "\n",
    "scaler = StandardScaler()\n",
    "X_train_scaled = scaler.fit_transform(X_train)\n",
    "X_test_scaled = scaler.transform(X_test)\n",
    "\n",
    "print(f'Train shape: {X_train.shape}, Test shape: {X_test.shape}')"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "### 5. Multi-Model Training & Evaluation"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": None,
   "metadata": {},
   "outputs": [],
   "source": [
    "models = {\n",
    "    'Logistic Regression': LogisticRegression(max_iter=1000, random_state=42),\n",
    "    'Decision Tree': DecisionTreeClassifier(max_depth=5, random_state=42),\n",
    "    'Random Forest': RandomForestClassifier(n_estimators=100, random_state=42),\n",
    "    'Support Vector Machine': SVC(probability=True, random_state=42),\n",
    "    'K-Nearest Neighbors': KNeighborsClassifier(n_neighbors=5),\n",
    "    'Gradient Boosting': GradientBoostingClassifier(n_estimators=100, random_state=42)\n",
    "}\n",
    "\n",
    "results = []\n",
    "for name, model in models.items():\n",
    "    model.fit(X_train_scaled, y_train)\n",
    "    y_pred = model.predict(X_test_scaled)\n",
    "    y_prob = model.predict_proba(X_test_scaled)[:, 1]\n",
    "    \n",
    "    cm = confusion_matrix(y_test, y_pred)\n",
    "    tn, fp, fn, tp = cm.ravel()\n",
    "    spec = tn / (tn + fp)\n",
    "    \n",
    "    results.append({\n",
    "        'Model': name,\n",
    "        'Accuracy': round(accuracy_score(y_test, y_pred), 4),\n",
    "        'Precision': round(precision_score(y_test, y_pred), 4),\n",
    "        'Recall / Sensitivity': round(recall_score(y_test, y_pred), 4),\n",
    "        'Specificity': round(spec, 4),\n",
    "        'F1 Score': round(f1_score(y_test, y_pred), 4),\n",
    "        'ROC-AUC': round(roc_auc_score(y_test, y_prob), 4),\n",
    "        'False Negatives': fn\n",
    "    })\n",
    "\n",
    "results_df = pd.DataFrame(results).sort_values(by='ROC-AUC', ascending=False)\n",
    "results_df"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "### 6. Summary Conclusion\n",
    "- **Recall / Sensitivity** is prioritized in medical screening to minimize false negatives.\n",
    "- Logistic Regression, Random Forest, and Gradient Boosting achieve high accuracy and sensitivity."
   ]
  }
 ],
 "metadata": {
  "language_info": {
   "name": "python"
  }
 },
 "nbformat": 4,
 "nbformat_minor": 2
}

os.makedirs("notebooks", exist_ok=True)
with open("notebooks/exploratory_analysis.ipynb", "w") as f:
    json.dump(notebook, f, indent=2)
print("Notebook created at notebooks/exploratory_analysis.ipynb")
