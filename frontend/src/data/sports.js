export const sports = [
  {
    id: 'football',
    name: 'Football',
  },
  {
    id: 'cricket',
    name: 'Cricket',
  },
  {
    id: 'basketball',
    name: 'Basketball',
  },
  {
    id: 'volleyball',
    name: 'Volleyball',
  },
  {
    id: 'badminton',
    name: 'Badminton',
  },
  {
    id: 'table-tennis',
    name: 'Table Tennis',
  },
]

export const getSportById = (sportId) => sports.find((sport) => sport.id === sportId)
