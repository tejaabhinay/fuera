const sportKeyByName = {
  badminton: 'badminton',
  basketball: 'basketball',
  carrom: 'carrom',
  carroms: 'carrom',
  chess: 'chess',
  cricket: 'cricket',
  football: 'football',
  soccer: 'football',
  handball: 'handball',
  kabaddi: 'kabaddi',
  'table-tennis': 'table-tennis',
  tennis: 'tennis',
  throwball: 'throwball',
  'throw-ball': 'throwball',
  volleyball: 'volleyball',
  'body-building': 'body-building',
  'weight-lifting': 'weight-lifting',
  'power-lifting': 'power-lifting',
}

const sportContacts = {
  badminton: {
    captains: [
      { name: 'RAM KARTHICK', contact: '9025696315' },
      { name: 'SHRIVARSHY A', contact: '9787455566' },
    ],
    viceCaptains: [
      { name: 'NIRANJANK', contact: '9940084160' },
    ],
  },
  basketball: {
    captains: [
      { name: 'BILU KASHYOP', contact: '9944022530' },
      { name: 'MRIDULA DHARSHNIM', contact: '8838702788' },
    ],
    viceCaptains: [
      { name: 'AKASH', contact: '8903036413' },
      { name: 'KIRUTHIKA', contact: '9385596785' },
    ],
  },
  carrom: {
    captains: [
      { name: 'SARVESH MOHAN', contact: '9042076908' },
      { name: 'VARSHINI RAMACHANDRAN', contact: '8248707652' },
    ],
    viceCaptains: [
      { name: 'NITHIYA PRIYA', contact: '6379301418' },
    ],
  },
  chess: {
    captains: [
      { name: 'RYALI SREESHANTH', contact: '8015179224' },
      { name: 'RITHANYAM', contact: '9791387328' },
    ],
    viceCaptains: [
      { name: 'YADHU KRISHNA M L', contact: '9384263824' },
      { name: 'HARSHINI', contact: '9751427918' },
    ],
  },
  cricket: {
    captains: [
      { name: 'RAHUL R', contact: '8122292349' },
    ],
    viceCaptains: [
      { name: 'SELVAY', contact: '8888595479' },
    ],
  },
  football: {
    captains: [
      { name: 'SIDDHARTHN', contact: '8248102373' },
    ],
    viceCaptains: [
      { name: 'VARUNESH G', contact: '7010091717' },
    ],
  },
  handball: {
    captains: [
      { name: 'GANGANATH R.S', contact: '8667799655' },
      { name: 'SWATHIKAS', contact: '8939895842' },
    ],
    viceCaptains: [
      { name: 'KAMALESH S', contact: '9629304206' },
      { name: 'POORVAM', contact: '8870453971' },
    ],
  },
  kabaddi: {
    captains: [
      { name: 'VIGNESHKUMAR M', contact: '6383694439' },
    ],
    viceCaptains: [
      { name: 'PRAVEEN KUMAR KALYAN KUMAR', contact: '7708339717' },
    ],
  },
  'table-tennis': {
    captains: [
      { name: 'TANUJ KUMAR I.S', contact: '8072523736' },
      { name: 'BHAVYA G', contact: '6380682552' },
    ],
    viceCaptains: [
      { name: 'R RAHUL', contact: '9015222241' },
      { name: 'R SAMIKSHA', contact: '9566295577' },
    ],
  },
  tennis: {
    captains: [
      { name: 'R.VIJAYA AMRITHA', contact: '8056652069' },
    ],
    viceCaptains: [
      { name: 'AVINASH S', contact: '9884269768' },
      { name: 'NIKHIL AAKS', contact: '9994731812' },
    ],
  },
  throwball: {
    captains: [
      { name: 'VETHIKA SRI T', contact: '9080184216' },
    ],
    viceCaptains: [
      { name: 'JAHNAVI SAI G', contact: '9345538416' },
    ],
  },
  volleyball: {
    captains: [
      { name: 'ATHAVANT', contact: '6385176263' },
      { name: 'S.P.SHIVANE', contact: '9361524164' },
    ],
    viceCaptains: [
      { name: 'LOKESH D', contact: '8610301489' },
      { name: 'SMRITI NAGARAJ', contact: '9754660189' },
    ],
  },
  'body-building': { captains: [], viceCaptains: [] },
  'weight-lifting': { captains: [], viceCaptains: [] },
  'power-lifting': { captains: [], viceCaptains: [] },
}

function normalizeSportName(name) {
  return String(name || '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-')
}

export function getSportContacts(name) {
  const key = sportKeyByName[normalizeSportName(name)]
  return key ? sportContacts[key] : undefined
}

export { sportContacts }
