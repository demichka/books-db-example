async function getBooks() {
    return await $.ajax({
        url: '/json/books',
        method: 'GET',
        contentType: 'application/json'
    }).catch(err => console.error(err));
}

async function getBookById(id) {
    return await $.ajax({
        url: '/json/books/id/' + id,
        method: 'GET',
        contentType: 'application/json'
    }).catch(err => console.error(err));
}

async function getBookByAuthor(...args) {
    return await $.ajax({
        url: '/json/books/author/' + args[0],
        method: 'GET',
        contentType: 'application/json'
    }).catch(err => console.error(err));
}

async function getBookByTitle(...args) {
    return await $.ajax({
        url: '/json/books/title/' + args[0],
        method: 'GET',
        contentType: 'application/json'
    }).catch(err => console.error(err));
}

async function getBookByYear(...args) {
    return await $.ajax({
        url: '/json/books/year/from/' + args[0][0] + '/to/' + args[0][1],
        method: 'GET',
        contentType: 'application/json'
    }).catch(console.log(args));
}

async function createNewBook(book) {
    return await $.ajax({
        url: '/json/books',
        method: 'POST',
        contentType: 'application/json',
        processData: false,
        data: JSON.stringify(book)
    }).catch((err) => {
        console.error(err);
    });
}

async function deleteBook(id) {
    return await $.ajax({
        url: '/json/books/' + id,
        method: 'DELETE',
        contentType: 'application/json'
    }).catch((err) => {
        console.error(err);
    });
}

async function updateBook(id, bookProperties) {
    return await $.ajax({
        url: '/json/books/' + id,
        method: 'PUT',
        contentType: 'application/json',
        processData: false,
        data: JSON.stringify(bookProperties)
    }).catch(err => console.error(err));
}