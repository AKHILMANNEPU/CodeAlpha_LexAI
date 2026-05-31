const Translation = require('../models/Translation');
const translate = require('google-translate-api-x');

const translateText = async (req, res) => {
  const { sourceText, sourceLang, targetLang } = req.body;

  if (!sourceText || !targetLang) {
    return res.status(400).json({ message: 'Source text and target language are required' });
  }

  try {
    // Call the free Google Translate API
    const response = await translate(sourceText, {
      from: sourceLang === 'auto' ? 'auto' : sourceLang,
      to: targetLang,
      forceBatch: false,
    });

    const translatedText = response.text;

    let translationRecord = null;
    
    // Attempt to save to database if connected
    try {
      translationRecord = await Translation.create({
        userId: req.user.id,
        sourceText,
        translatedText,
        sourceLang: response?.from?.language?.iso || sourceLang,
        targetLang,
      });
    } catch (dbError) {
      console.warn('Could not save translation to DB:', dbError.message);
    }

    res.status(200).json(translationRecord || {
      _id: Date.now().toString(),
      sourceText,
      translatedText,
      sourceLang: response?.from?.language?.iso || sourceLang,
      targetLang,
      createdAt: new Date().toISOString()
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Translation failed' });
  }
};

const getHistory = async (req, res) => {
  try {
    const history = await Translation.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch history' });
  }
};

const getStats = async (req, res) => {
  try {
    const translations = await Translation.find({ userId: req.user.id });
    
    const totalTranslations = translations.length;
    let wordsTranslated = 0;
    
    translations.forEach(t => {
      if (t.sourceText) {
        wordsTranslated += t.sourceText.split(/\s+/).length;
      }
    });

    res.status(200).json({
      totalTranslations,
      wordsTranslated,
      apiUsage: totalTranslations > 0 ? Math.min(100, Math.round((wordsTranslated / 10000) * 100)) : 0
    });
  } catch (error) {
    console.error('Stats error', error.message);
    res.status(500).json({ message: 'Failed to fetch stats' });
  }
};

const toggleFavorite = async (req, res) => {
  try {
    const translation = await Translation.findById(req.params.id);

    if (!translation) {
      return res.status(404).json({ message: 'Translation not found' });
    }

    if (translation.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    translation.isFavorite = !translation.isFavorite;
    await translation.save();

    res.status(200).json(translation);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update favorite status' });
  }
};

const deleteTranslation = async (req, res) => {
  try {
    const translation = await Translation.findById(req.params.id);

    if (!translation) {
      return res.status(404).json({ message: 'Translation not found' });
    }

    if (translation.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await translation.deleteOne();
    res.status(200).json({ id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete translation' });
  }
};

module.exports = { translateText, getHistory, getStats, toggleFavorite, deleteTranslation };
