import React, { useState } from 'react';
import { 
  Database, 
  Search, 
  ExternalLink, 
  Filter, 
  GitBranch,
  CheckCircle2,
  Lock
} from 'lucide-react';

interface DatasetCard {
  id: string;
  name: string;
  disease: 'Diabetes' | 'Cardiovascular' | 'CKD' | 'COPD' | 'Oncology';
  source: string;
  records: string;
  features: number;
  years: string;
  url: string;
  description: string;
  privacyLevel: 'Anonymized' | 'De-identified' | 'Synthetic';
}

const datasets: DatasetCard[] = [
  // Diabetes datasets
  {
    id: 'pima-diabetes',
    name: 'Pima Indians Diabetes Dataset',
    disease: 'Diabetes',
    source: 'National Institute of Diabetes & NIDDK',
    records: '768',
    features: 8,
    years: '1990',
    url: 'https://www.kaggle.com/datasets/uciml/pima-indians-diabetes-database',
    description: 'Classic benchmark dataset for diabetes prediction. Features include glucose, BMI, insulin, and age.',
    privacyLevel: 'Anonymized'
  },
  {
    id: 'diabetes-130-us',
    name: 'Diabetes 130-US Hospitals Dataset',
    disease: 'Diabetes',
    source: 'UCI / Health Facts Database',
    records: '101,766',
    features: 50,
    years: '1999-2008',
    url: 'https://archive.ics.uci.edu/dataset/296/diabetes+130-us+hospitals+for+years+1999-2008',
    description: 'Large-scale clinical dataset from 130 US hospitals with readmission outcomes.',
    privacyLevel: 'De-identified'
  },
  {
    id: 'uk-biobank-diabetes',
    name: 'UK Biobank Diabetes Cohort',
    disease: 'Diabetes',
    source: 'UK Biobank',
    records: '502,000',
    features: 2500,
    years: '2006-2022',
    url: 'https://www.ukbiobank.ac.uk/',
    description: 'Massive population-level genetic + clinical diabetes dataset. Requires application.',
    privacyLevel: 'De-identified'
  },
  // Cardiovascular datasets
  {
    id: 'framingham',
    name: 'Framingham Heart Study',
    disease: 'Cardiovascular',
    source: 'Framingham / NIH NHLBI',
    records: '15,000',
    features: 39,
    years: '1948-2020',
    url: 'https://www.kaggle.com/datasets/dileep070/heart-disease-prediction-using-logistic-regression',
    description: 'Gold-standard longitudinal cardiovascular risk prediction dataset across 3 generations.',
    privacyLevel: 'Anonymized'
  },
  {
    id: 'cleveland',
    name: 'Cleveland Heart Disease Dataset',
    disease: 'Cardiovascular',
    source: 'UCI / Cleveland Clinic',
    records: '303',
    features: 14,
    years: '1988',
    url: 'https://archive.ics.uci.edu/dataset/45/heart+disease',
    description: 'Most-cited heart disease dataset. Used in 1000+ ML papers on cardiovascular prediction.',
    privacyLevel: 'Anonymized'
  },
  {
    id: 'mimic-iii-cvd',
    name: 'MIMIC-III Cardiovascular ICU Cohort',
    disease: 'Cardiovascular',
    source: 'MIT PhysioNet / MIMIC-III',
    records: '46,520',
    features: 200,
    years: '2001-2012',
    url: 'https://physionet.org/content/mimiciii/',
    description: 'Rich ICU cardiac patient records including waveforms, labs, and medications.',
    privacyLevel: 'De-identified'
  },
  // CKD datasets
  {
    id: 'ckd-uci',
    name: 'Chronic Kidney Disease Dataset',
    disease: 'CKD',
    source: 'UCI / Apollo Hospitals',
    records: '400',
    features: 25,
    years: '2015',
    url: 'https://archive.ics.uci.edu/dataset/336/chronic+kidney+disease',
    description: 'Clinical CKD classification dataset with serum creatinine, eGFR, and hemoglobin.',
    privacyLevel: 'Anonymized'
  },
  {
    id: 'nhanes-ckd',
    name: 'NHANES CKD Epidemiology Dataset',
    disease: 'CKD',
    source: 'CDC National Health and Nutrition Examination Survey',
    records: '40,000',
    features: 400,
    years: '1999-2020',
    url: 'https://www.cdc.gov/nchs/nhanes/index.htm',
    description: 'US-population representative CKD prevalence dataset with extensive lab panels.',
    privacyLevel: 'De-identified'
  },
  // COPD datasets
  {
    id: 'copd-gene',
    name: 'COPDGene Study Dataset',
    disease: 'COPD',
    source: 'COPDGene / NHLBI',
    records: '10,200',
    features: 90,
    years: '2008-2022',
    url: 'https://www.kaggle.com/datasets/paultimothymooney/chest-xray-pneumonia',
    description: 'Multi-center imaging + genetic COPD study with CT quantification.',
    privacyLevel: 'De-identified'
  },
  {
    id: 'spirometry-cohort',
    name: 'Spirometry COPD Prediction Cohort',
    disease: 'COPD',
    source: 'MECOR / Global Lung Initiative',
    records: '25,000',
    features: 12,
    years: '2015-2020',
    url: 'https://www.kaggle.com/datasets/andrewmvd/spirometry-dataset',
    description: 'Spirometry-focused COPD dataset ideal for FEV1% and exacerbation prediction.',
    privacyLevel: 'Anonymized'
  },
  // Oncology datasets
  {
    id: 'tcga-breast',
    name: 'TCGA Breast Cancer (BRCA)',
    disease: 'Oncology',
    source: 'NCI / TCGA',
    records: '1,098',
    features: 20530,
    years: '2006-2018',
    url: 'https://portal.gdc.cancer.gov/projects/TCGA-BRCA',
    description: 'Genomic + clinical dataset for breast cancer recurrence prediction.',
    privacyLevel: 'De-identified'
  },
  {
    id: 'seer-oncology',
    name: 'SEER Oncology Registry',
    disease: 'Oncology',
    source: 'NCI SEER Program',
    records: '3,500,000',
    features: 35,
    years: '1975-2020',
    url: 'https://seer.cancer.gov/',
    description: 'Largest US cancer registry. Used for population-level survival + recurrence analysis.',
    privacyLevel: 'De-identified'
  },
  {
    id: 'wisconsin-bc',
    name: 'Wisconsin Breast Cancer Dataset',
    disease: 'Oncology',
    source: 'University of Wisconsin / UCI',
    records: '569',
    features: 30,
    years: '1995',
    url: 'https://archive.ics.uci.edu/dataset/17/breast+cancer+wisconsin+diagnostic',
    description: 'Classic ML benchmark for breast tumor classification using cytology features.',
    privacyLevel: 'Anonymized'
  }
];

export const DatasetsDashboard: React.FC = () => {
  const [search, setSearch] = useState('');
  const [filterDisease, setFilterDisease] = useState<string>('All');

  const filtered = datasets.filter(ds => {
    const matchesSearch = ds.name.toLowerCase().includes(search.toLowerCase()) ||
      ds.source.toLowerCase().includes(search.toLowerCase());
    const matchesDisease = filterDisease === 'All' || ds.disease === filterDisease;
    return matchesSearch && matchesDisease;
  });

  const totalRecords = datasets.reduce((acc, ds) => acc + parseInt(ds.records.replace(/,/g, '')), 0);
  const diseaseBreakdown = {
    Diabetes: datasets.filter(d => d.disease === 'Diabetes').length,
    Cardiovascular: datasets.filter(d => d.disease === 'Cardiovascular').length,
    CKD: datasets.filter(d => d.disease === 'CKD').length,
    COPD: datasets.filter(d => d.disease === 'COPD').length,
    Oncology: datasets.filter(d => d.disease === 'Oncology').length
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      
      {/* Header */}
      <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800/80 rounded-3xl p-8 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-extrabold text-white flex items-center gap-2.5 tracking-tight">
              <Database className="w-6 h-6 text-cyan-400" />
              Clinical Datasets Repository
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Curated collection of open-source and de-identified clinical datasets compatible with FedHealth AI federated training pipelines. All datasets listed here are publicly accessible or available through standard research agreements.
            </p>
          </div>
          <div className="flex items-center space-x-3 bg-slate-950/80 px-4 py-3 rounded-2xl border border-slate-800 shadow-inner">
            <GitBranch className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono text-slate-300 font-bold">{datasets.length} Datasets</span>
            <span className="text-slate-500">|</span>
            <span className="text-xs font-mono text-cyan-400 font-bold">{totalRecords.toLocaleString()} Total Records</span>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 pt-6 mt-4 border-t border-slate-800/80">
          {['Diabetes', 'Cardiovascular', 'CKD', 'COPD', 'Oncology'].map(d => (
            <button
              key={d}
              onClick={() => setFilterDisease(d === filterDisease ? 'All' : d)}
              className={`p-4 rounded-2xl border transition-all text-left ${
                filterDisease === d
                  ? 'bg-cyan-500/20 border-cyan-400 shadow-lg shadow-cyan-500/10'
                  : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="text-xs font-extrabold text-slate-300">{d}</div>
              <div className="text-2xl font-extrabold text-white mt-1">
                {diseaseBreakdown[d as keyof typeof diseaseBreakdown]}
              </div>
              <div className="text-[10px] text-slate-400 font-mono mt-0.5">datasets</div>
            </button>
          ))}
        </div>
      </div>

      {/* Search + Filter Bar */}
      <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800/80 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4 shadow-xl">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search datasets by name, source, or disease keywords..."
            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-white text-xs font-medium focus:outline-none focus:border-cyan-500 shadow-inner"
          />
        </div>
        <div className="flex items-center space-x-3 shrink-0">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-bold text-slate-300">
            Showing <strong className="text-cyan-400">{filtered.length}</strong> of {datasets.length} datasets
          </span>
        </div>
      </div>

      {/* Datasets Table */}
      <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800/80 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto max-h-[650px] scrollbar-thin scrollbar-thumb-slate-800">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-slate-950/90 text-slate-400 sticky top-0 z-10 font-sans shadow-md">
              <tr>
                <th className="p-4 font-extrabold">Dataset Name</th>
                <th className="p-4 font-extrabold">Disease</th>
                <th className="p-4 font-extrabold">Source</th>
                <th className="p-4 font-extrabold">Records</th>
                <th className="p-4 font-extrabold">Features</th>
                <th className="p-4 font-extrabold">Years</th>
                <th className="p-4 font-extrabold">Privacy</th>
                <th className="p-4 font-extrabold">Link</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300 font-mono">
              {filtered.map((ds) => (
                <tr key={ds.id} className="hover:bg-slate-900/40 transition-colors group">
                  <td className="p-4">
                    <div className="font-bold text-white font-sans text-sm tracking-tight">{ds.name}</div>
                    <div className="text-[11px] text-slate-400 font-sans mt-1 leading-relaxed max-w-md">{ds.description}</div>
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <span className={`px-3 py-1.5 rounded-xl font-sans font-bold text-[10px] shadow-sm ${
                      ds.disease === 'Diabetes' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' :
                      ds.disease === 'Cardiovascular' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                      ds.disease === 'CKD' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                      ds.disease === 'COPD' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                      'bg-red-500/20 text-red-300 border border-red-500/30'
                    }`}>
                      {ds.disease}
                    </span>
                  </td>
                  <td className="p-4 text-slate-300 font-sans text-xs leading-tight max-w-[180px]">{ds.source}</td>
                  <td className="p-4 font-bold text-white">{ds.records}</td>
                  <td className="p-4">{ds.features}</td>
                  <td className="p-4 text-slate-400">{ds.years}</td>
                  <td className="p-4">
                    <span className={`flex items-center gap-1.5 font-sans font-bold text-[10px] ${
                      ds.privacyLevel === 'Anonymized' ? 'text-emerald-400' :
                      ds.privacyLevel === 'De-identified' ? 'text-cyan-400' :
                      'text-amber-400'
                    }`}>
                      <Lock className="w-3.5 h-3.5" /> {ds.privacyLevel}
                    </span>
                  </td>
                  <td className="p-4">
                    <a
                      href={ds.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm whitespace-nowrap"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>View Source</span>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dataset Compatibility Note */}
      <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-6 shadow-inner">
        <div className="flex items-center gap-3 border-b border-slate-800/80 pb-4 mb-4">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <h4 className="text-sm font-extrabold text-white tracking-tight">FedHealth AI Dataset Compatibility</h4>
            <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
              All listed datasets are compatible with the FedHealth AI federated training architecture. When uploaded into a clinical enclave, the platform automatically normalizes feature vectors, applies differential privacy (ε-controlled), and trains models without ever exposing the raw data to the central server.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 shadow-inner">
            <div className="text-xs font-extrabold text-cyan-400">Step 1: Upload</div>
            <div className="text-xs text-slate-400 mt-1 leading-relaxed">Import any clinical CSV or JSON dataset into a secure hospital enclave via the Federated Nodes tab.</div>
          </div>
          <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 shadow-inner">
            <div className="text-xs font-extrabold text-purple-400">Step 2: Federated Train</div>
            <div className="text-xs text-slate-400 mt-1 leading-relaxed">Train local neural network models inside each enclave with SGD + FedProx optimization.</div>
          </div>
          <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 shadow-inner">
            <div className="text-xs font-extrabold text-emerald-400">Step 3: SHAP Evaluated</div>
            <div className="text-xs text-slate-400 mt-1 leading-relaxed">Global model is evaluated with SHAP explainability for transparent clinical trust.</div>
          </div>
        </div>
      </div>

    </div>
  );
};