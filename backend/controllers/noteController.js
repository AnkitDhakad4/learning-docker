import Note from '../models/Note.js';

/**
 * @desc    Get all notes & snippets (supports tag, type, archived, pinned, and search query filters)
 * @route   GET /api/notes
 * @access  Public
 */
export const getNotes = async (req, res, next) => {
  try {
    const { tag, type, archived, pinned, search } = req.query;
    const filter = {};

    // Filter by archive state (defaults to active / non-archived unless specified)
    if (archived === 'true') {
      filter.isArchived = true;
    } else if (archived === 'false') {
      filter.isArchived = false;
    }

    // Filter by pinned state
    if (pinned === 'true') {
      filter.isPinned = true;
    } else if (pinned === 'false') {
      filter.isPinned = false;
    }

    // Filter by entry type ('note' or 'snippet')
    if (type && ['note', 'snippet'].includes(type.toLowerCase())) {
      filter.type = type.toLowerCase();
    }

    // Filter by specific tag
    if (tag && tag.trim() !== '') {
      filter.tags = tag.trim().toLowerCase();
    }

    // Search in title, content, or tags
    if (search && search.trim() !== '') {
      const regex = new RegExp(search.trim(), 'i');
      filter.$or = [{ title: regex }, { content: regex }, { tags: regex }];
    }

    const [notes, allTags, totalActive, totalPinned, totalArchived, totalSnippets] =
      await Promise.all([
        Note.find(filter).sort({ isPinned: -1, updatedAt: -1 }),
        Note.distinct('tags'),
        Note.countDocuments({ isArchived: false }),
        Note.countDocuments({ isPinned: true, isArchived: false }),
        Note.countDocuments({ isArchived: true }),
        Note.countDocuments({ type: 'snippet', isArchived: false }),
      ]);

    res.status(200).json({
      success: true,
      count: notes.length,
      stats: {
        active: totalActive,
        pinned: totalPinned,
        archived: totalArchived,
        snippets: totalSnippets,
      },
      tags: allTags.sort(),
      data: notes,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single note or snippet by ID
 * @route   GET /api/notes/:id
 * @access  Public
 */
export const getNoteById = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      res.status(404);
      throw new Error('Note or snippet not found');
    }

    res.status(200).json({
      success: true,
      data: note,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new note or snippet
 * @route   POST /api/notes
 * @access  Public
 */
export const createNote = async (req, res, next) => {
  try {
    const { title, content, type, language, tags, isPinned, isArchived } = req.body;

    const note = await Note.create({
      title,
      content,
      type: type || 'note',
      language: type === 'snippet' ? language || 'javascript' : 'plaintext',
      tags: Array.isArray(tags)
        ? tags
        : typeof tags === 'string'
        ? tags
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean)
        : [],
      isPinned: Boolean(isPinned),
      isArchived: Boolean(isArchived),
    });

    res.status(201).json({
      success: true,
      data: note,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update an existing note or snippet (full/partial fields)
 * @route   PUT /api/notes/:id
 * @access  Public
 */
export const updateNote = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      res.status(404);
      throw new Error('Note or snippet not found');
    }

    const { title, content, type, language, tags, isPinned, isArchived } = req.body;

    if (title !== undefined) note.title = title;
    if (content !== undefined) note.content = content;
    if (type !== undefined) note.type = type;
    if (language !== undefined) note.language = language;
    if (tags !== undefined) {
      note.tags = Array.isArray(tags)
        ? tags
        : typeof tags === 'string'
        ? tags
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean)
        : [];
    }
    if (isPinned !== undefined) note.isPinned = Boolean(isPinned);
    if (isArchived !== undefined) note.isArchived = Boolean(isArchived);

    const updatedNote = await note.save();

    res.status(200).json({
      success: true,
      data: updatedNote,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Toggle pin or archive status of a note/snippet
 * @route   PATCH /api/notes/:id/status
 * @access  Public
 */
export const toggleNoteStatus = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      res.status(404);
      throw new Error('Note or snippet not found');
    }

    const { isPinned, isArchived } = req.body;

    if (typeof isPinned === 'boolean') {
      note.isPinned = isPinned;
    }
    if (typeof isArchived === 'boolean') {
      note.isArchived = isArchived;
      // Unpin automatically if archiving
      if (isArchived) {
        note.isPinned = false;
      }
    }

    const updatedNote = await note.save();

    res.status(200).json({
      success: true,
      data: updatedNote,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a note or snippet permanently
 * @route   DELETE /api/notes/:id
 * @access  Public
 */
export const deleteNote = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      res.status(404);
      throw new Error('Note or snippet not found');
    }

    await note.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Note deleted successfully',
      id: req.params.id,
    });
  } catch (error) {
    next(error);
  }
};

