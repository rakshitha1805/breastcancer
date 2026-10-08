import os
import sys
import subprocess
import time

def main():
    print("=" * 70)
    print(" Breast Cancer Detection Using Machine Learning")
    print(" Educational & Research Decision-Support Application")
    print("=" * 70)
    
    # 1. Train models if missing
    if not os.path.exists("saved_models/best_model.pkl"):
        print("\n[ML Core] Training ML models on WDBC dataset...")
        subprocess.run([sys.executable, "ml/train.py"], check=True)
    else:
        print("\n[ML Core] Pre-trained models found in saved_models/")

    # 2. Start FastAPI Backend Server
    print("\n[Backend] Starting FastAPI REST Server at http://127.0.0.1:8000...")
    backend_proc = subprocess.Popen(
        [sys.executable, "-m", "uvicorn", "backend.main:app", "--host", "127.0.0.1", "--port", "8000"],
        cwd=os.getcwd()
    )

    # 3. Start Frontend Dev Server
    print("[Frontend] Starting Vite React Dev Server at http://localhost:5173...")
    frontend_proc = subprocess.Popen(
        "npm run dev",
        shell=True,
        cwd=os.path.join(os.getcwd(), "frontend")
    )

    print("\n" + "=" * 70)
    print(" Application Successfully Launched!")
    print(" • Frontend UI: http://localhost:5173")
    print(" • REST API Docs (Swagger): http://127.0.0.1:8000/docs")
    print("=" * 70 + "\n")

    try:
        backend_proc.wait()
        frontend_proc.wait()
    except KeyboardInterrupt:
        print("\nStopping services...")
        backend_proc.terminate()
        frontend_proc.terminate()

if __name__ == "__main__":
    main()
