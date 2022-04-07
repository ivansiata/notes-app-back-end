const { nanoid } = require("nanoid");
const notes = require("./notes");

const getNotesHandler = () => ({
  status: 'success',
  data: {
    notes,
  },
});

const getNoteHandler = (request, h) => {
  const { id } = request.params;
  const note = notes.filter((n) => n.id === id)[0];
  if (note !== undefined) {
    return {
      status: 'success',
      data: {
        note,
      },
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'Catatan tidak ditemukan',
  });
  response.code(404);
  return response;
};

const addNoteHandler = (request, h) => {
  const { title, tags, body } = request.payload;
  const id = nanoid(16);
  const createdAt = new Date().toISOString();
  const updatedAt = new Date().toISOString();
  const newNote = {
    id, title, tags, body, createdAt, updatedAt,
  };
  notes.push(newNote);
  console.log(notes);
  const isSuccess = notes.filter((note) => note.id === id).length > 0;
  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil ditambahkan',
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Catatan gagal ditambahkan',
  });

  response.code(500);
  return response;
};

const editNoteHandler = (request, h) => {
  const { id } = request.params;
  const { title, tags, body } = request.payload;
  const updatedAt = new Date().toISOString();
  const index = notes.findIndex((n) => n.id === id);
  if (index !== -1) {
    notes[index] = {
      ...notes[index],
      title,
      tags,
      body,
      updatedAt,
    };
    return {
      status: 'success',
      message: 'Catatan berhasil diperbaharui',
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'Catatan tidak ditemukan',
  });
  response.code(404);
  return response;
};

const deleteNoteHandler = (request, h) => {
  const { id } = request.params;
  const index = notes.findIndex((n) => n.id === id);
  if (index !== -1) {
    notes.splice(index, 1);
    return {
      status: 'success',
      message: 'Catatan berhasil dihapus',
    };
  }
  const response = h.response({
    status: 'fail',
    message: 'Catatan tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = { addNoteHandler, getNotesHandler, getNoteHandler, editNoteHandler, deleteNoteHandler };
