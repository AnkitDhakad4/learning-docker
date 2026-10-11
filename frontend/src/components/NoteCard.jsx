import React, { useState } from 'react';

export default function NoteCard({
  note,
  onEdit,
  onToggleStatus,
  onDelete,
  onTagClick,
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(note.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Fallback if clipboard API fails
    }
  };

  const formattedDate = new Date(note.updatedAt || note.createdAt).toLocaleDateString(
    undefined,
    {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }
  );

  return (
    <article className={`note-card ${note.isPinned ? 'is-pinned' : ''}`}>
      <div className="note-card-header">
        <div className="note-badges">
          <span className={`type-badge ${note.type}`}>
            {note.type === 'snippet' ? `</> ${note.language || 'code'}` : 'Note'}
          </span>
          {note.isPinned && <span className="pinned-badge">Pinned</span>}
          {note.isArchived && <span className="archived-badge">Archived</span>}
        </div>

        <div className="note-quick-actions">
          {!note.isArchived && (
            <button
              type="button"
              className={`icon-btn ${note.isPinned ? 'active' : ''}`}
              onClick={() => onToggleStatus(note._id, { isPinned: !note.isPinned })}
              title={note.isPinned ? 'Unpin' : 'Pin to top'}
              aria-label={note.isPinned ? 'Unpin item' : 'Pin item'}
            >
              {note.isPinned ? '★' : '☆'}
            </button>
          )}
          <button
            type="button"
            className="icon-btn"
            onClick={() =>
              onToggleStatus(note._id, { isArchived: !note.isArchived })
            }
            title={note.isArchived ? 'Restore from archive' : 'Archive'}
            aria-label={note.isArchived ? 'Restore item' : 'Archive item'}
          >
            {note.isArchived ? '↩' : '📥'}
          </button>
        </div>
      </div>

      <h2 className="note-title">{note.title}</h2>

      {note.type === 'snippet' ? (
        <div className="snippet-container">
          <div className="snippet-toolbar">
            <span className="snippet-lang">{note.language || 'plaintext'}</span>
            <button
              type="button"
              className="copy-btn"
              onClick={handleCopy}
              aria-label="Copy snippet code"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <pre className="snippet-code">
            <code>{note.content}</code>
          </pre>
        </div>
      ) : (
        <p className="note-content">{note.content}</p>
      )}

      {note.tags && note.tags.length > 0 && (
        <div className="note-tags">
          {note.tags.map((tag) => (
            <button
              key={tag}
              type="button"
              className="tag-badge"
              onClick={() => onTagClick(tag)}
              title={`Filter by #${tag}`}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}

      <div className="note-card-footer">
        <span className="note-date">Updated {formattedDate}</span>
        <div className="footer-buttons">
          <button
            type="button"
            className="btn-link"
            onClick={() => onEdit(note)}
          >
            Edit
          </button>
          <button
            type="button"
            className="btn-link danger"
            onClick={() => onDelete(note._id)}
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}

