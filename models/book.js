let { DataTypes, sequelize } = require("../config/database");
const Author = require("./author");
const Genre = require("./genre");

const Book = sequelize.define("Book", {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    publicationYear: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});

// Associations

// One-to-Many: One Author can have Many Books
Book.belongsTo(Author, {
    foreignKey: {
        name: "authorId",
        allowNull: false,
    },
});

// Many-to-Many: A Book can belong to many Genres
Book.belongsToMany(Genre, { through: "BookGenres" });
Genre.belongsToMany(Book, { through: "BookGenres" });

module.exports = Book;
