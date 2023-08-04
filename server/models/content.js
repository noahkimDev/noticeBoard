// member모델과 연결

const { Sequelize } = require("sequelize");
class Content extends Sequelize.Model {
  static initiate(sequelize) {
    return super.init(
      {
        title: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        content: {
          type: Sequelize.TEXT("medium"),
          allowNull: false,
        },
      },
      { sequelize }
    );
  }
  static associate(db) {
    this.belongsTo(db.Member, { foreignKey: "author" });
  }
}
// static association(){}

module.exports = Content;
