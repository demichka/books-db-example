async function getBooks() {
    return await $.ajax({
        url: '/json/books',
        method: 'GET',
        contentType: 'application/json'
    }).catch(err => console.error(err));
}

async function getBook(id) {
    return await $.ajax({
        url: '/json/books/id/' + id,
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