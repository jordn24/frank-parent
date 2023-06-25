const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  user: String,
  tag: String,
  disc_id: String,
  tag: String,
  score: String,
  all_time_score: String,
  latest_match: String,
  percentage: String,
  matches_played: Number,
  alltime_matches_played: Number,
  all_time_percentage: String
});

const User = mongoose.model('User', userSchema, "Users");

module.exports = User;