
$(document).ready(function() { $('body').bootstrapMaterialDesign(); });

$('.get-books').click( async () => {
    let books = await getBooks();
    $('.books-wrap').empty();
    let listBooks = $('<div class="book-list" />');
    for (let book of books) {
        let item = $('<div class="row book-item border border-primary mb-2 p-2"/>');
        let div = $('<div class="col-sm-8"/>');
        div.append($('<h3 />').html(book.author));
        div.append($('<h4 />').html(book.title));
        div.append($('<p />').html('Year: ' + book.year));
        div.append($('<p />').html('Country: ' + book.country));
        div.append($('<p />').html('Language: ' + book.language));
        div.append($('<p />').html( 'Pages: ' + book.pages));
        div.append($('<p />').append($('<a href="' + book.link + '" ' + 'title="'+ book.title + ' by ' + book.author + ' "target="_blank">Learn more</a>')));
        item.append(div);        
        item.append($('<div class="col-sm-4"/>').append($('<img src="/book-images/' + book.image + '" class="mw-100 h-auto" />')));
        let removeBtn = $('<button class="btn btn-raised btn-secondary delete-book mr-1" type="button" data-id="' + book._id +'">Delete</button>');
        let updateBtn = $('<button class="btn btn-raised btn-warning update-book" type="button" data-event="updateBook" data-id="' + book._id +'">Update</button>');
        item.append(removeBtn);
        item.append(updateBtn);
        listBooks.append(item);

    }
    $('.books-wrap').append(listBooks);
});

$('.books-wrap').on('click', '.delete-book', function(e) {
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

function resetForm () {
    $('form')[0].reset();
}

$('.modal').on('hidden.bs.modal', function (e) {
    resetForm();
});

$('#form-modal').on('show.bs.modal', function(e) {
    let btn = $(e.relatedTarget);
    let action = btn.data('event');
    let modalTitle = $(this).find('.modal-title').empty();
    let btns = $(this).find($('button'));
    btns.hide();
    if (action === 'addBook') {
        modalTitle.html('Add new book');
        $('#create-book-btn').show();
    }
});


$('#create-book-btn').click(function (){
    const form = $(this).parents('.modal').find('form');
    let book = submitBookForm(form);
    createNewBook(book);
    $(this).parents('.modal').modal('hide');
});

$('.books-wrap').on('click', '.update-book', async (e) => {
    let id =  $(e.target).data('id');
    let book = await getBook(id);
    let modal = openUpdateModal(id);
    fillUpdateFormFromDb(book, modal);
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
    console.log(form);
    let id = btn.data('id');
    let book = submitBookForm(form);
    console.log(book);
    updateBook(id, book);
    $('.get-books').click();
    btn.parents('.modal').modal('hide');
});