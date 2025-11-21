const mongoose = require('mongoose')

const teamMemberSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    capacity: {
        type: Number,
        required: true,
        min: 0,
        max: 5,
        default: 3
    }
    
})

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  createdBy: {
    type: String,
    required: true
  },

  members: [teamMemberSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});


teamSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});
module.exports = mongoose.model('Team', teamSchema);