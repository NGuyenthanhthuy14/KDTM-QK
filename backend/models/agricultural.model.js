const mongoose = require('mongoose');
const { Schema } = mongoose;

const Agriculture = mongoose.model('agriculture', {
  name: String, 
  location: String,
  description: String,
  owner_name: String, 
  contact_info: String,
  longitude: Number, 
  latitude: Number,
});

module.exports = Agriculture;
