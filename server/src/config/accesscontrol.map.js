// Canonical roles & perms used to seed the DB.
// You can safely edit these and re-run the seeder to sync.

export const ROLES = [
  {
    name: "SUPERADMIN",
    description: "System ultimate fallback; full control.",
  },
  {
    name: "ADMIN",
    description: "Manages users (except SUPERADMIN) and settings.",
  },
  { name: "APPOINTMENTS", description: "Manages scheduling and visitor flow." },
  { name: "INVENTORY", description: "Manages museum catalogs & items." },
  { name: "AUTHOR", description: "Creates content; own CRUD." },
  { name: "EDITOR", description: "Reviews/approves content." },
  {
    name: "ACQUISITIONS",
    description: "Manages artifact acquisitions and lendings.",
  },
  {
    name: "CATALOGS",
    description:
      "Handles cataloging of approved artifacts arriving in the museum.",
  },
  {
    name: "VIEWER",
    description: "Can only view content; no modification allowed.",
  },
];

export const PERMS = [
  // user & role admin
  "users.manage",
  "users.invite",
  "roles.manage",
  // appointments
  "appointments.create",
  "appointments.read",
  "appointments.update",
  "appointments.delete",
  // inventory
  "inventory.create",
  "inventory.read",
  "inventory.update",
  "inventory.delete",
  // articles
  "articles.create",
  "articles.read",
  "articles.update",
  "articles.delete",
  "articles.approve",

  // acquisitions
  "acquisitions.create",
  "acquisitions.read",
  "acquisitions.update",
  "acquisitions.delete",
  "lendings.create",
  "lendings.read",
  "lendings.update",
  "lendings.delete",

  // catalogs
  "catalogs.create",
  "catalogs.read",
  "catalogs.update",
  "catalogs.delete",
];

export const MAP = {
  SUPERADMIN: PERMS, // everything
  ADMIN: ["users.manage", "users.invite", "roles.manage"],
  APPOINTMENTS: [
    "appointments.create",
    "appointments.read",
    "appointments.update",
    "appointments.delete",
  ],
  INVENTORY: [
    "inventory.create",
    "inventory.read",
    "inventory.update",
    "inventory.delete",
  ],
  AUTHOR: [
    "articles.create",
    "articles.read",
    "articles.update",
    "articles.delete",
  ],
  EDITOR: [
    "articles.read",
    "articles.approve",
    "articles.create",
    "articles.update",
  ],
  ACQUISITIONS: [
    "acquisitions.create",
    "acquisitions.read",
    "acquisitions.update",
    "acquisitions.delete",
    "lendings.create",
    "lendings.read",
    "lendings.update",
    "lendings.delete",
  ],

  CATALOGS: [
    "catalogs.create",
    "catalogs.read",
    "catalogs.update",
    "catalogs.delete",
  ],
  VIEWER: [
    "appointments.read",
    "inventory.read",
    "articles.read",
    "acquisitions.read",
    "lendings.read",
  ],
};
