import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { Trip } from '../types/trip';

interface TripStore {
  trips: Trip[];
  addTrip: (trip: Omit<Trip, 'id' | 'activities' | 'notes'>) => void;
  updateTrip: (trip: Trip) => void;
  deleteTrip: (id: string) => void;
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
  }))
}));