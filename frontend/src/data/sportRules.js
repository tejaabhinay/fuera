const rulesBySport = {
  badminton: {
    title: 'Badminton',
    rules: [
      'Singles and doubles matches will be conducted on a knockout basis.',
      'Only 1 university player is allowed per doubles team.',
      'Up to the quarter-finals: 21 points, 1 set (Rally Point System).',
      'Semi-finals to finals: 21 points, 3 sets (Rally Point System).',
      "The referee's decision is final.",
    ],
    fee: 'Singles – ₹30/- | Doubles – ₹50/-',
  },
  football: {
    title: 'Football',
    rules: [
      'The tournament will be conducted on a knockout basis.',
      'Maximum 5 + 3 players per team.',
      'Only 2 university players are allowed per team.',
      'Teams must report 10 minutes before their scheduled match.',
      'Players must wear the proper kit; sports shoes are compulsory.',
      "The referee's decision is final.",
    ],
    fee: '₹100 per team.',
  },
  kabaddi: {
    title: 'Kabaddi',
    rules: [
      'The tournament will be conducted on a knockout basis.',
      'Maximum 7 + 3 players per team.',
      'Only 3 university players are allowed per team.',
      "The referee's decision is final.",
    ],
    fee: '₹100 per team.',
  },
  tennis: {
    title: 'Tennis',
    rules: [
      'The match pattern will be decided based on the number of registrations.',
      'Only 1 university player is allowed in a doubles team.',
      'Best of 11 games till the quarter-finals; best of three sets from the semi-finals.',
      "The referee's decision is final.",
    ],
    fee: '₹50 (singles) | ₹100 (doubles).',
  },
  'table-tennis': {
    title: 'Table Tennis',
    rules: [
      'Only university players are allowed in a doubles team.',
      'Best of 3 sets till the quarter-finals; best of 5 sets thereafter.',
      'Maximum of 11 points in a set.',
      "The referee's decision is final.",
      'Singles and doubles tournaments will be conducted.',
    ],
    fee: '₹40 (singles) | ₹60 (doubles).',
  },
  cricket: {
    title: 'Cricket',
    rules: [
      'Maximum 6 + 1 players per team.',
      'Matches will be conducted on a knockout basis.',
      '5 overs per innings. A bowler can bowl one over.',
      "The umpire's decision is final.",
      'A tennis ball will be used for matches.',
      'Only the first 72 teams will be allowed.',
      'Registration will be on a first-come, first-served basis.',
      'Umpire decision will be final.',
    ],
    fee: '₹70 per team.',
  },
  handball: {
    title: 'Handball',
    rules: [
      'Maximum 5 + 1 players per team.',
      'Only 2 university players are allowed per team.',
      'Each game session will be 15 minutes.',
      'In case of a tie, 3 minutes of extra time will be given, followed by a penalty shootout if required.',
      'Depending on the number of registrations, the tournament format will be decided as league or knockout.',
    ],
    fee: '₹60/- per team.',
  },
  carrom: {
    title: 'Carrom',
    rules: [
      'Matches will be conducted on a knockout basis.',
      'The number of rounds will be decided based on the number of participants.',
      'Team players must report 15 minutes before the game.',
    ],
    fee: 'Singles – ₹40/- | Doubles – ₹60/-',
  },
  chess: {
    title: 'Chess',
    rules: [
      'International FIDE rules will be followed.',
      "The arbiter's decision will be final.",
      'The zero-tolerance rule will be strictly followed.',
      'The number of rounds will be decided based on the number of participants.',
      'Knockout matches will be conducted initially.',
      'Only a singles tournament will be conducted.',
    ],
    fee: 'Singles – ₹40/-',
  },
  volleyball: {
    title: 'Volleyball',
    rules: [
      'The tournament will be conducted on a knockout basis.',
      'Maximum 6 + 2 players per team.',
      'Only 3 university players are allowed per team.',
      "The referee's decision will be final.",
    ],
    fee: '₹70/- per team.',
  },
  basketball: {
    title: 'Basketball',
    rules: [
      'Format: league or knockout basis.',
      'Players: 5 + 1 per team.',
      'University players: maximum of 2 per team.',
      'Shoes are compulsory.',
      "The referee's decision is final.",
      'Teams must report 10 minutes before their game in proper kit.',
    ],
    fee: '₹60/- per team.',
  },
  throwball: {
    title: 'Throwball',
    rules: [
      'The match format will be decided based on the number of entries.',
      'Maximum 9 + 3 players per team.',
      'Matches will be conducted on a knockout or league basis.',
      "The referee's decision will be final.",
    ],
    fee: '₹70/- per team.',
  },
}

function normalizeSportName(name) {
  return String(name || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

const sportAliases = {
  carroms: 'carrom',
  'table-tennis': 'table-tennis',
  'throw-ball': 'throwball',
}

export function getSportRules(name) {
  const normalizedName = normalizeSportName(name)
  return rulesBySport[sportAliases[normalizedName] || normalizedName]
}

export function getPublicSportName(name) {
  return getSportRules(name)?.title || name
}
