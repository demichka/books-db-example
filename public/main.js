$(document).ready(function () {
    $('body').bootstrapMaterialDesign();
});

let createBookMarkup = (book) => {
    let item = $('<div class="row book-item border border-primary mb-2 p-2"/>');
    let div = $('<div class="col-sm-8"/>');
    div.append($('<h3 />').html(book.author));
    div.append($('<h4 />').html(book.title));
    div.append($('<p />').html('Year: ' + book.year));
    div.append($('<p />').html('Country: ' + book.country));
    div.append($('<p />').html('Language: ' + book.language));
    div.append($('<p />').html('Pages: ' + book.pages));
    div.append($('<p />').append($('<a href="' + book.link + '" ' + 'title="' + book.title + ' by ' + book.author + ' "target="_blank">Learn more</a>')));
    item.append(div);
    item.append($('<div class="col-sm-4 mb-2"/>').append($('<img src="/book-images/' + book.image + '" class="mw-100 h-auto" />')));
    let removeBtn = $('<button class="btn btn-raised btn-secondary delete-book mr-2 ml-3" type="button" data-id="' + book._id + '">Delete</button>');
    let updateBtn = $('<button class="btn btn-raised btn-warning update-book" type="button" data-event="updateBook" data-id="' + book._id + '">Update</button>');
    item.append(removeBtn);
    item.append(updateBtn);
    return item;
}

$('.get-books').click(async () => {
    let books = await getBooks();
    $('.books-wrap').empty();
    let listBooks = $('<div class="book-list" />');
    for (let book of books) {
        let item = createBookMarkup(book);
        listBooks.append(item);

    }
    $('.books-wrap').append(listBooks);
});

$('.books-wrap').on('click', '.delete-book', function (e) {
    e.preventDefault();
    let book = $(this).data('id');
    deleteBook(book);
    $(this).parents('.book-item').remove();
});

function submitBookForm(form) {
    let author = form.find('#new-author').val();
    let title = form.find('#new-title').val();
    let country = form.find('#new-country').val();
    let language = form.find('#new-lang').val();
    let year = form.find('#new-year').val();
    let image = form.find('#new-image-link').val();
    let link = form.find('#new-about-link').val();
    let pages = form.find('#new-book-pages').val();

    let newBook = {
        author: author,
        title: title,
        country: country,
        language: language,
        year: year,
        image: image,
        link: link,
        pages: pages
    };
    return newBook;
}

function resetForm() {
    $('form')[0].reset();
}

$('.modal').on('hidden.bs.modal', function (e) {
    resetForm();
});

$('#form-modal').on('show.bs.modal', function (e) {
    let btn = $(e.relatedTarget);
    let action = btn.data('event');
    let modalTitle = $(this).find('.modal-title').empty();
    let btns = $(this).find($('.modal-footer').find('button'));
    btns.hide();
    if (action === 'addBook') {
        modalTitle.html('Add new book');
        $('#create-book-btn').show();
    }
});


$('#create-book-btn').click(function () {
    const form = $(this).parents('.modal').find('form');
    let book = submitBookForm(form);
    createNewBook(book);
    $(this).parents('.modal').modal('hide');
});

$('.books-wrap').on('click', '.update-book', async (e) => {
    let id = $(e.target).data('id');
    let book = await getBookById(id);
    console.log(book);
    let modal = openUpdateModal(id);
    fillUpdateFormFromDb(book[0], modal);
});

function openUpdateModal(id) {
    console.log(id);
    let modal = $('#form-modal');
    modal.modal('show');
    let modalTitle = $('.modal-title');
    modalTitle.html('Update book');
    $('#save-updates-btn').show();
    $('#save-updates-btn').data('id', id);
    return modal;
}

function fillUpdateFormFromDb(book, modal) {
    let form = modal.find('form');
    form.find('#new-author').val(book.author);
    form.find('#new-title').val(book.title);
    form.find('#new-country').val(book.country);
    form.find('#new-lang').val(book.language);
    form.find('#new-year').val(book.year);
    form.find('#new-image-link').val(book.image);
    form.find('#new-about-link').val(book.link);
    form.find('#new-book-pages').val(book.pages);
}

$('#save-updates-btn').on('click', async (e) => {
    let btn = $(e.target);
    let form = btn.parents('.modal').find('form');
    let id = btn.data('id');
    let book = submitBookForm(form);
    console.log(book);
    updateBook(id, book);
    $('.get-books').click();
    btn.parents('.modal').modal('hide');
});

let openSearchInputByType = (select) => {
    let selected = select.find('option:selected').val();
    return selected ? selected : null;
};

$('#srch-type-select').change(function () {
    let searchBy = openSearchInputByType($(this));
    let form = $(this).parents('form');
    switch (searchBy) {
        case 'srch-id':
        case 'srch-author':
        case 'srch-title':
        case 'srch-country':
            form.find('.form-group').hide();
            form.find('.simple-srch').slideDown();
            break;
        case 'srch-pages':
        case 'srch-year':
            form.find('.form-group').hide();
            form.find('.interval-srch').slideDown();
            break;
        case 'srch-minAge':
        case 'srch-maxAge':
            form.find('.form-group').hide();
            form.find('.numeric-srch').slideDown();
            break;
        default:
            break;
    }
});

let processSearch = (type, value) => {
    let book = {};
    switch (type) {
        case 'srch-id':
            book = getBookById(value[0]);
            break;
        case 'srch-author':
            book = getBookByAuthor(value);
            break;
        case 'srch-title':
            book = getBookByTitle(value);
            break;
        case 'srch-country':
            book = getBookByCountry(value);
            break;
        case 'srch-year':
            book = getBookByYear(value);
            break;
        case 'srch-pages':
            book = getBookByPages(value);
            break;
        case 'srch-minAge':
            book = getBookByMinAge(value);
            break;
        case 'srch-maxAge':
            book = getBookByMaxAge(value);
            break;
        default:
            {
                return;
            }
    }
    return book;
};

$('.srch-btn').on('click', async (e) => {
    let btn = $(e.target);
    let form = btn.parents('form');
    let type = form.find('option:selected').val();
    let value = [];
    if (type === 'srch-id' ||
        type === 'srch-author' ||
        type === 'srch-title' ||
        type === 'srch-country'
    ) {
        let key = $('#srch-input').val();
        await value.push(key);
    }
    if (type === 'srch-year' ||
        type === 'srch-pages'
    ) {
        let minVal = $('#srch-minVal').val();
        let maxVal = $('#srch-maxVal').val();
        value = {
            minVal: minVal,
            maxVal: maxVal
        };
    }
    if (type === 'srch-minAge' ||
        type === 'srch-maxAge'
    ) {
        let key = $('#numeric-input').val();
        value.push(key);
    }

    let books = await processSearch(type, value);
    if (books.length > 0) {
        $('.books-wrap').empty();
        for (let i = 0; i < books.length; i++) {
            let book = books[i];
            let bookHtml = createBookMarkup(book);
            $('.books-wrap').append(bookHtml);
        }
        form[0].reset();
        value.length = 0;
        form.find('.form-group').hide();
        btn.parents('.modal').modal('hide');
    } else {
        let alert = form.find('.alert');
        alert.fadeIn();
        form[0].reset();
        form.find('.form-group').slideUp();
        setTimeout(() => {
            alert.slideUp();
        }, 2000);

    }
    //5c387c7ceb2bc8092048b528

});