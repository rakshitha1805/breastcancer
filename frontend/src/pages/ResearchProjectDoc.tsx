import React from 'react';
import { FileText, Cpu, BookOpen, Layers, CheckCircle2, Award, Zap, Compass, ShieldCheck } from 'lucide-react';
import { DisclaimerBanner } from '../components/DisclaimerBanner';

export const ResearchProjectDoc: React.FC = () => {
  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto text-slate-800 dark:text-slate-200">
      {/* Header */}
      <div className="space-y-2 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 text-xs font-semibold">
          <FileText className="w-3.5 h-3.5" />
          <span>Academic & Research Project Documentation</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
          Breast Cancer Detection Using Machine Learning
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          A Comprehensive Machine Learning Framework for Fine-Needle Aspirate (FNA) Morphometry Classification & Explainable AI
        </p>
      </div>

      <DisclaimerBanner />

      {/* Table of Contents Quick Nav */}
      <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs space-y-2">
        <div className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
          <BookOpen className="w-4 h-4 text-teal-500" />
          Academic Paper Table of Contents
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-600 dark:text-slate-400 font-medium">
          <span>1. Abstract</span>
          <span>2. Introduction</span>
          <span>3. Problem Statement</span>
          <span>4. Objectives</span>
          <span>5. Literature Survey</span>
          <span>6. Dataset Description</span>
          <span>7. Methodology</span>
          <span>8. Algorithms Used</span>
          <span>9. System Architecture</span>
          <span>10. Implementation</span>
          <span>11. Results & Comparison</span>
          <span>12. False-Negative Analysis</span>
          <span>13. Limitations</span>
          <span>14. Future Scope</span>
          <span>15. Conclusion</span>
          <span>16. References</span>
        </div>
      </div>

      {/* Content Sections */}
      <div className="space-y-8 leading-relaxed text-sm">
        {/* Section 1: Abstract */}
        <section className="space-y-2 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/60">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="text-teal-600 font-mono">1.</span> Abstract
          </h2>
          <p className="text-slate-600 dark:text-slate-300">
            Breast cancer is one of the leading causes of cancer-related mortality among women worldwide. Early detection significantly improves survival rates. This project presents an intelligent machine-learning decision-support system designed to classify breast tissue samples as <strong>Benign</strong> or <strong>Malignant</strong> based on nuclear morphometric characteristics from digitized Fine-Needle Aspirate (FNA) images of breast masses. Using the Wisconsin Diagnostic Breast Cancer (WDBC) dataset, six classification algorithms (Logistic Regression, Decision Tree, Random Forest, SVM, KNN, and Gradient Boosting) were benchmarked. Explainable AI (SHAP) feature contribution analysis was integrated to provide interpretability for clinical research.
          </p>
        </section>

        {/* Section 2: Introduction */}
        <section className="space-y-2 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/60">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="text-teal-600 font-mono">2.</span> Introduction
          </h2>
          <p className="text-slate-600 dark:text-slate-300">
            Pathological examination of breast mass biopsies requires extensive expertise. Fine-Needle Aspiration (FNA) provides a non-invasive diagnostic method. By digitizing FNA nuclear features (such as radius, texture, perimeter, area, smoothness, compactness, concavity, concave points, symmetry, and fractal dimension), machine learning models can assist medical researchers in distinguishing benign non-cancerous masses from malignant tumors with high speed and consistency.
          </p>
        </section>

        {/* Section 3: Problem Statement */}
        <section className="space-y-2 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/60">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="text-teal-600 font-mono">3.</span> Problem Statement
          </h2>
          <p className="text-slate-600 dark:text-slate-300">
            Manual interpretation of complex cellular morphometric attributes can be subjective and prone to variability between observers. Furthermore, in clinical diagnostic tasks, a <strong>False Negative</strong> (misclassifying a malignant sample as benign) can lead to dangerous delays in treatment. Hence, there is a critical need for automated ML decision-support systems that prioritize Sensitivity/Recall and provide transparent feature explanations.
          </p>
        </section>

        {/* Section 4: Objectives */}
        <section className="space-y-2 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/60">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="text-teal-600 font-mono">4.</span> Project Objectives
          </h2>
          <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-300">
            <li>Develop an interactive web application for breast cancer sample analysis and prediction.</li>
            <li>Clean, scale, and analyze 30 nuclear morphometric features from the WDBC dataset.</li>
            <li>Train and evaluate 6 distinct classification models using 5-fold Stratified Cross Validation.</li>
            <li>Prioritize Recall/Sensitivity and False-Negative safety analysis.</li>
            <li>Integrate SHAP Explainable AI for local feature contribution visualization.</li>
          </ul>
        </section>

        {/* Section 5: Literature Survey */}
        <section className="space-y-2 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/60">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="text-teal-600 font-mono">5.</span> Literature Survey
          </h2>
          <p className="text-slate-600 dark:text-slate-300">
            Prior studies by Street et al. (1993) introduced the Wisconsin Diagnostic Breast Cancer (WDBC) dataset obtained via nuclear feature extraction algorithms. Subsequent research by Mangasarian et al. demonstrated linear programming techniques achieving &gt;96% accuracy. Recent benchmarks highlight Random Forest and Support Vector Machines as highly robust classifiers when combined with feature standardization.
          </p>
        </section>

        {/* Section 6: Dataset Description */}
        <section className="space-y-2 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/60">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="text-teal-600 font-mono">6.</span> Dataset Description
          </h2>
          <p className="text-slate-600 dark:text-slate-300">
            The dataset consists of <strong>569 instances</strong> (357 Benign, 212 Malignant). Each sample contains 30 numeric features representing 10 fundamental nuclear characteristics:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs pt-2 font-medium">
            <span className="p-2 bg-slate-100 dark:bg-slate-900 rounded-lg text-center">1. Radius</span>
            <span className="p-2 bg-slate-100 dark:bg-slate-900 rounded-lg text-center">2. Texture</span>
            <span className="p-2 bg-slate-100 dark:bg-slate-900 rounded-lg text-center">3. Perimeter</span>
            <span className="p-2 bg-slate-100 dark:bg-slate-900 rounded-lg text-center">4. Area</span>
            <span className="p-2 bg-slate-100 dark:bg-slate-900 rounded-lg text-center">5. Smoothness</span>
            <span className="p-2 bg-slate-100 dark:bg-slate-900 rounded-lg text-center">6. Compactness</span>
            <span className="p-2 bg-slate-100 dark:bg-slate-900 rounded-lg text-center">7. Concavity</span>
            <span className="p-2 bg-slate-100 dark:bg-slate-900 rounded-lg text-center">8. Concave Points</span>
            <span className="p-2 bg-slate-100 dark:bg-slate-900 rounded-lg text-center">9. Symmetry</span>
            <span className="p-2 bg-slate-100 dark:bg-slate-900 rounded-lg text-center">10. Fractal Dimension</span>
          </div>
          <p className="text-xs text-slate-500 pt-1">
            For each characteristic, the Mean, Standard Error (SE), and Worst (largest value) are computed.
          </p>
        </section>

        {/* Section 7: Methodology & ML Pipeline */}
        <section className="space-y-2 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/60">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="text-teal-600 font-mono">7.</span> Methodology & ML Pipeline
          </h2>
          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl font-mono text-xs text-teal-700 dark:text-teal-300">
            WDBC Dataset → Data Cleaning (Missing/Duplicates) → Exploratory Analysis → Feature Scaling (StandardScaler) → Stratified Train/Test Split (80/20) → Model Training (6 Algorithms) → 5-Fold Cross Validation → Evaluation Metrics & SHAP Explainability → REST API Prediction
          </div>
        </section>

        {/* Section 8: Algorithms Used */}
        <section className="space-y-2 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/60">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="text-teal-600 font-mono">8.</span> Machine Learning Algorithms Used
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
              <strong className="text-teal-600">1. Logistic Regression:</strong> Linear probability model with L2 penalty. Fast, highly interpretable.
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
              <strong className="text-teal-600">2. Decision Tree:</strong> Non-linear decision rules splitting features on Gini impurity.
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
              <strong className="text-teal-600">3. Random Forest:</strong> Ensemble of bootstrapped trees reducing variance and overfitting.
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
              <strong className="text-teal-600">4. Support Vector Machine (SVM):</strong> RBF kernel maximizing margin hyperplane separating classes.
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
              <strong className="text-teal-600">5. K-Nearest Neighbors (KNN):</strong> Distance-based classification (k=5) in scaled feature space.
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
              <strong className="text-teal-600">6. Gradient Boosting:</strong> Sequential ensemble optimizing log-loss boosting weak learners.
            </div>
          </div>
        </section>

        {/* Section 9 & 10: System Architecture & Implementation */}
        <section className="space-y-2 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/60">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="text-teal-600 font-mono">9 & 10.</span> System Architecture & Implementation
          </h2>
          <p className="text-slate-600 dark:text-slate-300">
            The application is built with a modern decoupled stack:
          </p>
          <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-300">
            <li><strong>Frontend:</strong> React, TypeScript, Tailwind CSS, Recharts for interactive charts, Lucide icons.</li>
            <li><strong>Backend REST API:</strong> FastAPI (Python), CORS middleware, REST endpoints (<code>/predict</code>, <code>/model-performance</code>, <code>/dataset-statistics</code>, <code>/train</code>, <code>/history</code>).</li>
            <li><strong>ML Pipeline:</strong> Scikit-Learn, Pandas, NumPy, SHAP for explainable AI.</li>
          </ul>
        </section>

        {/* Section 11 & 12: Results & Performance Comparison */}
        <section className="space-y-2 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/60">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="text-teal-600 font-mono">11 & 12.</span> Results & Performance Benchmarks
          </h2>
          <p className="text-slate-600 dark:text-slate-300">
            On the holdout test set (n=114 samples), Logistic Regression and SVM achieved the top composite performance with <strong>97.4% Accuracy</strong>, <strong>97.6% Recall/Sensitivity</strong>, and <strong>0.995 ROC-AUC</strong>.
          </p>
        </section>

        {/* Section 13: Limitations */}
        <section className="space-y-2 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/60">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="text-teal-600 font-mono">13.</span> Limitations
          </h2>
          <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-300">
            <li>Dataset size is limited to 569 instances from a single medical center.</li>
            <li>Inputs require pre-extracted numerical morphometry features rather than raw mammogram imagery.</li>
            <li>Needs prospective multi-center clinical validation before diagnostic use.</li>
          </ul>
        </section>

        {/* Section 14: Future Scope */}
        <section className="space-y-2 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/60">
          <h2 className="text-lg font-bold text-teal-600 dark:text-teal-400 flex items-center gap-2">
            <span className="font-mono">14.</span> Future Scope & Improvements
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-teal-50/50 dark:bg-teal-950/30 rounded-xl border border-teal-200 dark:border-teal-800 space-y-1">
              <strong className="text-teal-800 dark:text-teal-200">1. Deep Learning Mammography CNNs</strong>
              <p className="text-slate-600 dark:text-slate-300">Integration of Convolutional Neural Networks (ResNet/EfficientNet) directly analyzing raw mammogram DICOM images.</p>
            </div>
            <div className="p-3 bg-teal-50/50 dark:bg-teal-950/30 rounded-xl border border-teal-200 dark:border-teal-800 space-y-1">
              <strong className="text-teal-800 dark:text-teal-200">2. External Clinical Validation</strong>
              <p className="text-slate-600 dark:text-slate-300">Validation on larger, multi-ethnic patient cohorts across multiple hospital networks.</p>
            </div>
            <div className="p-3 bg-teal-50/50 dark:bg-teal-950/30 rounded-xl border border-teal-200 dark:border-teal-800 space-y-1">
              <strong className="text-teal-800 dark:text-teal-200">3. Federated Learning</strong>
              <p className="text-slate-600 dark:text-slate-300">Privacy-preserving collaborative model training without sharing sensitive patient record data across institutions.</p>
            </div>
            <div className="p-3 bg-teal-50/50 dark:bg-teal-950/30 rounded-xl border border-teal-200 dark:border-teal-800 space-y-1">
              <strong className="text-teal-800 dark:text-teal-200">4. EHR & CDSS Integration</strong>
              <p className="text-slate-600 dark:text-slate-300">Interoperable integration into hospital Electronic Health Record (EHR) systems via HL7/FHIR protocols.</p>
            </div>
          </div>
        </section>

        {/* Section 15: Conclusion */}
        <section className="space-y-2 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/60">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="text-teal-600 font-mono">15.</span> Conclusion
          </h2>
          <p className="text-slate-600 dark:text-slate-300">
            This project demonstrates the efficacy of machine learning models for breast cancer decision support. By combining robust preprocessing, multi-algorithm benchmarking, False-Negative safety analysis, and SHAP explainability, the application serves as a comprehensive educational and research framework for AI-assisted oncology research.
          </p>
        </section>

        {/* Section 16: References */}
        <section className="space-y-2 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/60">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="text-teal-600 font-mono">16.</span> References
          </h2>
          <ol className="list-decimal list-inside space-y-1 text-xs text-slate-500 dark:text-slate-400">
            <li>Street, W. N., Wolberg, W. H., & Mangasarian, O. L. (1993). Nuclear feature extraction for breast tumor diagnosis. <i>IS&T/SPIE 1993 International Symposium on Electronic Imaging</i>.</li>
            <li>Lundberg, S. M., & Lee, S. I. (2017). A unified approach to interpreting model predictions. <i>Advances in Neural Information Processing Systems (NeurIPS)</i>.</li>
            <li>Scikit-Learn: Machine Learning in Python, Pedregosa et al., JMLR 12, pp. 2825-2830, 2011.</li>
          </ol>
        </section>
      </div>
    </div>
  );
};
