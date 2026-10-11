import React from 'react';

const VIEW_TABS = [
  { id: 'active', label: 'All Active' },
  { id: 'pinned', label: 'Pinned' },
  { id: 'snippet', label: 'Code Snippets' },
  { id: 'note', label: 'Text Notes' },
  { id: 'archived', label: 'Archived' },
];

export default function FilterBar({
  activeTab,
  onTabChange,
  tags,
  selectedTag,
  onTagSelect,
}) {
  return (
    <section className="filter-section" aria-label="Filter notes and snippets">
      <div className="tabs-row" role="tablist" aria-label="View filters">
        {VIEW_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {tags.length > 0 && (
        <div className="tags-filter-row">
          <span className="tags-label">Filter by tag:</span>
          <button
            type="button"
            className={`tag-filter-chip ${selectedTag === '' ? 'selected' : ''}`}
            onClick={() => onTagSelect('')}
          >
            All tags
          </button>
          {tags.map((tag) => (
            <button
              key={tag}
              type="button"
              className={`tag-filter-chip ${selectedTag === tag ? 'selected' : ''}`}
              onClick={() => onTagSelect(selectedTag === tag ? '' : tag)}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}

