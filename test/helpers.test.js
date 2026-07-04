const { expect } = require('chai');
const path = require('path');
const fs = require('fs');

describe('Helper Functions', function () {
  let helpers;

  before(function () {
    process.env.NODE_ENV = 'test';
    const TEST_DB_PATH = path.join(__dirname, 'test-mentally-prepare.db');
    process.env.DB_PATH = TEST_DB_PATH;
    try { fs.unlinkSync(TEST_DB_PATH); } catch { }
    try { fs.unlinkSync(TEST_DB_PATH + '-wal'); } catch { }
    try { fs.unlinkSync(TEST_DB_PATH + '-shm'); } catch { }
    delete require.cache[require.resolve('../db')];
    delete require.cache[require.resolve('../server')];
    helpers = require('../server');
  });

  after(function () {
    const TEST_DB_PATH = path.join(__dirname, 'test-mentally-prepare.db');
    try { fs.unlinkSync(TEST_DB_PATH); } catch { }
    try { fs.unlinkSync(TEST_DB_PATH + '-wal'); } catch { }
    try { fs.unlinkSync(TEST_DB_PATH + '-shm'); } catch { }
  });

  describe('scanForSafety', () => {
    it('detects crisis keywords', () => {
      const result = helpers.scanForSafety('I want to kill myself');
      expect(result.crisis).to.be.true;
      expect(result.pii).to.be.false;
    });

    it('detects PII content flags', () => {
      const result = helpers.scanForSafety('dm me on instagram');
      expect(result.crisis).to.be.false;
      expect(result.pii).to.be.true;
    });

    it('detects both crisis and PII', () => {
      const result = helpers.scanForSafety('I want to die, call me at 555');
      expect(result.crisis).to.be.true;
    });

    it('returns safe for clean text', () => {
      const result = helpers.scanForSafety('Today was a peaceful day.');
      expect(result.crisis).to.be.false;
      expect(result.pii).to.be.false;
    });
  });

  describe('detectThemes', () => {
    it('detects isolation theme', () => {
      const themes = helpers.detectThemes([{ text: 'I feel so alone and lonely' }]);
      expect(themes).to.include('isolation');
    });

    it('detects family theme', () => {
      const themes = helpers.detectThemes([{ text: 'My mom and dad' }]);
      expect(themes).to.include('family');
    });

    it('returns empty array for neutral text', () => {
      const themes = helpers.detectThemes([{ text: 'The weather is nice today' }]);
      expect(themes).to.be.an('array').that.is.empty;
    });
  });

  describe('getMatchDay', () => {
    it('returns 1 on start day', () => {
      expect(helpers.getMatchDay(new Date().toISOString())).to.equal(1);
    });

    it('caps at 21', () => {
      const past = new Date(Date.now() - 30 * 86400000).toISOString();
      expect(helpers.getMatchDay(past)).to.equal(21);
    });
  });

  describe('getPartnerId', () => {
    it('returns the other user', () => {
      const m = { user1_id: 'a', user2_id: 'b' };
      expect(helpers.getPartnerId(m, 'a')).to.equal('b');
      expect(helpers.getPartnerId(m, 'b')).to.equal('a');
    });
  });

  describe('getAdaptivePrompt', () => {
    it('returns null with < 2 entries', () => {
      expect(helpers.getAdaptivePrompt([{ text: 'hi' }], 1)).to.be.null;
    });

    it('returns prompt with 2+ themed entries', () => {
      const r = helpers.getAdaptivePrompt([
        { text: 'I feel so alone' },
        { text: 'Nobody understands me' },
      ], 3);
      expect(r).to.have.property('prompt');
      expect(r).to.have.property('theme');
    });
  });

  describe('getMoodInsights', () => {
    it('returns null with < 3 entries', () => {
      expect(helpers.getMoodInsights([{}, {}])).to.be.null;
    });

    it('returns insights with 3+ entries', () => {
      const r = helpers.getMoodInsights([
        { day_number: 1, text: 'a', mood: '🌑' },
        { day_number: 2, text: 'b', mood: '🌓' },
        { day_number: 3, text: 'c', mood: '🌕' },
      ]);
      expect(r).to.have.property('moodTrend');
      expect(r).to.have.property('dominantMood');
      expect(r).to.have.property('trend');
    });
  });
});
