const jwt = require('jsonwebtoken');

// token -> expiresAt (epoch ms)
const tokenToExpiryMs = new Map();

function getExpiryMsFromToken(token) {
  try {
    const decoded = jwt.decode(token);
    if (decoded && decoded.exp) {
      return decoded.exp * 1000;
    }
  } catch (_) {}
  // Fallback: expire in 8 hours if decode fails
  return Date.now() + 8 * 60 * 60 * 1000;
}

function addToBlacklist(token) {
  const expiresAt = getExpiryMsFromToken(token);
  tokenToExpiryMs.set(token, expiresAt);
}

function isBlacklisted(token) {
  const expiresAt = tokenToExpiryMs.get(token);
  if (!expiresAt) return false;
  if (expiresAt <= Date.now()) {
    tokenToExpiryMs.delete(token);
    return false;
  }
  return true;
}

// Periodic cleanup of expired tokens
setInterval(() => {
  const now = Date.now();
  for (const [token, exp] of tokenToExpiryMs.entries()) {
    if (exp <= now) tokenToExpiryMs.delete(token);
  }
}, 10 * 60 * 1000).unref();

module.exports = {
  addToBlacklist,
  isBlacklisted,
};


