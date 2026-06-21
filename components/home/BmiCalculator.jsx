'use client';

import { useState } from 'react';

export default function BmiCalculator() {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [result, setResult] = useState(null);

  const categories = [
    { color: 'bg-blue-400', label: 'Below 18.5 — Underweight' },
    { color: 'bg-lime', label: '18.5 – 24.9 — Normal Weight' },
    { color: 'bg-yellow-400', label: '25.0 – 29.9 — Overweight' },
    { color: 'bg-red-500', label: '30.0 and above — Obese' },
  ];

  const calculateBmi = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height) / 100;
    if (!w || !h) return;

    const bmi = w / (h * h);
    let category = 'Normal Weight';
    if (bmi < 18.5) category = 'Underweight';
    else if (bmi >= 25 && bmi < 30) category = 'Overweight';
    else if (bmi >= 30) category = 'Obese';

    setResult({ bmi: bmi.toFixed(1), category });
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
      <div>
        <p className="text-lime text-xs font-bold tracking-widest mb-3">HEALTH TOOLS</p>
        <h2 className="text-4xl font-extrabold mb-4 leading-tight">
          Calculate Your BMI Instantly
        </h2>
        <p className="text-gray-500 mb-6 leading-relaxed">
          Use our Body Mass Index calculator to understand where you stand on your fitness
          journey. Know your baseline and let IronPulse trainers help you achieve your ideal
          body composition.
        </p>
        <ul className="space-y-2">
          {categories.map((c) => (
            <li key={c.label} className="flex items-center gap-3 text-sm text-gray-400">
              <span className={`w-2.5 h-2.5 rounded-full ${c.color}`} />
              {c.label}
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-surface border border-border rounded-2xl p-8">
        <div className="grid grid-cols-2 gap-4 mb-5">
          <div>
            <label className="text-xs text-gray-400 font-bold tracking-wide">WEIGHT (KG)</label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="e.g. 75"
              className="w-full mt-2 bg-bg border border-border rounded-lg px-4 py-3 outline-none focus:border-lime"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400 font-bold tracking-wide">HEIGHT (CM)</label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="e.g. 170"
              className="w-full mt-2 bg-bg border border-border rounded-lg px-4 py-3 outline-none focus:border-lime"
            />
          </div>
        </div>

        <button
          onClick={calculateBmi}
          className="w-full py-3 rounded-lg bg-lime text-bg font-bold hover:bg-limeDark transition"
        >
          Calculate BMI
        </button>

        {result && (
          <div className="mt-5 text-center bg-bg border border-border rounded-lg py-4">
            <p className="text-3xl font-extrabold text-lime">{result.bmi}</p>
            <p className="text-sm text-gray-400 mt-1">{result.category}</p>
          </div>
        )}
      </div>
    </section>
  );
}
