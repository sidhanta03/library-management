let sq = require("sequelize");

let sequelize = new sq.Sequelize({
    dialect: "sqlite",
    storage: "./library.sqlite",
});

module.exports = { DataTypes: sq.DataTypes, sequelize };