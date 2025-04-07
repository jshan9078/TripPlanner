import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import Button from '../ui/Button';
import { Note } from '../../types/trip';

const noteFormSchema = z.object({
  content: z.string().min(1, "Note content is required"),
});

type NoteFormData = z.infer<typeof noteFormSchema>;

interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Note, 'id' | 'tripId'>) => void;
  initialData?: Note;
  selectedDate: string;
}

const NoteModal: React.FC<NoteModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  selectedDate,
}) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<NoteFormData>({
    resolver: zodResolver(noteFormSchema),
    defaultValues: initialData || {
      content: '',
    },
  });

  const onSubmitForm = (data: NoteFormData) => {
    onSubmit({
      ...data,
      date: selectedDate,
    });
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {initialData ? 'Edit Note' : 'Add Note'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Note
            </label>
            <textarea
              {...register('content')}
              className={`
                w-full rounded-md border-gray-300 shadow-sm
                focus:border-blue-500 focus:ring-blue-500
                ${errors.content ? 'border-red-300' : 'border-gray-300'}
              `}
              rows={4}
            />
            {errors.content && (
              <p className="text-sm text-red-600 mt-1">{errors.content.message}</p>
            )}
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="secondary" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button type="submit">
              {initialData ? 'Update' : 'Add'} Note
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NoteModal;