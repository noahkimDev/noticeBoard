// member모델과 연결

const { Sequelize } = require("sequelize");
class Content extends Sequelize.Model {
  static initiate(sequelize) {
    return super.init(
      {
        content: {
          type: Sequelize.TEXT("medium"),
          allowNull: false,
        },
      },
      { sequelize }
    );
  }
}

module.export = Content;
