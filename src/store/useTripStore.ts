import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { Trip, Activity, Note } from '../types/trip';

interface TripStore {
  trips: Trip[];
  addTrip: (trip: Omit<Trip, 'id' | 'activities' | 'notes'>) => void;
  updateTrip: (trip: Trip) => void;
  deleteTrip: (id: string) => void;
  addActivity: (activity: Omit<Activity, 'id'>) => void;
  updateActivity: (activity: Activity) => void;
  deleteActivity: (tripId: string, activityId: string) => void;
  addNote: (note: Omit<Note, 'id'>) => void;
  updateNote: (note: Note) => void;
  deleteNote: (tripId: string, noteId: string) => void;
}

export const useTripStore = create<TripStore>((set) => ({
  trips: [],
  
  addTrip: (tripData) => set((state) => ({
    trips: [...state.trips, {
      ...tripData,
      id: uuidv4(),
      activities: [],
      notes: []
    }]
  })),

  updateTrip: (updatedTrip) => set((state) => ({
    trips: state.trips.map(trip => 
      trip.id === updatedTrip.id ? updatedTrip : trip
    )
  })),

  deleteTrip: (id) => set((state) => ({
    trips: state.trips.filter(trip => trip.id !== id)
  })),

  addActivity: (activityData) => set((state) => ({
    trips: state.trips.map(trip => {
      if (trip.id === activityData.tripId) {
        return {
          ...trip,
          activities: [...trip.activities, { ...activityData, id: uuidv4() }]
        };
      }
      return trip;
    })
  })),

  updateActivity: (updatedActivity) => set((state) => ({
    trips: state.trips.map(trip => {
      if (trip.id === updatedActivity.tripId) {
        return {
          ...trip,
          activities: trip.activities.map(activity =>
            activity.id === updatedActivity.id ? updatedActivity : activity
          )
        };
      }
      return trip;
    })
  })),

  deleteActivity: (tripId, activityId) => set((state) => ({
    trips: state.trips.map(trip => {
      if (trip.id === tripId) {
        return {
          ...trip,
          activities: trip.activities.filter(activity => activity.id !== activityId)
        };
      }
      return trip;
    })
  })),

  addNote: (noteData) => set((state) => ({
    trips: state.trips.map(trip => {
      if (trip.id === noteData.tripId) {
        return {
          ...trip,
          notes: [...trip.notes, { ...noteData, id: uuidv4() }]
        };
      }
      return trip;
    })
  })),

  updateNote: (updatedNote) => set((state) => ({
    trips: state.trips.map(trip => {
      if (trip.id === updatedNote.tripId) {
        return {
          ...trip,
          notes: trip.notes.map(note =>
            note.id === updatedNote.id ? updatedNote : note
          )
        };
      }
      return trip;
    })
  })),

  deleteNote: (tripId, noteId) => set((state) => ({
    trips: state.trips.map(trip => {
      if (trip.id === tripId) {
        return {
          ...trip,
          notes: trip.notes.filter(note => note.id !== noteId)
        };
      }
      return trip;
    })
  }))
}));