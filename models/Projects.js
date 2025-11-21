const mongoose = require('mongoose');

const projectsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,

  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true
  },

  createdBy: {
    type: String,
    required: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  },

  updatedAt: {
    type: Date,
    default: Date.now
  }
});
projectsSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Projects', projectsSchema);
