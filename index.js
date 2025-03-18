const express = require("express");
const { sequelize } = require("./config/database");
const Author = require("./models/author");
const Book = require("./models/book");
const Genre = require("./models/genre");

const app = express();
app.use(express.json());

const authorsData = [
  { name: "J.K. Rowling", birthdate: "1965-07-31", email: "jkrowling@books.com" },
  { name: "George R.R. Martin", birthdate: "1948-09-20", email: "grrmartin@books.com" }
];

const genresData = [
  { name: "Fantasy", description: "Magical and mythical stories." },
  { name: "Drama", description: "Fiction with realistic characters and events." }
];

const booksData = [
  { title: "Harry Potter and the Philosopher's Stone", description: "A young wizard's journey begins.", publicationYear: 1997, authorId: 1 },
  { title: "Game of Thrones", description: "A medieval fantasy saga.", publicationYear: 1996, authorId: 2 }
];

// Seed Database API
app.get("/seed_db", async (req, res) => {
  try {
    await sequelize.sync({ force: true }); // Reset DB
    console.log("Database Synced!");

    const authors = await Author.bulkCreate(authorsData);
    console.log("Authors Seeded!");

    const genres = await Genre.bulkCreate(genresData);
    console.log("Genres Seeded!");

    const books = await Book.bulkCreate(booksData);
    console.log("Books Seeded!");

    // Many-to-Many Relationship
    await books[0].setGenres([genres[0]]); // Harry Potter -> Fantasy
    await books[1].setGenres([genres[0], genres[1]]); // Game of Thrones -> Fantasy, Drama

    console.log("Book-Genre Associations Created!");
    
    res.status(200).json({ message: "Database seeded successfully!" });

  } catch (error) {
    console.error("Error seeding database:", error);
    res.status(500).json({ error: "Database seeding failed!" });
  }
});

// API: Get All Books
app.get("/books", async (req, res) => {
  try {
    const books = await Book.findAll({ include: [Author, Genre] });
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch books" });
  }
});

// API: Fetch Books Written by an Author
app.get("/authors/:authorId/books", async (req, res) => {
  try {
    const { authorId } = req.params;
    const books = await Book.findAll({ where: { authorId }, include: [Genre] });

    if (books.length === 0) {
      return res.status(404).json({ error: "No books found for this author" });
    }

    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch books by author" });
  }
});

// API: Get Books by Genre
app.get("/genres/:genreId/books", async (req, res) => {
  try {
    const { genreId } = req.params;
    const genre = await Genre.findByPk(genreId, { include: [Book] });

    if (!genre) {
      return res.status(404).json({ error: "Genre not found" });
    }

    res.status(200).json(genre.Books);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch books by genre" });
  }
});

// Add a New Book
app.post("/books", async (req, res) => {
  try {
    const { title, description, publicationYear, authorId, genreIds } = req.body;

    if (!title || !description || !publicationYear || !authorId || !genreIds) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const author = await Author.findByPk(authorId);
    if (!author) {
      return res.status(404).json({ error: "Author not found" });
    }

    const book = await Book.create({ title, description, publicationYear, authorId });

    // Associate book with genres
    const genres = await Genre.findAll({ where: { id: genreIds } });
    if (genres.length !== genreIds.length) {
      return res.status(400).json({ error: "One or more genres not found" });
    }

    await book.setGenres(genres);

    res.status(201).json({ message: "Book created successfully!", book });
  } catch (error) {
    res.status(500).json({ error: "Failed to add book" });
  }
});

app.get("/author", async (req, res) => {
 try {
    const findAuthor = await Author.findAll();
    res.status(200).json({Author: findAuthor});

 } catch (error) {
    return res.status(500).json({ error: "Internal server error."})
 }
});

app.post("/author/new", async (req, res) => {
    try {
        const { name, birthdate, email } = req.query;
        if ( !name || !birthdate || !email){
            return res.status(400).json({ error: "name, email, birthdate required. "});
        }
        const createAuthor = await Author.create({ name, birthdate, email});
        res.status(201).json(createAuthor);
    
     } catch (error) {
        return res.status(500).json({ error: "Internal server error."})
     }
});

app.get("/genres/:genresId/authors", async (req, res) => {
 try {
    const { genresId} = req.params;

    const findgenre = await Genre.findByPk(genresId, { include: [Book]});
     res.status(200).json({Author: findgenre.Author});

 } catch (error) {
    return res.status(500).json({ error: "Internal server Error"});
 }
});




app.listen(3000, () => console.log("Server running on port 3000"));
