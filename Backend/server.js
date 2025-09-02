const express = require('express');
const dotenv = require('dotenv');
const { sequelize } = require('./models');
const userRoutes = require('./routes/userRoutes');
const securityQuestionRoutes = require('./routes/securityQuestionRoutes');
const programRoutes = require('./routes/programRoutes');
const exerciseRoutes = require('./routes/exerciseRoutes');
const stickyNoteRoutes = require("./routes/stickyNoteRoutes");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/programs', programRoutes);
app.use('/api/security-questions', securityQuestionRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use("/api/stickynotes", stickyNoteRoutes);


// Middleware to protect routes

sequelize.authenticate()
  .then(() => {
    console.log('MySQL connected');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Unable to connect to DB:', err);
  });
// server.js