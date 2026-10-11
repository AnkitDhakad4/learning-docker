import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title for the note or snippet'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    content: {
      type: String,
      required: [true, 'Please provide content or code'],
    },
    type: {
      type: String,
      enum: ['note', 'snippet'],
      default: 'note',
    },
    language: {
      type: String,
      default: 'plaintext',
      trim: true,
      lowercase: true,
    },
    tags: {
      type: [String],
      default: [],
      set: (tags) =>
        Array.isArray(tags)
          ? [...new Set(tags.map((t) => String(t).trim().toLowerCase()).filter(Boolean))]
          : [],
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to optimize queries sorting by pinned status and recent updates
noteSchema.index({ isPinned: -1, updatedAt: -1 });
noteSchema.index({ tags: 1 });

const Note = mongoose.model('Note', noteSchema);

export default Note;

