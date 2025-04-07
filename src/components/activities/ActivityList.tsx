import React from 'react';
import { Activity } from '../../types/trip';
import { format } from 'date-fns';
import { Clock, Trash2 } from 'lucide-react';
import Button from '../ui/Button';

interface ActivityListProps {
  activities: Activity[];
  onDelete: (id: string) => void;
  onEdit: (activity: Activity) => void;
}

const ActivityList: React.FC<ActivityListProps> = ({
  activities,
  onDelete,
  onEdit,
}) => {
  return (
    <div className="space-y-3">
      {activities.map(activity => (
        <div
          key={activity.id}
          className="bg-gray-50 p-3 rounded-lg hover:shadow transition-shadow"
        >
          <div className="space-y-2">
            <div>
              <h3 className="text-sm font-medium text-gray-900">
                {activity.title}
              </h3>
              <p className="text-xs text-gray-600 mt-0.5">{activity.description}</p>
            </div>
            <div className="flex items-center text-xs text-gray-500">
              <Clock className="w-3 h-3 mr-1" />
              <span>
                {format(new Date(`2000-01-01T${activity.startTime}`), 'h:mm a')} - 
                {activity.duration} min
              </span>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onEdit(activity)}
                className="text-xs py-1 px-2"
              >
                Edit
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => onDelete(activity.id)}
                className="text-xs py-1 px-2"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>
      ))}
      {activities.length === 0 && (
        <p className="text-center text-sm text-gray-500">
          No activities scheduled for this day
        </p>
      )}
    </div>
  );
};

export default ActivityList;