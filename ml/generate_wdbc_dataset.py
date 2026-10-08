import os
import pandas as pd
import numpy as np
from sklearn.datasets import load_breast_cancer

def export_wdbc_csv():
    data = load_breast_cancer()
    df = pd.DataFrame(data.data, columns=data.feature_names)
    # Target in sklearn: 0 = Malignant, 1 = Benign
    # Standard WDBC encoding: 0 = Benign, 1 = Malignant (or text 'Benign', 'Malignant')
    # Let's add target as 'diagnosis' with values 0 (Benign) and 1 (Malignant)
    # sklearn data.target: 0 is malignant, 1 is benign. Let's align diagnosis_label and target (1=Malignant, 0=Benign for intuitive positive=Malignant)
    df['diagnosis'] = (data.target == 0).astype(int)
    df['diagnosis_label'] = df['diagnosis'].map({0: 'Benign', 1: 'Malignant'})
    
    os.makedirs('ml/dataset', exist_ok=True)
    csv_path = 'ml/dataset/wdbc.csv'
    df.to_csv(csv_path, index=False)
    print(f"Dataset successfully saved to {csv_path} with shape {df.shape}")
    print(f"Class distribution:\n{df['diagnosis_label'].value_counts()}")

if __name__ == '__main__':
    export_wdbc_csv()
