const { validationResult, body } = require('express-validator');

function handleErrors(req, res, next) {
  if (!req.session?.userId) return next();
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array().map(e => e.msg).join('; ') });
  }
  next();
}

const register = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('college').trim().notEmpty().withMessage('College is required'),
  body('year').trim().notEmpty().withMessage('Year is required'),
  body('gender').trim().notEmpty().withMessage('Gender is required'),
  body('consentGiven').isBoolean().withMessage('Consent must be boolean'),
  handleErrors,
];

const login = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  handleErrors,
];

const entry = [
  body('text').trim().notEmpty().withMessage('Text is required')
    .isLength({ max: 5000 }).withMessage('Text must be under 5000 characters'),
  handleErrors,
];

const scan = [
  body('scores').notEmpty().withMessage('Scores are required'),
  body('archetype').isString().notEmpty().withMessage('Archetype is required'),
  handleErrors,
];

const analyze = [
  body('answers').notEmpty().withMessage('Answers are required'),
  handleErrors,
];

const forgotPassword = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  handleErrors,
];

const resetPassword = [
  body('code').notEmpty().withMessage('Reset code is required'),
  body('newPassword').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  handleErrors,
];

const comment = [
  body('entryId').optional().isInt(),
  body('text').trim().notEmpty().withMessage('Comment text is required'),
  handleErrors,
];

const notificationPrefs = [
  body('preferences').isObject().withMessage('Preferences must be an object'),
  handleErrors,
];

module.exports = { register, login, entry, scan, analyze, forgotPassword, resetPassword, comment, notificationPrefs };
