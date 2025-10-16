import bcrypt from "bcryptjs";
import { Op } from "sequelize";
import { models } from "../models/index.js";

export async function findByEmailOrUsername(identifier) {
  return models.User.findOne({
    where: {
      [Op.or]: [{ email: identifier }, { username: identifier }],
    },
  });
}

export async function createUser({
  email,
  username,
  password,
  fname,
  lname,
  contact,
  birthdate,
}) {
  const passwordHash = await bcrypt.hash(password, 12);
  const user = await models.User.create({
    email,
    username: username || null,
    passwordHash,
    fname,
    lname,
    contact,
    birthdate,
  });
  return user.toSafeJSON();
}

export async function verifyPassword(user, password) {
  return bcrypt.compare(password, user.passwordHash);
}
