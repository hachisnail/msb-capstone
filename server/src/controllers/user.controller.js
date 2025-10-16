// controllers/user.controller.js
import { models, sequelize } from "../models/index.js";
import { Op } from "sequelize"; // ✅ FIX: import Op directly

export async function getUsers(req, res) {
  try {
    const session = req.session?.user;
    if (
      !session ||
      !session.roles?.some((r) => ["ADMIN", "SUPERADMIN"].includes(r))
    ) {
      return res.status(403).json({ error: "Forbidden" });
    }

    // Fetch all verified users (emailVerified NOT null)
    const users = await models.User.findAll({
      where: { emailVerified: { [Op.ne]: null } },
      attributes: [
        "id",
        "email",
        "fname",
        "lname",
        "contact",
        "emailVerified",
        "createdAt",  
        "updatedAt",
      ],
      include: [
        {
          model: models.Role,
          through: { attributes: [] },
          attributes: ["name"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    const formatted = users.map((u) => ({
      id: u.id,
      email: u.email,
      fname: u.fname,
      lname: u.lname,
      contact: u.contact,
      emailVerified: u.emailVerified,
      roles: u.Roles?.map((r) => r.name) || [],
    }));

    return res.json(formatted);
  } catch (err) {
    console.error("getUsers error:", err);
    return res.status(500).json({ error: "Failed to fetch users" });
  }
}

/**
 * GET /api/users/:id
 * Fetch a single user (self or admin access)
 */
export async function getUserById(req, res) {
  try {
    const session = req.session?.user;
    const { id } = req.params;

    if (!session) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Allow user to fetch self or admin to fetch anyone
    if (
      session.id !== id &&
      !session.roles?.includes("ADMIN") &&
      !session.roles?.includes("SUPERADMIN")
    ) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const user = await models.User.findByPk(id, {
      attributes: [
        "id",
        "email",
        "fname",
        "lname",
        "contact",
        "birthdate",
        "emailVerified",
        "createdAt",
        "updatedAt",
      ],
      include: [
        {
          model: models.Role,
          through: { attributes: [] },
          attributes: ["name"],
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const formatted = {
      id: user.id,
      email: user.email,
      fname: user.fname,
      lname: user.lname,
      contact: user.contact,
      birthdate: user.birthdate,
      emailVerified: user.emailVerified,
      roles: user.Roles?.map((r) => r.name) || [],
    };

    return res.json(formatted);
  } catch (err) {
    console.error("getUserById error:", err);
    return res.status(500).json({ error: "Failed to fetch user" });
  }
}
