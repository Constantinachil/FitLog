import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../styles/DefaultProgramsPage.css";

export default function DefaultProgramsPage() {
  const [programs, setPrograms] = useState([]);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const res = await axios.get("/api/default-programs");
        setPrograms(res.data);
      } catch (err) {
        console.error("Error fetching programs:", err);
      }
    };
    fetchPrograms();
  }, []);

  const groupedPrograms = programs.reduce((groups, program) => {
    const { difficulty } = program;
    if (!groups[difficulty]) groups[difficulty] = [];
    groups[difficulty].push(program);
    return groups;
  }, {});

  return (
    <div className="default-programs-page">
      <h2>🏋️‍♂️ Default Programs</h2>
      <div className="programs-container">
        {["Beginner", "Intermediate", "Advanced"].map((level) => (
          <div key={level} className="program-group">
            <h3>{level}</h3>
            <ul>
              {groupedPrograms[level]?.map((program) => (
                <li key={program.id}>
                  <Link to={`/default-programs/${program.id}`}>
                    {program.name}
                  </Link>
                </li>
              )) || <p>No programs yet.</p>}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
