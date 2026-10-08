import os
import sys
import json
import io
import pandas as pd
from typing import Dict, Any, Optional, List
from fastapi import FastAPI, HTTPException, File, UploadFile, Query, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, JSONResponse
from pydantic import BaseModel

# Ensure project root is in sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from ml.predict import predict_sample
from ml.train import train_all_models
from backend.history_store import (
    get_all_history, add_history_record, delete_history_record, clear_all_history
)

app = FastAPI(
    title="Breast Cancer Detection ML API",
    description="REST API for Educational & Research Breast Cancer Machine Learning Decision-Support System",
    version="1.0.0"
)

# Enable CORS for Frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PredictRequest(BaseModel):
    features: Dict[str, float]

@app.get("/")
def read_root():
    return {
        "status": "online",
        "system": "Breast Cancer Detection ML Decision-Support API",
        "disclaimer": "For Educational & Research Purposes Only. Not a Clinical Diagnosis Tool.",
        "endpoints": [
            "/api/predict",
            "/api/model-performance",
            "/api/dataset-statistics",
            "/api/train",
            "/api/history"
        ]
    }

@app.post("/api/predict")
def predict_endpoint(req: PredictRequest):
    try:
        sample_dict = req.features
        if not sample_dict:
            raise HTTPException(status_code=400, detail="Features dictionary cannot be empty.")
            
        result = predict_sample(sample_dict)
        # Store in prediction history
        add_history_record(result, sample_dict)
        return result
    except FileNotFoundError as fnf:
        raise HTTPException(status_code=500, detail=str(fnf))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

@app.get("/api/model-performance")
def get_model_performance():
    metrics_path = "saved_models/model_metrics.json"
    if not os.path.exists(metrics_path):
        # Auto-train if metrics missing
        train_all_models()
        
    try:
        with open(metrics_path, "r") as f:
            data = json.load(f)
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load model metrics: {str(e)}")

@app.get("/api/dataset-statistics")
def get_dataset_statistics():
    stats_path = "saved_models/dataset_stats.json"
    if not os.path.exists(stats_path):
        train_all_models()
        
    try:
        with open(stats_path, "r") as f:
            data = json.load(f)
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load dataset stats: {str(e)}")

@app.post("/api/train")
async def train_models_endpoint(
    file: Optional[UploadFile] = File(None)
):
    try:
        csv_path = "ml/dataset/wdbc.csv"
        if file:
            temp_upload_path = "saved_models/custom_uploaded_dataset.csv"
            contents = await file.read()
            with open(temp_upload_path, "wb") as f:
                f.write(contents)
            csv_path = temp_upload_path
            
        results, best_name = train_all_models(csv_path=csv_path)
        return {
            "status": "success",
            "message": f"All models successfully trained! Best model: {best_name}",
            "best_model": best_name,
            "results": results
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Model training failed: {str(e)}")

@app.get("/api/history")
def get_history(
    search: Optional[str] = Query(None),
    diagnosis: Optional[str] = Query(None)
):
    records = get_all_history()
    
    if search:
        s = search.lower()
        records = [
            r for r in records 
            if s in r["id"].lower() or s in r["prediction"].lower() or s in r["model_used"].lower()
        ]
        
    if diagnosis and diagnosis != "All":
        records = [r for r in records if r["prediction"].lower() == diagnosis.lower()]
        
    return {
        "total_records": len(records),
        "history": records
    }

@app.delete("/api/history/{record_id}")
def delete_history_item(record_id: str):
    success = delete_history_record(record_id)
    if not success:
        raise HTTPException(status_code=404, detail="Record not found")
    return {"status": "success", "message": f"Record {record_id} deleted"}

@app.post("/api/history/clear")
def clear_history():
    clear_all_history()
    return {"status": "success", "message": "Prediction history cleared"}

@app.get("/api/history/export")
def export_history(format: str = Query("csv")):
    records = get_all_history()
    if not records:
        raise HTTPException(status_code=400, detail="No history records to export")
        
    if format == "json":
        json_str = json.dumps(records, indent=2)
        return StreamingResponse(
            io.BytesIO(json_str.encode("utf-8")),
            media_type="application/json",
            headers={"Content-Disposition": "attachment; filename=prediction_history.json"}
        )
    else: # Default CSV
        df = pd.DataFrame(records)
        if "sample_inputs" in df.columns:
            df = df.drop(columns=["sample_inputs", "top_features"], errors="ignore")
        csv_str = df.to_csv(index=False)
        return StreamingResponse(
            io.BytesIO(csv_str.encode("utf-8")),
            media_type="text/csv",
            headers={"Content-Disposition": "attachment; filename=prediction_history.csv"}
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="127.0.0.1", port=8000, reload=True)
