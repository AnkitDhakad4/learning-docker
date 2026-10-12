// VITE_API_URL should point to the notes endpoint, not just the API server root.
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/notes';

async function handleResponse(response) {
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.message || `Request failed with status ${response.status}`);
  }
  return payload;
}

/**
 * 1. GET /api/notes — Fetch notes & snippets with optional filters (tag, type, archived, pinned, search)
 */
export async function fetchNotes(params = {}) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  const url = queryString ? `${API_BASE_URL}?${queryString}` : API_BASE_URL;

  const response = await fetch(url);
  return handleResponse(response);
}

/**
 * 2. GET /api/notes/:id — Fetch a single note or snippet by ID
 */
export async function fetchNoteById(id) {
  const response = await fetch(`${API_BASE_URL}/${id}`);
  return handleResponse(response);
}

/**
 * 3. POST /api/notes — Create a new note or snippet
 */
export async function createNoteItem(noteData) {
  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(noteData),
  });
  return handleResponse(response);
}

/**
 * 4. PUT /api/notes/:id — Update an existing note or snippet
 */
export async function updateNoteItem(id, noteData) {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(noteData),
  });
  return handleResponse(response);
}

/**
 * 5. PATCH /api/notes/:id/status — Toggle pin or archive status
 */
export async function toggleNoteStatusItem(id, statusPatch) {
  const response = await fetch(`${API_BASE_URL}/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(statusPatch),
  });
  return handleResponse(response);
}

/**
 * 6. DELETE /api/notes/:id — Permanently delete a note or snippet
 */
export async function deleteNoteItem(id) {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'DELETE',
  });
  return handleResponse(response);
}

