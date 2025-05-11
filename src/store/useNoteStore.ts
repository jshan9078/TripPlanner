import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { Note } from '../types/note';

interface NoteStore {
  notes: Note[];
  addNote: (note: Omit<Note, 'id'>) => void;
  updateNote: (note: Note) => void;
  deleteNote: (tripId: string, noteId: string) => void;
}

export const useNoteStore = create<NoteStore>((set) => ({
  notes: [],
  
  addNote: (noteData) => set((state) => ({
    notes: [...state.notes, { ...noteData, id: uuidv4() }]
  })),

  updateNote: (updatedNote) => set((state) => ({
    notes: state.notes.map(note =>
      note.id === updatedNote.id ? updatedNote : note
    )
  })),

  deleteNote: (tripId, noteId) => set((state) => ({
    notes: state.notes.filter(note => 
      !(note.tripId === tripId && note.id === noteId)
    )
  }))
})); 