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
async function getBookByAuthor(author) {
    return await $.ajax({
        url: '/json/books/author/' + author,
        method: 'GET',
        contentType: 'application/json'
    }).catch(err => console.error(err));
}

async function getBookByTitle(title) {
    return await $.ajax({
        url: '/json/books/title/' + title,
        method: 'GET',
        contentType: 'application/json'
    }).catch(err => console.error(err));
}
async function getBookByCountry(country) {
    return await $.ajax({
        url: '/json/books/country/' + country,
        method: 'GET',
        contentType: 'application/json'
    }).catch(err => console.error(err));
}
async function getBookByMinAge(minAge) {
    return await $.ajax({
        url: '/json/books/minage/' + minAge,
        method: 'GET',
        contentType: 'application/json'
    }).catch(err => console.error(err));
}
async function getBookByMaxAge(maxAge) {
    return await $.ajax({
        url: '/json/books/maxage/' + maxAge,
        method: 'GET',
        contentType: 'application/json'
    }).catch(err => console.error(err));
}
async function getBookByYear(...args) {
    return await $.ajax({
        url: '/json/books/year/from/' + args[0].minVal + '/to/' + args[0].maxVal,
        method: 'GET',
        contentType: 'application/json'
    }).catch(err => console.error(err));
}
async function getBookByPages(...args) {
    return await $.ajax({
        url: '/json/books/pages/from/' + args[0].minVal + '/to/' + args[0].maxVal,
        method: 'GET',
        contentType: 'application/json'
    }).catch(err => console.error(err));
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