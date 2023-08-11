const Sequelize = require("sequelize");
class Member extends Sequelize.Model {
  static initiate(sequelize) {
    return super.init(
      {
        email: {
          type: Sequelize.STRING(100),
          unique: true,
          allowNull: false,
        },
        nickname: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        password: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
      },
      { sequelize }
    );
  }
  // , { foreignKey: "commenter", sourceKey: "id" }
  static associate(db) {
    this.hasMany(db.Content, { foreignKey: "author", sourceKey: "nickname" });
  }
}

module.exports = Member;
