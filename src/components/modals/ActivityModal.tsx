import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { Activity } from '../../types/trip';

const activityFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string(),
  startTime: z.string(),
  duration: z.number().min(1, "Duration must be at least 1 minute"),
});

type ActivityFormData = z.infer<typeof activityFormSchema>;

interface ActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Activity, 'id' | 'tripId'>) => void;
  initialData?: Activity;
  selectedDate: string;
}

const ActivityModal: React.FC<ActivityModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  selectedDate,
}) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ActivityFormData>({
    resolver: zodResolver(activityFormSchema),
    defaultValues: initialData || {
      title: '',
      description: '',
      startTime: '09:00',
      duration: 60,
    },
  });

  const onSubmitForm = (data: ActivityFormData) => {
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
            {initialData ? 'Edit Activity' : 'Add Activity'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
          <Input
            label="Title"
            {...register('title')}
            error={errors.title?.message}
          />

          <Input
            label="Description"
            {...register('description')}
            error={errors.description?.message}
          />

          <Input
            label="Start Time"
            type="time"
            {...register('startTime')}
            error={errors.startTime?.message}
          />

          <Input
            label="Duration (minutes)"
            type="number"
            {...register('duration', { valueAsNumber: true })}
            error={errors.duration?.message}
          />

          <div className="flex justify-end space-x-2">
            <Button variant="secondary" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button type="submit">
              {initialData ? 'Update' : 'Add'} Activity
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ActivityModal;