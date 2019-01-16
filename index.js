const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

mongoose.set('useFindAndModify', false);

// Connect to db
let dbName = 'famous_books';
mongoose.connect(`mongodb://localhost/${dbName}`);
global.db = mongoose.connection;
db.on('error', () => console.log('Could not connect to DB'));
db.once('open', () => {
    console.log('Connected to DB');
    startWebServer();
});


// Import our Book mongoose model
const Book = require('./Book');

function startWebServer() {

    // Create a web server
    const app = express();

    app.use(bodyParser.json());


    app.use(express.static('public'));

    // A route that returns all books from Mongo
    app.get('/json/books', async (req, res) => {
        let books = await Book.find();
        res.json(books);
    });

    app.get('/json/books/id/:id', async (req, res) => {
        let book = await Book.find({
            _id: req.params.id
        }).catch((err) => {
            // Catching here to prevent server crash
            // if cast to object id for id fails
            res.json({
                error: err
            });
        });
        res.json(book !== null ? book : {
            error: 'No such book'
        });
    });
    app.delete('/json/books/:id', async (req, res) => {
        let result = await Book.findByIdAndDelete(req.params.id).catch((err) => {
            // Catching here to prevent server crash
            // if cast to object id for id fails
            res.json({
                error: err
            });
        });
        res.json(result !== null ? result : {
            error: 'No such book'
        });
    });

    app.put('/json/books/:id', async (req, res) => {
        let result = await Book.findByIdAndUpdate(req.params.id, req.body).catch((err) => {
            res.json({
                error: err
            });

            res.json({
                result: result !== null ? 'success!' : 'error'
            });
        });
    });

    app.post('/json/books', async (req, res) => {
        const book = new Book(req.body);
        let saveResult = await book.save();
        res.json(saveResult);
    });

    app.get('/json/books/author/:author', async (req, res) => {
    // let variant = new RegExp(req.params.author, 'i');
        let books = await Book.find({
            author: {
                $regex: req.params.author,
                $options: 'i'
            }
        }).catch((err) => {
            res.json({
                error: err
            });
        });
        res.json(books.length > 0 ? books : {
            error: 'No such author'
        });
    });

    app.get('/json/books/title/:title', async (req, res) => {
        let variant = new RegExp(req.params.title, 'i');
        let books = await Book.find({
            title: variant
        }).catch((err) => {
            res.json({
                error: err
            });
        });
        res.json(books.length > 0 ? books : {
            error: 'No such title'
        });
    });

    app.get('/json/books/country/:country', async (req, res) => {
        let variant = new RegExp(req.params.country, 'i');
        let books = await Book.find({
            country: variant
        }).catch((err) => {
            res.json({
                error: err
            });
        });
        res.json(books.length > 0 ? books : {
            error: 'No such country'
        });
    });

    app.get('/json/books/year/from/:fromYear/to/:toYear', async (req, res) => {
        let books = await Book.find({
            year: {
                $gte: req.params.fromYear,
                $lte: req.params.toYear
            }
        }).catch((err) => {
            res.json({
                error: err
            });
        });
        res.json(books.length > 0 ? books : {
            error: 'No books in such period'
        });
    });

    app.get('/json/books/pages/from/:minPages/to/:maxPages', async (req, res) => {
        let books = await Book.find({
            pages: {
                $gte: req.params.minPages,
                $lte: req.params.maxPages
            }
        }).catch((err) => {
            res.json({
                error: err
            });
        });
        res.json(books.length > 0 ? books : {
            error: 'No books in such conditions'
        });
    });

    app.get('/json/books/minage/:minage', async (req, res) => {
        let yearToday = new Date().getFullYear();
        let minYear = yearToday - req.params.minage;
        let books = await Book.find({
            year: {
                $lte: minYear
            }
        }).
            catch((err) => {
                res.json({
                    error: err
                });
            });
        res.json(books.length > 0 ? books : {
            error: `No books older than ${req.params.minage} age`
        });
    });

    app.get('/json/books/maxage/:maxage', async (req, res) => {
        let yearToday = new Date().getFullYear();
        let maxYear = yearToday - req.params.maxage;
        let books = await Book.find({
            year: {
                $gte: maxYear
            }
        }).
            catch((err) => {
                res.json({
                    error: err
                });
            });
        res.json(books.length > 0 ? books : {
            error: `No books younger than ${req.params.maxage} age`
        });
    });
    // Start the web server
    app.listen(3005, () => console.log('Listening on port 3005'));
}