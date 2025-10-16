"use strict";
module.exports = {
  async up(q, S) {
    const { UUID, UUIDV4, STRING, DATE } = S;
    await q.createTable("Roles", {
      id: { type: UUID, defaultValue: UUIDV4, primaryKey: true },
      name: { type: STRING(64), unique: true, allowNull: false },
      description: { type: STRING(255) },
      createdAt: { type: DATE, allowNull: false, defaultValue: S.fn("NOW") },
      updatedAt: { type: DATE, allowNull: false, defaultValue: S.fn("NOW") },
    });
  },
  async down(q) {
    await q.dropTable("Roles");
  },
};
