export default (sequelize, DataTypes) => {
  const Session = sequelize.define(
    "Session",
    {
      sid: {
        type: DataTypes.STRING(255),
        primaryKey: true,
      },
      expires: {
        type: DataTypes.DATE,
      },
      data: {
        type: DataTypes.TEXT,
      },
    },
    {
      tableName: "Sessions",
      indexes: [{ fields: ["expires"] }],
    },
  );

  return Session;
};
