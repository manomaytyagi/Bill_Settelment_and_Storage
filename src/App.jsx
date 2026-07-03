import { useState } from 'react';

const PROJECTS = ['Formula Bharat', 'SandRover', 'Miscellaneous'];

function FileField({ label, file, onChange, required }) {
  const inputId = `file-${label.replace(/\s+/g, '-').toLowerCase()}`;

  return (
    <div>
      <label htmlFor={inputId} className="text-sm font-medium text-slate-700">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      <label
        htmlFor={inputId}
        className={`mt-1.5 flex items-center justify-between gap-3 rounded-lg border px-3 py-2.5 cursor-pointer transition-colors ${
          file
            ? 'border-emerald-300 bg-emerald-50'
            : 'border-slate-300 bg-slate-50 hover:bg-slate-100'
        }`}
      >
        <span className="flex items-center gap-2 min-w-0">
          {file ? (
            <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 16V4m0 0L8 8m4-4l4 4M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
            </svg>
          )}
          <span className={`text-sm truncate ${file ? 'text-emerald-700 font-medium' : 'text-slate-500'}`}>
            {file ? file.name : 'Choose a file'}
          </span>
        </span>
        <span className="text-xs font-medium text-indigo-600 shrink-0">
          {file ? 'Replace' : 'Browse'}
        </span>
      </label>
      <input id={inputId} type="file" className="hidden" onChange={onChange} />
    </div>
  );
}

export default function App() {
  const [project, setProject] = useState('');
  const [vendor, setVendor] = useState('');
  const [proof, setProof] = useState(null);
  const [bill, setBill] = useState(null);
  const [amount, setAmount] = useState('');
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');

  function validate() {
    const next = {};
    if (!project) next.project = 'Select a project';
    if (!vendor.trim()) next.vendor = 'Enter a vendor name';
    if (!amount || Number(amount) <= 0) next.amount = 'Enter an amount greater than 0';
    if (!bill) next.bill = 'Attach the bill';
    if (!proof) next.proof = 'Attach proof of payment';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function resetForm() {
    setProject('');
    setVendor('');
    setProof(null);
    setBill(null);
    setAmount('');
    setErrors({});
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    const formData = new FormData();
    formData.append("project", project);
    formData.append("vendor", vendor);
    formData.append("amount", amount);
    formData.append("proof", proof);
    formData.append("bill", bill);

    setStatus('submitting');
    console.log({ project, vendor, proof, bill, amount });
    const response = await fetch("http://localhost:8000/submit", {
      method: "POST",
      body: formData,
    });
    setStatus("success");
    resetForm();
  }

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col justify-center items-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <p className="text-xs font-semibold tracking-wide text-indigo-600 uppercase mb-1">
            Reimbursement
          </p>
          <h1 className="text-2xl font-bold text-slate-800">Bill Submission Form</h1>
          <p className="text-sm text-slate-500 mt-1">
            Submit a vendor bill along with proof of payment for approval.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="bg-white shadow-sm border border-slate-200 rounded-2xl p-7 flex flex-col gap-5"
        >
          {/* Project */}
          <div>
            <label className="text-sm font-medium text-slate-700">
              Project <span className="text-rose-500">*</span>
            </label>
            <select
              value={project}
              onChange={(e) => setProject(e.target.value)}
              className={`mt-1.5 w-full rounded-lg border px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200 ${
                errors.project ? 'border-rose-400' : 'border-slate-300'
              }`}
            >
              <option value="">Select a project</option>
              {PROJECTS.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            {errors.project && <p className="text-xs text-rose-500 mt-1">{errors.project}</p>}
          </div>

          {/* Vendor */}
          <div>
            <label className="text-sm font-medium text-slate-700">
              Vendor <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Reliance Digital"
              value={vendor}
              onChange={(e) => setVendor(e.target.value)}
              className={`mt-1.5 w-full rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 ${
                errors.vendor ? 'border-rose-400' : 'border-slate-300'
              }`}
            />
            {errors.vendor && <p className="text-xs text-rose-500 mt-1">{errors.vendor}</p>}
          </div>

          {/* Amount */}
          <div>
            <label className="text-sm font-medium text-slate-700">
              Amount <span className="text-rose-500">*</span>
            </label>
            <div className={`mt-1.5 flex items-center rounded-lg border overflow-hidden focus-within:ring-2 focus-within:ring-indigo-200 ${
              errors.amount ? 'border-rose-400' : 'border-slate-300'
            }`}>
              <span className="px-3 text-sm text-slate-400 bg-slate-50 h-full flex items-center border-r border-slate-300 py-2.5">₹</span>
              <input
                type="number"
                min="0"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-2.5 text-sm focus:outline-none"
              />
            </div>
            {errors.amount && <p className="text-xs text-rose-500 mt-1">{errors.amount}</p>}
          </div>

          {/* Files */}
          <FileField label="Bill" file={bill} required onChange={(e) => setBill(e.target.files[0] ?? null)} />
          {errors.bill && <p className="text-xs text-rose-500 -mt-3">{errors.bill}</p>}

          <FileField label="Proof of Payment" file={proof} required onChange={(e) => setProof(e.target.files[0] ?? null)} />
          {errors.proof && <p className="text-xs text-rose-500 -mt-3">{errors.proof}</p>}

          <button
            type="submit"
            disabled={status !== 'idle'}
            className={`w-full py-2.5 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2 ${
              status === 'success'
                ? 'bg-emerald-600 text-white'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-70'
            }`}
          >
            {status === 'submitting' && (
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
            )}
            {status === 'success' ? 'Submitted ✓' : status === 'submitting' ? 'Submitting…' : 'Submit Bill'}
          </button>
        </form>
      </div>
    </div>
  );
}