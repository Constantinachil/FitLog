import React, { useMemo, useState } from "react";
import "../styles/calculator.css";

const ACTIVITY_LEVELS = [
  { key: "sedentary", label: "Sedentary (little or no exercise)", factor: 1.2 },
  { key: "light", label: "Light (1–3 days/week)", factor: 1.375 },
  { key: "moderate", label: "Moderate (3–5 days/week)", factor: 1.55 },
  { key: "very", label: "Very Active (6–7 days/week)", factor: 1.725 },
  { key: "extra", label: "Extra Active (heavy labor/2x day)", factor: 1.9 },
];

const lbToKg = (lb) => (Number(lb) || 0) * 0.45359237;
const kgToLb = (kg) => (Number(kg) || 0) / 0.45359237;
const inToCm = (i) => (Number(i) || 0) * 2.54;
const ftInToCm = (ft, inch) => (Number(ft) || 0) * 30.48 + (Number(inch) || 0) * 2.54;

function mifflinStJeorBMR({ gender, kg, cm, age }) {
  if (!kg || !cm || !age) return 0;
  const base = 10 * kg + 6.25 * cm - 5 * age;
  return Math.round(base + (gender === "male" ? 5 : -161));
}

function katchMcArdleBMR({ kg, bodyFatPct }) {
  if (!kg || !bodyFatPct) return 0;
  const leanMassKg = kg * (1 - bodyFatPct / 100);
  return Math.round(370 + 21.6 * leanMassKg);
}

function clamp(n, min, max) {
  return Math.min(Math.max(n, min), max);
}

function macrosFromCalories({ calories, kg, proteinPerKg = 1.8, fatPercent = 0.25 }) {
  const cal = Math.max(0, Number(calories) || 0);
  const protGr = Math.max(0, proteinPerKg * Math.max(kg, 0));
  let protCal = protGr * 4;

  let fatCal = clamp(fatPercent, 0.15, 0.40) * cal;
  let carbsCal = cal - protCal - fatCal;

 
  if (carbsCal < 0) {
    const newProtCal = Math.max(cal * 0.25, cal - fatCal - cal * 0.10);
    protCal = clamp(newProtCal, 0, protCal);
    carbsCal = cal - protCal - fatCal;
  }
  if (carbsCal < 0) {
    fatCal = Math.max(cal * 0.20, cal - protCal - cal * 0.05);
    carbsCal = cal - protCal - fatCal;
  }

  const protein = +(protCal / 4).toFixed(0);
  const fat = +(fatCal / 9).toFixed(0);
  const carbs = +(Math.max(0, carbsCal) / 4).toFixed(0);

  return { protein, fat, carbs };
}

export default function CalculatorPage() {
  const [unit, setUnit] = useState("metric"); 
  const [gender, setGender] = useState("male");
  const [age, setAge] = useState(25);

  const [cm, setCm] = useState(175);
  const [kg, setKg] = useState(70);

  const [ft, setFt] = useState(5);
  const [inch, setInch] = useState(9);
  const [lb, setLb] = useState(154);

  const [bodyFatPct, setBodyFatPct] = useState("");
  const [activityKey, setActivityKey] = useState("moderate");
  const activity = ACTIVITY_LEVELS.find((a) => a.key === activityKey) || ACTIVITY_LEVELS[2];

  const normKg = useMemo(() => (unit === "metric" ? Number(kg) : lbToKg(lb)), [unit, kg, lb]);
  const normCm = useMemo(() => (unit === "metric" ? Number(cm) : ftInToCm(ft, inch)), [unit, cm, ft, inch]);

  const bmr = useMemo(() => {
    const bf = Number(bodyFatPct);
    if (bf && bf > 0) {
      return katchMcArdleBMR({ kg: normKg, bodyFatPct: bf });
    }
    return mifflinStJeorBMR({ gender, kg: normKg, cm: normCm, age: Number(age) });
  }, [gender, normKg, normCm, age, bodyFatPct]);

  const tdee = useMemo(() => Math.round(bmr * activity.factor), [bmr, activity.factor]);

  const goals = useMemo(() => {
    const defs = [
      { key: "maintain", label: "Maintain", factor: 1.0 },
      { key: "mildCut", label: "Mild Cut (-10%)", factor: 0.90 },
      { key: "cut", label: "Cut (-20%)", factor: 0.80 },
      { key: "bulkLight", label: "Lean Bulk (+10%)", factor: 1.10 },
      { key: "bulk", label: "Bulk (+20%)", factor: 1.20 },
    ];
    return defs.map((g) => {
      const calories = Math.round(tdee * g.factor);
      const macros = macrosFromCalories({ calories, kg: normKg });
      return { ...g, calories, macros };
    });
  }, [tdee, normKg]);

  return (
    <div className="calc-page">
      <div className="calc-card">
        <h2 className="calc-title">🍽️ Calorie & Macro Calculator</h2>

        <form className="calc-form" onSubmit={(e) => e.preventDefault()}>
          <div className="grid two">
            <label className="field">
              <span>Units</span>
              <div className="segmented">
                <button
                  type="button"
                  className={unit === "metric" ? "active" : ""}
                  onClick={() => setUnit("metric")}
                >
                  Metric (kg, cm)
                </button>
                <button
                  type="button"
                  className={unit === "imperial" ? "active" : ""}
                  onClick={() => setUnit("imperial")}
                >
                  Imperial (lb, ft/in)
                </button>
              </div>
            </label>

            <label className="field">
              <span>Gender</span>
              <select value={gender} onChange={(e) => setGender(e.target.value)}>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </label>
          </div>

          <div className="grid three">
            <label className="field">
              <span>Age</span>
              <input type="number" min="10" max="100" value={age} onChange={(e) => setAge(e.target.value)} />
            </label>

            {unit === "metric" ? (
              <>
                <label className="field">
                  <span>Height (cm)</span>
                  <input type="number" min="100" max="250" value={cm} onChange={(e) => setCm(e.target.value)} />
                </label>
                <label className="field">
                  <span>Weight (kg)</span>
                  <input type="number" min="30" max="300" value={kg} onChange={(e) => setKg(e.target.value)} />
                </label>
              </>
            ) : (
              <>
                <label className="field">
                  <span>Height (ft/in)</span>
                  <div className="inline">
                    <input type="number" min="3" max="8" value={ft} onChange={(e) => setFt(e.target.value)} />
                    <span>ft</span>
                    <input type="number" min="0" max="11" value={inch} onChange={(e) => setInch(e.target.value)} />
                    <span>in</span>
                  </div>
                </label>
                <label className="field">
                  <span>Weight (lb)</span>
                  <input type="number" min="70" max="660" value={lb} onChange={(e) => setLb(e.target.value)} />
                </label>
                <div />
              </>
            )}
          </div>

          <div className="grid two">
            <label className="field">
              <span>Body Fat % (optional)</span>
              <input
                type="number"
                min="3"
                max="60"
                step="0.1"
                value={bodyFatPct}
                onChange={(e) => setBodyFatPct(e.target.value)}
                placeholder="e.g. 18"
              />
              <small>When provided, Katch–McArdle formula is used.</small>
            </label>

            <label className="field">
              <span>Activity Level</span>
              <select value={activityKey} onChange={(e) => setActivityKey(e.target.value)}>
                {ACTIVITY_LEVELS.map((a) => (
                  <option key={a.key} value={a.key}>
                    {a.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </form>

        <div className="results">
          <div className="stat">
            <div className="stat-label">BMR</div>
            <div className="stat-value">{bmr ? `${bmr.toLocaleString()} kcal/day` : "—"}</div>
            <div className="stat-sub">
              {bodyFatPct ? "Katch–McArdle (uses body fat %)" : "Mifflin–St Jeor"}
            </div>
          </div>

          <div className="stat">
            <div className="stat-label">TDEE</div>
            <div className="stat-value">{tdee ? `${tdee.toLocaleString()} kcal/day` : "—"}</div>
            <div className="stat-sub">{activity.label}</div>
          </div>
        </div>

        <h3 className="section-title">Daily Targets</h3>
        <div className="table-wrap">
          <table className="goal-table">
            <thead>
              <tr>
                <th>Goal</th>
                <th>Calories</th>
                <th>Protein (g)</th>
                <th>Carbs (g)</th>
                <th>Fat (g)</th>
              </tr>
            </thead>
            <tbody>
              {goals.map((g) => (
                <tr key={g.key}>
                  <td>{g.label}</td>
                  <td>{g.calories.toLocaleString()}</td>
                  <td>{g.macros.protein}</td>
                  <td>{g.macros.carbs}</td>
                  <td>{g.macros.fat}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="disclaimer">
          ⚠️ This tool provides estimates for educational use and doesn’t replace medical advice. Adjust based on your
          progress and how you feel.
        </p>
      </div>
    </div>
  );
}