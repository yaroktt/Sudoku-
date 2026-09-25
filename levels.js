/**
 * Level data for Zen Word.
 * Each level has a pool of unique letters (the wheel) and a list of every
 * target word the player can spell from that pool. Levels are ordered so
 * both the wheel size and the word count grow gradually from level 1 to
 * level 20, and grouped into four themed chapters that step up in
 * difficulty in turn.
 */
(function (global) {
  const CHAPTERS = [
    {
      key: 'lake',
      name: 'Lakeside',
      subtitle: 'Still waters, easy words',
      levels: [1, 2, 3, 4, 5],
    },
    {
      key: 'balcony',
      name: 'Balcony',
      subtitle: 'A quiet afternoon',
      levels: [6, 7, 8, 9, 10],
    },
    {
      key: 'sunset',
      name: 'Sunset Cove',
      subtitle: 'Golden hour challenges',
      levels: [11, 12, 13, 14, 15],
    },
    {
      key: 'mountain',
      name: 'Mountain Village',
      subtitle: 'The final stretch',
      levels: [16, 17, 18, 19, 20],
    },
  ];

  // Ordered by difficulty: wheel size first, target-word count second.
  const LEVELS = [
    { id: 1, letters: 'LAKE', words: ['LAKE', 'KALE', 'LEAK', 'ALE', 'ELK'] },
    { id: 2, letters: 'SEAL', words: ['SEAL', 'SALE', 'ALES', 'LEAS', 'ALE', 'SEA', 'LEA'] },
    { id: 3, letters: 'ARTE', words: ['RATE', 'TEAR', 'ART', 'EAR', 'ARE', 'ATE', 'RAT', 'TAR'] },
    { id: 4, letters: 'MEAT', words: ['MEAT', 'TAME', 'MATE', 'ATE', 'EAT', 'TEA', 'MAT', 'TAM'] },
    { id: 5, letters: 'HOUSE', words: ['HOUSE', 'HOSE', 'HOES', 'HUES', 'HOE', 'HUE', 'SHE', 'USE'] },

    { id: 6, letters: 'GRAPE', words: ['GRAPE', 'PAGER', 'RAGE', 'GEAR', 'PEAR', 'REAP', 'GAPE', 'PAGE', 'APE', 'AGE', 'PEA', 'ARE'] },
    { id: 7, letters: 'EARTH', words: ['EARTH', 'HEART', 'HATE', 'HEAT', 'HARE', 'HEAR', 'RATE', 'TEAR', 'ART', 'ARE', 'HAT', 'RAT', 'TAR', 'TEA'] },
    { id: 8, letters: 'STONE', words: ['STONE', 'TONES', 'NOTES', 'ONSET', 'TONE', 'NOTE', 'NOSE', 'TOES', 'TEN', 'TON', 'SON', 'NOT', 'NET', 'SET'] },
    { id: 9, letters: 'THINKS', words: ['THINK', 'STINK', 'SKIN', 'THIN', 'SIN', 'NIT', 'TIN', 'HIS', 'INK', 'KIT', 'SIT'] },
    { id: 10, letters: 'CLOUDS', words: ['CLOUDS', 'SCOLD', 'COULD', 'CLOD', 'COLD', 'LOUD', 'SOD', 'COD', 'CUD', 'DUO', 'OLD'] },

    { id: 11, letters: 'WINTER', words: ['WINTER', 'WRITE', 'TWINE', 'WRIT', 'WIRE', 'WINE', 'TWIN', 'TIRE', 'TIER', 'RENT', 'TIN', 'WIN', 'WIT', 'NET'] },
    { id: 12, letters: 'GARDEN', words: ['GARDEN', 'RANGED', 'DANGER', 'GANDER', 'RANGE', 'ANGER', 'GRAND', 'GEAR', 'DEAR', 'DARE', 'READ', 'NEAR', 'EARN', 'RAN'] },
    { id: 13, letters: 'MOTHER', words: ['MOTHER', 'OTHER', 'HOMER', 'HERO', 'HOME', 'MORE', 'ROTE', 'TORE', 'THEM', 'HOT', 'HOE', 'ORE', 'MET', 'THE'] },
    { id: 14, letters: 'CANDLE', words: ['CANDLE', 'LANCED', 'DANCE', 'LACED', 'CLEAN', 'LAND', 'DEAL', 'LEAD', 'LANE', 'CANE', 'LACE', 'ACNE', 'CLAN', 'AND', 'CAN'] },
    { id: 15, letters: 'SPRING', words: ['SPRING', 'SPRIG', 'GRIPS', 'RINGS', 'SIGN', 'GRIN', 'RING', 'GRIP', 'SPIN', 'PIG', 'RIG', 'SIN', 'PIN', 'GIN', 'SIR'] },

    { id: 16, letters: 'FRIEND', words: ['FRIEND', 'FINDER', 'FRIED', 'FIRED', 'FIND', 'RIDE', 'DINE', 'FINE', 'FIRE', 'DIRE', 'REND', 'NERD', 'FED', 'RID', 'DEN'] },
    { id: 17, letters: 'MASTER', words: ['MASTER', 'STREAM', 'STEAM', 'TEAMS', 'MEATS', 'TAME', 'MATE', 'TEAM', 'RATE', 'MARE', 'STAR', 'RATS', 'ARTS', 'EAST', 'SEAT', 'ARM'] },
    { id: 18, letters: 'PLANET', words: ['PLANET', 'PLANE', 'PANEL', 'PLATE', 'PLEAT', 'PETAL', 'LEAP', 'PLAN', 'LANE', 'PANE', 'NEAT', 'ANTE', 'TALE', 'LATE', 'TEAL', 'PEAT', 'APT', 'PET', 'ANT', 'PAL'] },
    { id: 19, letters: 'PICTURE', words: ['PICTURE', 'ERUPT', 'PRICE', 'TRUCE', 'CURT', 'CURE', 'CUTE', 'PURE', 'RIPE', 'TRIP', 'TRUE', 'TIER', 'CUT', 'ICE', 'TIE', 'PIE'] },
    { id: 20, letters: 'CAPTURE', words: ['CAPTURE', 'CURATE', 'TEACUP', 'ACUTE', 'ERUPT', 'TRACE', 'CRATE', 'REACT', 'CURE', 'CUTE', 'PURE', 'PACE', 'RACE', 'CARE', 'CARP', 'TAPE', 'CAPE', 'PART', 'CART', 'ACT'] },
  ];

  function chapterForLevel(id) {
    return CHAPTERS.find((c) => c.levels.includes(id));
  }

  function themeForLevel(id) {
    const c = chapterForLevel(id);
    return c ? c.key : 'lake';
  }

  function getLevel(id) {
    return LEVELS.find((l) => l.id === id);
  }

  const api = { CHAPTERS, LEVELS, chapterForLevel, themeForLevel, getLevel };
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  } else {
    global.ZenWordData = api;
  }
})(typeof window !== 'undefined' ? window : globalThis);
