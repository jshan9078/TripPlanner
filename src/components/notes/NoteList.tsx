import React from 'react';
import { Note } from '../../types/trip';
import { format } from 'date-fns';
import { Trash2 } from 'lucide-react';
import Button from '../ui/Button';

interface NoteListProps {
  notes: Note[];
  onDelete: (id: string) => void;
  onEdit: (note: Note) => void;
}

const NoteList: React.FC<NoteListProps> = ({
  notes,
  onDelete,
  onEdit,
}) => {
  return (
    <div className="space-y-4">
      {notes.map(note => (
        <div
          key={note.id}
          className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <p className="text-gray-900 whitespace-pre-wrap">{note.content}</p>
              <p className="text-sm text-gray-500 mt-2">
                {format(new Date(note.date), 'MMM d, yyyy')}
              </p>
            </div>
            <div className="flex space-x-2 ml-4">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onEdit(note)}
              >
                Edit
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => onDelete(note.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}
      {notes.length === 0 && (
        <p className="text-center text-gray-500">
          No notes added yet
        </p>
      )}
    </div>
  );
};

export default NoteList;