import React, { useCallback, useEffect, useState } from 'react';
import {
  fetchNotes,
  createNoteItem,
  updateNoteItem,
  toggleNoteStatusItem,
  deleteNoteItem,
} from './api/noteApi.js';
import Header from './components/Header.jsx';
import FilterBar from './components/FilterBar.jsx';
import NoteCard from './components/NoteCard.jsx';
import NoteDialog from './components/NoteDialog.jsx';

export default function App() {
  const [notes, setNotes] = useState([]);
  const [tags, setTags] = useState([]);
  const [stats, setStats] = useState({
    active: 0,
    pinned: 0,
    archived: 0,
    snippets: 0,
  });

  // Query filters sent to GET /api/notes
  const [activeTab, setActiveTab] = useState('active');
  const [selectedTag, setSelectedTag] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // UI states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadNotes = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const queryParams = {
        tag: selectedTag || undefined,
        search: searchQuery.trim() || undefined,
        archived: activeTab === 'archived' ? 'true' : 'false',
      };

      if (activeTab === 'pinned') {
        queryParams.pinned = 'true';
      } else if (activeTab === 'snippet' || activeTab === 'note') {
        queryParams.type = activeTab;
      }

      const result = await fetchNotes(queryParams);
      setNotes(result.data || []);
      setTags(result.tags || []);
      if (result.stats) {
        setStats(result.stats);
      }
    } catch (err) {
      setError(
        err.message ||
          'Failed to connect to the backend API. Make sure the Express server & MongoDB are running.'
      );
    } finally {
      setLoading(false);
    }
  }, [activeTab, selectedTag, searchQuery]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadNotes();
    }, 200);
    return () => clearTimeout(timer);
  }, [loadNotes]);

  const handleOpenCreate = () => {
    setEditingNote(null);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (note) => {
    setEditingNote(note);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = useCallback(() => {
    setIsDialogOpen(false);
    setEditingNote(null);
  }, []);

  const handleSaveNote = async (formPayload) => {
    setIsSubmitting(true);
    setError('');
    try {
      if (editingNote) {
        await updateNoteItem(editingNote._id, formPayload);
      } else {
        await createNoteItem(formPayload);
      }
      setIsDialogOpen(false);
      setEditingNote(null);
      await loadNotes();
    } catch (err) {
      setError(err.message || 'Could not save note');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (id, statusPatch) => {
    setError('');
    try {
      await toggleNoteStatusItem(id, statusPatch);
      await loadNotes();
    } catch (err) {
      setError(err.message || 'Could not update status');
    }
  };

  const handleDeleteNote = async (id) => {
    setError('');
    try {
      await deleteNoteItem(id);
      await loadNotes();
    } catch (err) {
      setError(err.message || 'Could not delete item');
    }
  };

  const handleTagClick = (tag) => {
    setSelectedTag((prev) => (prev === tag ? '' : tag));
  };

  return (
    <div className="app-shell">
      <Header
        search={searchQuery}
        onSearchChange={setSearchQuery}
        stats={stats}
        onOpenCreate={handleOpenCreate}
      />

      <main className="main-container">
        <FilterBar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          tags={tags}
          selectedTag={selectedTag}
          onTagSelect={setSelectedTag}
        />

        {error && (
          <div className="alert-banner" role="alert">
            <span>{error}</span>
            <button
              type="button"
              className="btn-link"
              onClick={loadNotes}
            >
              Retry
            </button>
          </div>
        )}

        {loading ? (
          <div className="empty-state">
            <p>Loading notes &amp; snippets...</p>
          </div>
        ) : notes.length === 0 ? (
          <div className="empty-state">
            <h3>No matching entries found</h3>
            <p>
              {selectedTag || searchQuery
                ? 'Try clearing your active tag or search filter.'
                : 'Click "+ New Entry" to create your first note or code snippet.'}
            </p>
            {(selectedTag || searchQuery) && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setSelectedTag('');
                  setSearchQuery('');
                }}
              >
                Reset Filters
              </button>
            )}
          </div>
        ) : (
          <section className="notes-grid" aria-label="Notes and snippets list">
            {notes.map((note) => (
              <NoteCard
                key={note._id}
                note={note}
                onEdit={handleOpenEdit}
                onToggleStatus={handleToggleStatus}
                onDelete={handleDeleteNote}
                onTagClick={handleTagClick}
              />
            ))}
          </section>
        )}
      </main>
      <NoteDialog
        isOpen={isDialogOpen}
        initialData={editingNote}
        onClose={handleCloseDialog}
        onSave={handleSaveNote}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}

