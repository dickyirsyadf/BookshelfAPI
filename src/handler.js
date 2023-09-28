const {nanoid} = require('nanoid');
const books = require('./books');
const addBook = (request,h) => {
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
    if(name === undefined){
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
    }
    if (readPage > pageCount){
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    }
    const id = nanoid(16);
    let finished = false;
    if(readPage === pageCount){
        finished = true;
    }
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    const bukuBaru = {
        id,name,year,author,summary,publisher,pageCount,readPage,finished,reading,insertedAt,updatedAt,
    }

    books.push(bukuBaru);

    const isSuccess = books.filter((book) => book.id === id).length > 0;
    
    if(isSuccess){
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
const getAllBook = (request,h) => {
    const {name, reading, finished} = request.query;
    if (name) {
        let ada = books.filter((b) => b.name.toLowerCase() === name.toLowerCase());
        const response = h.response({
        status: 'success',
        data: {
            books: ada.map((ada) => ({
            id: ada.id,
            name: ada.name,
            publisher: ada.publisher,
            })),
        },
        });
        response.code(200);
        return response;
    }
    if (reading) {
        let book = books.filter((b) => Number(b.reading) === reading);
        const response =  h.response({
        status: 'success',
        data: {
            books: book.map((ada) => ({
            id: ada.id,
            name: ada.name,
            publisher: ada.publisher,
            })),
        },
        });
        response.code(200);
        return response;
    }
    if (finished) {
        let book = books.filter((b) => Number(b.finished) === finished);
        const response =  h.response({
        status: 'success',
        data: {
            books: book.map((ada) => ({
            id: ada.id,
            name: ada.name,
            publisher: ada.publisher,
            })),
        },
        });
        response.code(200);
        return response;
    }
  if (!name && !reading && !finished) {
        const response =  h.response({
        status: 'success',
        data: {
            books: books.map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
            })),
        },
        });
        response.code(200);
        return response;
  }
};
const getBookById = (request,h) => {
    const { id } = request.params;

    const book = books.filter((n)=> n.id === id)[0];

    if(book !== undefined){
        const response =  h.response({
            status: 'success',
            data: {
                book,
            }
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
}
const editBook = (request,h) =>{
    const {id} = request.params;
    const {name, year, author,summary,publisher,pageCount,readPage,reading} = request.payload;
    const updatedAt = new Date().toISOString();

    const index = books.findIndex((book)=> book.id === id);
    if(name === undefined){
        const response = h.response({
            status: "fail",
            message: "Gagal memperbarui buku. Mohon isi nama buku"
        });
        response.code(400);
        return response;
    }
    if(readPage > pageCount){
        const response = h.response({
            status: "fail",
            message: "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount"
        });
        response.code(400);
        return response;
    }
    if(index !== -1){
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
            updatedAt
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
}
const deleteBook = (request,h) =>{
    const {id} = request.params;

    const index = books.findIndex((book)=> book.id === id);

    if(index !== -1){
        books.splice(index,1);
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
}

module.exports = {addBook, getAllBook, getBookById, editBook, deleteBook};