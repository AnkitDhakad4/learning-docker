import React from 'react';

export default function Header({ search, onSearchChange, stats, onOpenCreate }) {
  return (
    <header className="app-header">
      <div className="brand-block">
        <div className="brand-logo" aria-hidden="true">
          <span>{`</>`}</span>
        </div>
        <div>
          <h1 className="brand-title">DevNotes</h1>
          <p className="brand-subtitle">MERN Notes &amp; Code Snippet Manager</p>
        </div>
      </div>

      <div className="header-controls">
        <div className="search-box">
          <input
            type="search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search title, code, or tags..."
            aria-label="Search notes and snippets"
            className="search-input"
          />
          {search && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={() => onSearchChange('')}
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>

        <button type="button" className="btn btn-primary" onClick={onOpenCreate}>
          + New Entry
        </button>
      </div>

      <div className="stats-bar" aria-label="Workspace statistics">
        <span className="stat-pill">
          <strong>{stats.active ?? 0}</strong> Active
        </span>
        <span className="stat-pill">
          <strong>{stats.pinned ?? 0}</strong> Pinned
        </span>
        <span className="stat-pill">
          <strong>{stats.snippets ?? 0}</strong> Snippets
        </span>
        <span className="stat-pill">
          <strong>{stats.archived ?? 0}</strong> Archived
        </span>
      </div>
    </header>
  );
}

