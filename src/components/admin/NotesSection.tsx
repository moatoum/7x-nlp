'use client';

import { useState } from 'react';
import { StickyNote, Eye, EyeOff, Send } from 'lucide-react';
import { cn } from '@/lib/cn';
import { timeAgo } from '@/lib/formatters';
import { useSubmissionsStore } from '@/store/submissionsStore';
import type { Note } from '@/engine/types';

interface NotesSectionProps {
  submissionId: string;
  notes: Note[];
}

export function NotesSection({ submissionId, notes }: NotesSectionProps) {
  const addNote = useSubmissionsStore((s) => s.addNote);
  const [content, setContent] = useState('');
  const [visibility, setVisibility] = useState<'internal' | 'external'>('internal');

  const handleSubmit = () => {
    if (!content.trim()) return;
    addNote(submissionId, {
      id: crypto.randomUUID(),
      content: content.trim(),
      visibility,
      createdAt: Date.now(),
      author: 'Admin',
    });
    setContent('');
  };

  const sortedNotes = [...notes].sort((a, b) => b.createdAt - a.createdAt);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-gray-50">
        <div className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center">
          <StickyNote className="w-3.5 h-3.5 text-gray-400" />
        </div>
        <h3 className="text-[13px] font-semibold text-gray-900">Notes</h3>
        {notes.length > 0 && (
          <span className="ml-auto text-[11px] text-gray-300 font-medium">{notes.length}</span>
        )}
      </div>

      <div className="p-5 space-y-4">
        {/* Input form */}
        <div className="space-y-3">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Add a note..."
            rows={3}
            className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-[13px] text-gray-800 placeholder:text-gray-300 resize-none focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 transition-all"
          />

          <div className="flex items-center justify-between">
            {/* Visibility toggle */}
            <div className="flex bg-gray-100 rounded-xl p-1 gap-0.5">
              <button
                onClick={() => setVisibility('internal')}
                className={cn(
                  'flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-[11px] font-semibold transition-all',
                  visibility === 'internal'
                    ? 'bg-white shadow-sm text-gray-700'
                    : 'text-gray-400 hover:text-gray-600'
                )}
              >
                <EyeOff className="w-3 h-3" />
                Internal
              </button>
              <button
                onClick={() => setVisibility('external')}
                className={cn(
                  'flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-[11px] font-semibold transition-all',
                  visibility === 'external'
                    ? 'bg-white shadow-sm text-blue-600'
                    : 'text-gray-400 hover:text-gray-600'
                )}
              >
                <Eye className="w-3 h-3" />
                External
              </button>
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={!content.trim()}
              className={cn(
                'flex items-center gap-1.5 py-1.5 px-3.5 rounded-lg text-[11px] font-semibold transition-all',
                content.trim()
                  ? 'bg-gray-900 text-white hover:bg-gray-800'
                  : 'bg-gray-100 text-gray-300 cursor-not-allowed'
              )}
            >
              <Send className="w-3 h-3" />
              Add Note
            </button>
          </div>
        </div>

        {/* Notes list */}
        {sortedNotes.length > 0 ? (
          <div className="space-y-2 pt-1">
            {sortedNotes.map((note) => (
              <div
                key={note.id}
                className="p-3 rounded-xl bg-gray-50/50 border border-gray-50"
              >
                <p className="text-[13px] text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {note.content}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[11px] text-gray-300">{timeAgo(note.createdAt)}</span>
                  <span className="w-px h-2.5 bg-gray-200" />
                  <span className="text-[11px] text-gray-300">{note.author}</span>
                  <span className="w-px h-2.5 bg-gray-200" />
                  <span
                    className={cn(
                      'inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded',
                      note.visibility === 'external'
                        ? 'bg-blue-50 text-blue-500'
                        : 'bg-gray-100 text-gray-400'
                    )}
                  >
                    {note.visibility === 'external' ? (
                      <Eye className="w-2.5 h-2.5" />
                    ) : (
                      <EyeOff className="w-2.5 h-2.5" />
                    )}
                    {note.visibility === 'external' ? 'External' : 'Internal'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[12px] text-gray-300 text-center py-2">No notes yet</p>
        )}
      </div>
    </div>
  );
}
