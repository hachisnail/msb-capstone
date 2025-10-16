import "dotenv/config";
import { ExpressAuth, getSession } from "@auth/express";
import Credentials from "@auth/core/providers/credentials";
import SequelizeAdapter from "@auth/sequelize-adapter";
import { Op } from "sequelize";
import { sequelize, models } from "../models/index.js";
import bcrypt from "bcryptjs";
import { getUserRoles, getUserPerms } from "../services/rbac.service.js";

export const authConfig = {
  // IMPORTANT: Credentials provider requires JWT sessions
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET,

  // You can keep the adapter (useful for OAuth in future),
  // but sessions will NOT be stored in DB when strategy="jwt".
  adapter: SequelizeAdapter(sequelize, {
    models: {
      User: models.User,
      Account: models.Account,
      Session: models.Session, // unused with JWT strategy
      VerificationToken: models.VerificationToken,
    },
  }),

  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Username or Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const identifier = credentials?.username?.trim();
        const password = credentials?.password ?? "";
        if (!identifier || !password) return null;

        const user = await models.User.findOne({
          where: { [Op.or]: [{ email: identifier }, { username: identifier }] },
        });
        if (!user) return null;
        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return null;

        return {
          id: user.id,
          email: user.email,
          name: `${user.fname || ""} ${user.lname || ""}`.trim(),
        };
      },
    }),
  ],

  callbacks: {
    // Put user + RBAC into the JWT once, at sign-in.
    async jwt({ token, user }) {
      if (user?.id) {
        token.id = user.id;
        try {
          const roles = await getUserRoles(user.id);
          const perms = await getUserPerms(user.id);
          token.roles = roles;
          token.perms = perms;
        } catch {
          token.roles = token.roles || [];
          token.perms = token.perms || [];
        }
      }
      return token;
    },

    // Mirror JWT claims into the session object consumed by your frontend.
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id || session.user.id;
        session.user.roles = token.roles || [];
        session.user.perms = token.perms || [];
      }
      return session;
    },

    async redirect({ url, baseUrl }) {
      return baseUrl;
    },
  },
};

// Helper for server-side guards (unchanged)
export async function requireSession(req) {
  const session = await getSession(req, authConfig);
  if (!session) throw Object.assign(new Error("Unauthorized"), { status: 401 });
  return session;
}

export function authRouter() {
  return ExpressAuth(authConfig);
}
