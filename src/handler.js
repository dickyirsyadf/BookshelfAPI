const {nanoid} = require('nanoid');
const books = require('./books');
const addBook = (request, h) => {
  const {name, year, author, summary, publisher, pageCount, readPage, reading} = request.payload;
  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }
  const id = nanoid(16);
  let finished = false;
  if (readPage === pageCount) {
    finished = true;
  }
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const bukuBaru = {
    id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt,
  };

  books.push(bukuBaru);

  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};
const getAllBook = (request, h) => {
  const {query} = request;
  filterBuku = [...books];
  if (query.name) {
    const cari = query.name.toLowerCase();
    filterBuku = filterBuku.filter((book) =>
      book.name.toLowerCase().includes(cari));
  }
  if (query.reading === '0' || query.reading === '1') {
    const baca = query.reading === '1';
    filterBuku = filterBuku.filter((book) => book.reading === baca);
  }
  if (query.finished === '0' || query.finished === '1') {
    const selesai = query.finished === '1';
    filterBuku = filterBuku.filter((buku)=>buku.finished === selesai);
  }
  const response = h.response({
    status: 'success',
    data: {
      books: filterBuku.map((book)=>({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      })),
    },
  });
  response.code(200);
  return response;
};
const getBookById = (request, h) => {
  const {id} = request.params;

  const book = books.filter((n)=> n.id === id)[0];

  if (book !== undefined) {
    const response = h.response({
      status: 'success',
      data: {
        book,
      },
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};
const editBook = (request, h) =>{
  const {id} = request.params;
  const {name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading} = request.payload;
  const updatedAt = new Date().toISOString();

  const index = books.findIndex((book)=> book.id === id);
  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }
  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',

    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};
const deleteBook = (request, h) =>{
  const {id} = request.params;

  const index = books.findIndex((book)=> book.id === id);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {addBook, getAllBook, getBookById, editBook, deleteBook};
