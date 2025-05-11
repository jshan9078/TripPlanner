import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { Activity } from '../types/activity';

interface ActivityStore {
  activities: Activity[];
  addActivity: (activity: Omit<Activity, 'id'>) => void;
  updateActivity: (activity: Activity) => void;
  deleteActivity: (tripId: string, activityId: string) => void;
}

export const useActivityStore = create<ActivityStore>((set) => ({
  activities: [],
  
  addActivity: (activityData) => set((state) => ({
    activities: [...state.activities, { ...activityData, id: uuidv4() }]
  })),

  updateActivity: (updatedActivity) => set((state) => ({
    activities: state.activities.map(activity =>
      activity.id === updatedActivity.id ? updatedActivity : activity
    )
  })),

  deleteActivity: (tripId, activityId) => set((state) => ({
    activities: state.activities.filter(activity => 
      !(activity.tripId === tripId && activity.id === activityId)
    )
  }))
})); 