const mongoose = require('mongoose');

const translationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  sourceText: {
    type: String,
    required: true,
  },
  translatedText: {
    type: String,
    required: true,
  },
  sourceLang: {
    type: String,
    required: true,
  },
  targetLang: {
    type: String,
    required: true,
  },
  isFavorite: {
    type: Boolean,
    default: false,
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Translation', translationSchema);
