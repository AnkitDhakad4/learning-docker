import express from 'express';
import {
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  toggleNoteStatus,
  deleteNote,
} from '../controllers/noteController.js';

const router = express.Router();

// Endpoint 1: GET /api/notes (list + filter by tag/type/search/archived)
// Endpoint 2: POST /api/notes (create a new note or code snippet)
router.route('/').get(getNotes).post(createNote);

// Endpoint 3: PATCH /api/notes/:id/status (pin/unpin or archive/unarchive)
router.patch('/:id/status', toggleNoteStatus);

// Endpoint 4: GET /api/notes/:id (get single item)
// Endpoint 5: PUT /api/notes/:id (edit note/snippet)
// Endpoint 6: DELETE /api/notes/:id (delete note/snippet)
router.route('/:id').get(getNoteById).put(updateNote).delete(deleteNote);

export default router;

