// Minimal structured logger: one JSON line per event so Render's log viewer stays greppable.
function emit(level, message, context) {
  const entry = { level, time: new Date().toISOString(), message, ...context }
  const line = JSON.stringify(entry)
  if (level === 'error') console.error(line)
  else if (level === 'warn') console.warn(line)
  else console.log(line)
}

module.exports = {
  info: (message, context) => emit('info', message, context),
  warn: (message, context) => emit('warn', message, context),
  error: (message, context) => emit('error', message, context),
}
