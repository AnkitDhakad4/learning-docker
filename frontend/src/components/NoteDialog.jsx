import React, { useEffect, useRef, useState } from 'react';

const LANGUAGES = [
  'javascript',
  'typescript',
  'python',
  'sql',
  'bash',
  'json',
  'html',
  'css',
  'go',
  'rust',
  'plaintext',
];

const INITIAL_FORM = {
  title: '',
  content: '',
  type: 'note',
  language: 'javascript',
  tagsInput: '',
  isPinned: false,
};

export default function NoteDialog({
  isOpen,
  initialData,
  onClose,
  onSave,
  isSubmitting,
}) {
  const dialogRef = useRef(null);
  const [formData, setFormData] = useState(INITIAL_FORM);

  // Sync initialData into form state when dialog opens
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        content: initialData.content || '',
        type: initialData.type || 'note',
        language: initialData.language || 'javascript',
        tagsInput: Array.isArray(initialData.tags) ? initialData.tags.join(', ') : '',
        isPinned: Boolean(initialData.isPinned),
      });
    } else {
      setFormData(INITIAL_FORM);
    }
  }, [initialData, isOpen]);

  // Open / close native <dialog> using showModal()
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) {
      dialog.showModal();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  // Fallback for browsers without native <dialog closedby="any"> support + close listener
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleNativeClose = () => {
      onClose();
    };

    const handleBackdropClickFallback = (event) => {
      // Only run fallback if closedBy is not supported natively
      if ('closedBy' in HTMLDialogElement.prototype) return;

      if (event.target !== dialog) return;

      const rect = dialog.getBoundingClientRect();
      const isDialogContent =
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.left + rect.width;

      if (isDialogContent) return;

      dialog.close();
    };

    dialog.addEventListener('close', handleNativeClose);
    dialog.addEventListener('click', handleBackdropClickFallback);

    return () => {
      dialog.removeEventListener('close', handleNativeClose);
      dialog.removeEventListener('click', handleBackdropClickFallback);
    };
  }, [onClose]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const tags = formData.tagsInput
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    onSave({
      title: formData.title.trim(),
      content: formData.content,
      type: formData.type,
      language: formData.type === 'snippet' ? formData.language : 'plaintext',
      tags,
      isPinned: formData.isPinned,
    });
  };

  return (
    <dialog
      ref={dialogRef}
      closedby="any"
      aria-labelledby="noteDialogTitle"
      className="note-dialog"
    >
      <form onSubmit={handleSubmit} className="dialog-form">
        <div className="dialog-header">
          <h2 id="noteDialogTitle">
            {initialData ? 'Edit Entry' : 'Create New Note / Snippet'}
          </h2>
          <button
            type="button"
            className="dialog-close-btn"
            onClick={() => dialogRef.current?.close()}
            aria-label="Close dialog"
          >
            ×
          </button>
        </div>

        <div className="form-row-split">
          <div className="form-group">
            <label htmlFor="entryType">Entry Type</label>
            <select
              id="entryType"
              value={formData.type}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, type: e.target.value }))
              }
            >
              <option value="note">Text Note</option>
              <option value="snippet">Code Snippet</option>
            </select>
          </div>

          {formData.type === 'snippet' && (
            <div className="form-group">
              <label htmlFor="snippetLanguage">Language</label>
              <select
                id="snippetLanguage"
                value={formData.language}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, language: e.target.value }))
                }
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="entryTitle">Title</label>
          <input
            id="entryTitle"
            type="text"
            required
            maxLength={120}
            placeholder="e.g., Express JWT Auth Middleware"
            value={formData.title}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, title: e.target.value }))
            }
          />
        </div>

        <div className="form-group">
          <label htmlFor="entryContent">
            {formData.type === 'snippet' ? 'Code Snippet' : 'Note Content'}
          </label>
          <textarea
            id="entryContent"
            required
            rows={formData.type === 'snippet' ? 8 : 5}
            className={formData.type === 'snippet' ? 'code-textarea' : ''}
            placeholder={
              formData.type === 'snippet'
                ? 'Paste or type your code snippet here...'
                : 'Write your note here...'
            }
            value={formData.content}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, content: e.target.value }))
            }
          />
        </div>

        <div className="form-group">
          <label htmlFor="entryTags">Tags (comma-separated)</label>
          <input
            id="entryTags"
            type="text"
            placeholder="e.g., react, hooks, api, mongodb"
            value={formData.tagsInput}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, tagsInput: e.target.value }))
            }
          />
        </div>

        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={formData.isPinned}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, isPinned: e.target.checked }))
            }
          />
          <span>Pin to top of workspace</span>
        </label>

        <div className="dialog-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => dialogRef.current?.close()}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? 'Saving...'
              : initialData
              ? 'Save Changes'
              : 'Create Entry'}
          </button>
        </div>
      </form>
    </dialog>
  );
}

