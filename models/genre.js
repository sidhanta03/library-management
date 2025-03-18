let { DataTypes, sequelize } = require("../config/database");

const Genre = sequelize.define("Genre", {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    description: {
        type: DataTypes.TEXT,
    },
});

module.exports = Genre;
