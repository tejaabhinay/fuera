// Public content changes rarely but the homepage refetches it on every visit.
// A short shared cache window keeps repeat loads off MongoDB entirely.
function publicCache(maxAgeSeconds = 60, staleWhileRevalidateSeconds = 300) {
  return (req, res, next) => {
    // Never let a shared cache store a response produced for a signed-in admin, even on
    // routes where the public and admin bodies happen to match today.
    if (req.get('authorization')) {
      res.setHeader('Cache-Control', 'no-store')
      return next()
    }

    res.setHeader('Cache-Control', `public, max-age=${maxAgeSeconds}, stale-while-revalidate=${staleWhileRevalidateSeconds}`)
    return next()
  }
}

// Admin listings and every mutation must never be stored.
function noStore(req, res, next) {
  res.setHeader('Cache-Control', 'no-store')
  return next()
}

module.exports = { noStore, publicCache }
