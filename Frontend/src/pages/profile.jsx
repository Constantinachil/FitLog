import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../components/authcontext";
import "../styles/profile.css";

export default function ProfilePage() {
  const { token } = useAuth();

  const [profile, setProfile] = useState(null);
  const [bio, setBio] = useState("");
  const [editingBio, setEditingBio] = useState(false);
  const [achievements, setAchievements] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);

  // avatar state
  const [avatarKey, setAvatarKey] = useState("avatar_guest");
  const [avatar, setAvatar] = useState(localStorage.getItem("avatar_guest") || null);

  // Fetch profile (username + bio)
  useEffect(() => {
    if (!token) return;
    axios
      .get("http://localhost:5000/api/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setProfile(res.data);
        setBio(res.data.bio || "");
      })
      .catch((err) => console.error("❌ Error fetching profile:", err));
  }, [token]);

  // When profile is loaded, set avatarKey based on user id
  useEffect(() => {
    if (profile?.id) {
      const key = `avatar_${profile.id}`;
      setAvatarKey(key);
      setAvatar(localStorage.getItem(key) || null);
    }
  }, [profile]);

  // Fetch unlocked achievements
  useEffect(() => {
    if (!token) return;
    axios
      .get("http://localhost:5000/api/achievements/me/unlocked", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setAchievements(res.data))
      .catch((err) => console.error("❌ Error fetching achievements:", err));
  }, [token]);

  // Fetch leaderboard (login streaks)
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/users/leaderboard")
      .then((res) => setLeaderboard(res.data))
      .catch((err) => console.error("❌ Error fetching leaderboard:", err));
  }, []);

  // Change avatar (stored per-user in localStorage)
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
        localStorage.setItem(avatarKey, reader.result); // ✅ per-user key
      };
      reader.readAsDataURL(file);
    }
  };

  // Save bio to backend
  const saveBio = () => {
    axios
      .put(
        "http://localhost:5000/api/users/profile",
        { bio },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => setEditingBio(false))
      .catch((err) => console.error("❌ Error saving bio:", err));
  };

  return (
    <div className="profile-page">
      <div className="profile-container">

        {/* Header */}
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
          <h2>{profile?.username || "Unnamed User"}</h2>
        </div>

        {/* Bio */}
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

        {/* Achievements */}
        <div className="achievements-section">
          <h3>🏆 Achievements</h3>
          {achievements.length === 0 ? (
            <p>No achievements unlocked yet.</p>
          ) : (
            <div className="achievements-grid">
              {achievements.map((ach) => (
                <div key={ach.id} className="achievement earned" title={ach.description}>
                  {ach.name}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Leaderboard */}
        <div className="leaderboard-section">
          <h3>📊 Leaderboard (by streak)</h3>
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Login Streak</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry) => (
                <tr
                  key={entry.id}
                  className={entry.username === profile?.username ? "highlight" : ""}
                >
                  <td>{entry.username}</td>
                  <td>{entry.loginStreak}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
