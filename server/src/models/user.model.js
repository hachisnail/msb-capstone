export default (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
      },
      username: {
        type: DataTypes.STRING(64),
        allowNull: true,
        unique: true,
      },
      fname: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      lname: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      contact: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      birthdate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      passwordHash: {
        type: DataTypes.STRING(255),
        allowNull: true, // ✅ allow null for invited users
      },
      emailVerified: {
        type: DataTypes.DATE,
        allowNull: true, // null means "not verified yet" (invited or unverified)
      },
    },
    {
      tableName: "Users",
    },
  );

  User.prototype.toSafeJSON = function toSafeJSON() {
    const { id, email, username, fname, lname, contact, birthdate } = this;
    return {
      id,
      email,
      username,
      fname,
      lname,
      contact,
      birthdate,
      name: `${fname || ""} ${lname || ""}`.trim(),
    };
  };

  return User;
};
