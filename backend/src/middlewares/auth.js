import jwt from "jsonwebtoken"

function authenticate(req, res, next) {
  const header = req.headers.authorization
  if (!header) return res.status(401).json({ error: "missing auth" })

  const token = header.split(" ")[1]
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    req.user = payload
    next()
  } catch (e) {
    return res.status(401).json({ error: "invalid token" })
  }
}

function requireRole(role) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: "not authenticated" })
    if (req.user.role !== role) return res.status(403).json({ error: "forbidden" })
    next()
  }
}

function authorizeRoles(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: "not authenticated" })
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "forbidden - insufficient permissions" })
    }
    next()
  }
}

export { authenticate, requireRole, authorizeRoles }
