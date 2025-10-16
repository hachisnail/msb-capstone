import bcrypt from "bcryptjs";
import { Op } from "sequelize";
import { models } from "../models/index.js";
import {
  getUserRoles,
  getUserPerms,
  assignRole,
} from "../services/rbac.service.js";
import { createUser } from "../services/user.service.js";

// Helper for bad request
function badRequest(res, msg) {
  return res.status(400).json({ error: msg });
}

// -----------------------------
// REGISTER NEW USER
// -----------------------------
export async function register(req, res, next) {
  try {
    const { email, username, password, fname, lname, contact, birthdate } =
      req.body;

    if (!email || !password)
      return badRequest(res, "email and password required");

    // Check existing email
    if (await models.User.findOne({ where: { email } }))
      return res.status(409).json({ error: "Email already registered" });

    // Check username
    if (username && (await models.User.findOne({ where: { username } })))
      return res.status(409).json({ error: "Username already taken" });

    const safeUser = await createUser({
      email,
      username,
      password,
      fname,
      lname,
      contact,
      birthdate,
    });

    // Auto-assign first user as SUPERADMIN
    const userCount = await models.User.count();
    if (userCount === 1) await assignRole(safeUser.id, "SUPERADMIN");

    return res.status(201).json({ user: safeUser });
  } catch (err) {
    console.error("Register error:", err);
    return next(err);
  }
}

// -----------------------------
// LOGIN
// -----------------------------
export async function login(req, res, next) {
  try {
    const { username, password } = req.body;
    if (!username || !password) return badRequest(res, "Missing credentials");

    const user = await models.User.findOne({
      where: {
        [Op.or]: [{ email: username }, { username }],
      },
    });

    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    // Load RBAC roles & permissions
    const roles = await getUserRoles(user.id);
    const perms = await getUserPerms(user.id);

    // Save user session
    req.session.user = {
      id: user.id,
      email: user.email,
      name: `${user.fname || ""} ${user.lname || ""}`.trim(),
      roles,
      perms,
    };

    // Ensure headers are only sent once
    if (!res.headersSent) return res.json({ ok: true, user: req.session.user });
  } catch (err) {
    console.error("Login error:", err);
    if (!res.headersSent)
      return res.status(500).json({ error: "Internal Server Error" });
  }
}

// -----------------------------
// LOGOUT
// -----------------------------
export async function logout(req, res) {
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout error:", err);
      return res.status(500).json({ error: "Failed to logout" });
    }
    res.clearCookie("connect.sid"); // remove cookie
    return res.json({ ok: true });
  });
}

// -----------------------------
// CURRENT SESSION
// -----------------------------
export async function me(req, res) {
  try {
    if (!req.session.user)
      return res.status(401).json({ error: "Unauthorized" });
    return res.json({ session: req.session });
  } catch (err) {
    console.error("Me endpoint error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
