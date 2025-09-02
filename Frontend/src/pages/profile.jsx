import React, { useState } from "react";
import "../styles/profile.css";
import { useAuth } from "../components/authcontext";

export default function ProfilePage() {
  const { user } = useAuth();

  const [avatar, setAvatar] = useState(localStorage.getItem("avatar") || null);
  const [bio, setBio] = useState(localStorage.getItem("bio") || "");
  const [editingBio, setEditingBio] = useState(false);

  const [achievements] = useState([
    { id: 1, name: "First Login", earned: true },
    { id: 2, name: "1 Week Streak", earned: false },
    { id: 3, name: "First Program Created", earned: true },
    { id: 4, name: "10 Workouts Completed", earned: false },
    { id: 5, name: "First Favorite Added", earned: true },
  ]);

  const [favorites] = useState({
    exercises: ["Push Ups", "Deadlift"],
    programs: ["Full Body Beginner", "Strength Split"],
  });

  const [leaderboard] = useState([
    { username: "Alice", achievements: 5 },
    { username: "Bob", achievements: 3 },
    { username: "You", achievements: 2 },
  ]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
        localStorage.setItem("avatar", reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveBio = () => {
    localStorage.setItem("bio", bio);
    setEditingBio(false);
  };

  return (
    <div className="profile-page">
      <div className="profile-container">

        <div className="profile-header">
          <label htmlFor="avatar-upload">
            <img
              src={avatar || "https://via.placeholder.com/150"}
              alt="Avatar"
              className="avatar"
            />
          </label>
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            style={{ display: "none" }}
          />
          <h2>{user || "Unnamed User"}</h2>
        </div>

        <div className="bio-section">
          <h3>📝 Bio</h3>
          {editingBio ? (
            <div className="bio-edit">
              <textarea value={bio} onChange={(e) => setBio(e.target.value)} />
              <button onClick={saveBio}>Save</button>
              <button onClick={() => setEditingBio(false)}>Cancel</button>
            </div>
          ) : (
            <div>
              <p>{bio || "No bio yet. Write something about yourself!"}</p>
              <button className="edit-bio-btn" onClick={() => setEditingBio(true)}>
                Edit Bio
              </button>
            </div>
          )}
        </div>

        <div className="achievements-section">
          <h3>🏆 Achievements</h3>
          <div className="achievements-grid">
            {achievements.map((ach) => (
              <div
                key={ach.id}
                className={`achievement ${ach.earned ? "earned" : "locked"}`}
              >
                {ach.name}
              </div>
            ))}
          </div>
        </div>

        <div className="favorites-section">
          <h3>⭐ Favorites</h3>
          <div className="favorites">
            <div>
              <h4>Exercises</h4>
              <ul>
                {favorites.exercises.map((ex, i) => (
                  <li key={i}>{ex}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4>Programs</h4>
              <ul>
                {favorites.programs.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="leaderboard-section">
          <h3>📊 Leaderboard</h3>
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Achievements</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry, i) => (
                <tr
                  key={i}
                  className={entry.username === (user || "You") ? "highlight" : ""}
                >
                  <td>{entry.username}</td>
                  <td>{entry.achievements}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}