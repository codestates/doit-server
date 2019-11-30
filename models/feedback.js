module.exports = (sequelize, DataTypes) => {
  const Feedback = sequelize.define(
    'feedback',
    {
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      nickname: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
    },
    {
      timestamps: true,
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    },
  );

  Feedback.associate = (db) => {
    db.Feedback.belongsTo(db.User, {
      foreignKey: 'userId',
      targetKey: 'id',
    });
  };

  return Feedback;
};
