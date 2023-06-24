const mongoose = require('mongoose');
const User = require('./models/User');

class DatabaseHandler {
  constructor(databaseUrl) {
    this.databaseUrl = databaseUrl;
    this.connection = null;
  }

  async connect() {
    try {
      this.connection = await mongoose.connect(this.databaseUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
      console.log('Connected to MongoDB');
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
    }
  }

  async disconnect() {
    try {
      await mongoose.disconnect();
      console.log('Disconnected from MongoDB');
    } catch (error) {
      console.error('Error disconnecting from MongoDB:', error);
    }
  }

  async getUsers() {
    try {
      const users = await User.find({}).exec();
      return users;
    } catch (error) {
      console.error('Error getting users:', error);
      throw error;
    }
  }  
}

module.exports = DatabaseHandler;
