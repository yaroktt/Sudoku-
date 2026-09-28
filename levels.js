/**
 * Level data for Zen Word.
 * Each level has a pool of unique letters (the wheel) and a list of every
 * target word the player can spell from that pool. Levels are ordered so
 * both the wheel size and the word count grow gradually from level 1 to
 * the final level, and grouped into themed chapters that step up in
 * difficulty in turn.
 */
(function (global) {
  const CHAPTERS = [
    { key: 'lake', name: 'Lakeside', subtitle: 'Still waters, easy words', levels: [1, 2, 3, 4, 5] },
    { key: 'balcony', name: 'Balcony', subtitle: 'A quiet afternoon', levels: [6, 7, 8, 9, 10] },
    { key: 'sunset', name: 'Sunset Cove', subtitle: 'Golden hour challenges', levels: [11, 12, 13, 14, 15] },
    { key: 'mountain', name: 'Mountain Village', subtitle: 'Higher and harder', levels: [16, 17, 18, 19, 20] },
    { key: 'harbor', name: 'Harbor Lights', subtitle: 'Evening on the water', levels: [21, 22, 23, 24, 25] },
    { key: 'autumn', name: 'Autumn Grove', subtitle: 'Leaves and quiet paths', levels: [26, 27, 28, 29, 30] },
    { key: 'desert', name: 'Desert Bloom', subtitle: 'Wide open sands', levels: [31, 32, 33, 34, 35] },
    { key: 'snowpeak', name: 'Snowy Peak', subtitle: 'Crisp mountain air', levels: [36, 37, 38, 39, 40] },
    { key: 'rainforest', name: 'Rainforest Canopy', subtitle: 'Deep in the green', levels: [41, 42, 43, 44, 45] },
    { key: 'starlit', name: 'Starlit Bay', subtitle: 'The final horizon', levels: [46, 47, 48, 49, 50] },
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

    { id: 21, letters: 'STORAGE', words: ['STORAGE', 'ROAST', 'GATOR', 'GOATS', 'TOGAS', 'GATES', 'TEARS', 'ROSE', 'STAR', 'ARTS', 'RAGE', 'GEAR', 'SOAR', 'STAG', 'OATS', 'TAG', 'ORE', 'ERA', 'SET'] },
    { id: 22, letters: 'GRANITE', words: ['GRANITE', 'GRATIN', 'RATING', 'RETINA', 'GIANT', 'TRAIN', 'GRAIN', 'GRATE', 'RANGE', 'TIGER', 'GAIN', 'RAIN', 'TEAR', 'RATE', 'TIRE', 'TIER', 'ANTE', 'NEAT', 'TAN', 'RIG'] },
    { id: 23, letters: 'FORTUNE', words: ['FORTUNE', 'FOUNT', 'FRONT', 'ROUTE', 'TENOR', 'TUNER', 'TOUR', 'TORE', 'TONE', 'NOTE', 'ROTE', 'FEN', 'FUR', 'FOR', 'ONE', 'TON', 'NET', 'TEN', 'ORE', 'EON'] },
    { id: 24, letters: 'NEUTRAL', words: ['NEUTRAL', 'LUNAR', 'ANTLER', 'RENTAL', 'LEARN', 'LATER', 'ALTER', 'EARN', 'LEAN', 'LATE', 'TALE', 'TEAL', 'TEAR', 'RENT', 'RANT', 'NEAR', 'EARL', 'ANTE', 'TUNA', 'AUNT'] },
    { id: 25, letters: 'PASTURE', words: ['PASTURE', 'SPEAR', 'PASTE', 'PAUSE', 'SAUTE', 'ASTER', 'RATES', 'TEARS', 'PEARS', 'SPRAT', 'PEAT', 'SPAT', 'STAR', 'ARTS', 'SEAT', 'EAST', 'EATS', 'TARP', 'PART', 'TRAP'] },

    { id: 26, letters: 'TSUNAMI', words: ['TSUNAMI', 'SAINT', 'STAIN', 'SATIN', 'MAIN', 'MAST', 'MIST', 'UNIT', 'AUNT', 'NUTS', 'MUST', 'TIN', 'SIN', 'SIT', 'ANT'] },
    { id: 27, letters: 'BALCONY', words: ['BALCONY', 'LOAN', 'CLAY', 'COLA', 'ONLY', 'BONY', 'NOBLY', 'COAL', 'CLAN', 'BAN', 'BAY', 'NAY', 'BOY'] },
    { id: 28, letters: 'MEADOWS', words: ['MEADOWS', 'SOWED', 'MOWED', 'SEAM', 'SAME', 'MADE', 'DAME', 'DOSE', 'DOES', 'WOES', 'OWES', 'MESA', 'SOW', 'OWE', 'DOE', 'SOD', 'AWE'] },
    { id: 29, letters: 'WEALTHY', words: ['WEALTHY', 'WHEAT', 'WHALE', 'LATHE', 'HEAL', 'HEAT', 'HALE', 'TEAL', 'TALE', 'LATE', 'HATE', 'THAW', 'AWE', 'HAY', 'LAY', 'WAY'] },
    { id: 30, letters: 'CHARIOT', words: ['CHARIOT', 'CHOIR', 'CHART', 'CHAIR', 'RATIO', 'TORCH', 'RIOT', 'TRIO', 'HOAR', 'HAIR', 'OAR', 'ARC', 'CAR', 'CAT', 'HAT', 'HIT', 'HOT'] },

    { id: 31, letters: 'SANDWICH', words: ['SANDWICH', 'CHAINS', 'CHINS', 'DISH', 'DASH', 'WISH', 'CASH', 'SCAN', 'SAND', 'WAND', 'HAND', 'WINS', 'SWAN', 'CHIN', 'DAWN', 'WIN', 'SIN', 'DIN', 'HIS'] },
    { id: 32, letters: 'FESTIVAL', words: ['FESTIVAL', 'FIESTA', 'VITALS', 'VITAL', 'FALSE', 'VEST', 'VAST', 'VATS', 'SALT', 'SLAT', 'LEFT', 'FAST', 'FATS', 'SIFT', 'LIST', 'SILT', 'FILE', 'TAIL', 'TALE', 'FLAT'] },
    { id: 33, letters: 'COMPLAIN', words: ['COMPLAIN', 'MANIC', 'PLAIN', 'CLAIM', 'CAMP', 'CLIP', 'LIMP', 'LIMO', 'MAIN', 'PAIN', 'PAIL', 'NAIL', 'MAIL', 'LOAN', 'COAL', 'CLAN', 'CAP', 'MAP', 'LAP', 'NAP'] },
    { id: 34, letters: 'KEYBOARD', words: ['KEYBOARD', 'BAKER', 'BROKE', 'BREAD', 'BOARD', 'ROAD', 'DARK', 'BARK', 'DEAR', 'BEAR', 'BEAD', 'READ', 'YOKE', 'OKAY', 'ROBE', 'BORE', 'YEAR', 'KEY', 'OAK', 'ARK'] },
    { id: 35, letters: 'HOSPITAL', words: ['HOSPITAL', 'PILOT', 'PATIO', 'SPOIL', 'HAIL', 'HALT', 'SALT', 'SHIP', 'SLIT', 'SLOT', 'PLOT', 'OATH', 'HOST', 'SHOT', 'SPAT', 'SPIT', 'LOST', 'LISP', 'LAP', 'TAP'] },

    { id: 36, letters: 'REPUBLIC', words: ['REPUBLIC', 'PUBLIC', 'CUBE', 'RULE', 'BLUE', 'PILE', 'RIPE', 'CURB', 'CURL', 'CURE', 'PURE', 'PIER', 'LIP', 'RIB', 'CUP', 'PUB', 'ICE', 'PIE'] },
    { id: 37, letters: 'CHARMING', words: ['CHARMING', 'CHARM', 'GRAIN', 'CHAIN', 'MARCH', 'CHAIR', 'RANCH', 'MARGIN', 'RICH', 'CHIN', 'HAIR', 'MAIN', 'RAIN', 'GAIN', 'HARM', 'ARM', 'AIR', 'MAN', 'CAR', 'ARC'] },
    { id: 38, letters: 'SHOWTIME', words: ['SHOWTIME', 'WHITE', 'MOIST', 'SMITE', 'MOTHS', 'MOTH', 'WISH', 'WISE', 'TIME', 'TOME', 'HOME', 'HOSE', 'SHOT', 'SHOW', 'SOME', 'HOW', 'TOE', 'TOW', 'OWE', 'SEW'] },
    { id: 39, letters: 'SOULMATE', words: ['SOULMATE', 'ATOMS', 'MOATS', 'STEAM', 'MEALS', 'STALE', 'STEAL', 'LEAST', 'TALES', 'MULES', 'MULE', 'SALT', 'SEAT', 'MEAT', 'MEAL', 'TEAM', 'TEAL', 'TALE', 'MOLE', 'SOLE', 'SOUL'] },
    { id: 40, letters: 'DAUGHTER', words: ['DAUGHTER', 'GREAT', 'GRATE', 'GATED', 'TRADE', 'TREAD', 'HEART', 'HEARD', 'EARTH', 'RATED', 'HUGER', 'HUGE', 'DEAR', 'READ', 'DATE', 'GATE', 'HATE', 'RATE', 'TEAR', 'HEAT', 'DRAG'] },

    { id: 41, letters: 'SOUTHPAW', words: ['SOUTHPAW', 'SHOUT', 'SOUTH', 'PATHOS', 'WASP', 'SWAT', 'SWAP', 'WHAT', 'OATH', 'HOST', 'SHOT', 'TOPS', 'STOW', 'SHOW', 'WASH', 'HOPS', 'HOP', 'TOW'] },
    { id: 42, letters: 'DISCOVER', words: ['DISCOVER', 'VOICED', 'VOICES', 'CIDER', 'DRIVE', 'SCORE', 'VOICE', 'VIDEO', 'DIVER', 'COVER', 'SIDE', 'RIDE', 'DIVE', 'CORE', 'CODE', 'DOSE', 'ROSE', 'ROVE', 'COVE'] },
    { id: 43, letters: 'OUTSHINE', words: ['OUTSHINE', 'HONEST', 'SHOUT', 'SOUTH', 'HOIST', 'SHINE', 'UNITE', 'HOUSE', 'NOISE', 'SHUN', 'SHOT', 'HINT', 'UNIT', 'NEST', 'NOTE', 'TONE', 'HOSE', 'THIN'] },
    { id: 44, letters: 'FLOWERS', words: ['FLOWERS', 'FLOWER', 'LOWERS', 'LOWER', 'ROLES', 'FLOWS', 'SOLE', 'SORE', 'ROSE', 'FOWL', 'WOLF', 'FLOW', 'ROWS', 'OWL', 'SOW', 'LOW', 'FOR', 'ORE'] },
    { id: 45, letters: 'ROASTING', words: ['ROASTING', 'SORTING', 'RATIONS', 'TRAINS', 'RATIOS', 'GROANS', 'ORGANS', 'GRAIN', 'GROAN', 'TRAIN', 'GIANT', 'SAINT', 'STAIN', 'SATIN', 'ROAST', 'STAR', 'STIR', 'SORT', 'SIGN', 'RANT'] },

    { id: 46, letters: 'HANDSOME', words: ['HANDSOME', 'SHAMED', 'DEMOS', 'MODES', 'DOMES', 'HOSED', 'HOMES', 'SHONE', 'MASON', 'SHAME', 'MOAN', 'MEAN', 'MEAD', 'HAND', 'SEAM', 'SAME', 'DAME', 'MADE', 'MODE', 'DOSE', 'SHOE', 'SHOD'] },
    { id: 47, letters: 'TRIANGLE', words: ['TRIANGLE', 'RETAIL', 'RATING', 'TANGLE', 'LEARNT', 'ALERT', 'LATER', 'ALTER', 'GRAIN', 'GRATE', 'GREAT', 'LARGE', 'ANGLE', 'ANGEL', 'GLARE', 'TRAIL', 'TRIAL', 'GLINT', 'RENT', 'RANT', 'GRIN', 'RING', 'NEAT', 'LATE'] },
    { id: 48, letters: 'MARINES', words: ['MARINES', 'REMAINS', 'REMAIN', 'MARINE', 'RAISE', 'ARISE', 'SIREN', 'RINSE', 'REINS', 'RISEN', 'MINES', 'MAIN', 'MEAN', 'MINE', 'NAME', 'SEAM', 'SAME', 'AMEN', 'MARE', 'RAIN', 'NEAR', 'SANE'] },
    { id: 49, letters: 'TURBINES', words: ['TURBINES', 'TRIBUNE', 'BRUISE', 'RUBIES', 'BURNT', 'BURNS', 'BRINE', 'RUINS', 'TRIBE', 'STUB', 'STIR', 'RUST', 'BURN', 'TURN', 'BITE', 'TUBE', 'NUTS'] },
    { id: 50, letters: 'BRIGHTEN', words: ['BRIGHTEN', 'BRIGHT', 'NIGHT', 'RIGHT', 'EIGHT', 'HINGE', 'REIGN', 'BRINE', 'TIGER', 'TRIBE', 'BRIG', 'HIRE', 'HERB', 'BITE', 'RITE', 'TIRE', 'BIN', 'BIT', 'RIB', 'TEN'] },
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
