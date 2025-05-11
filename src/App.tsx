import React, { useState } from "react";
import { format } from "date-fns";
import {
  PlusCircle,
  Calendar as CalendarIcon,
  ListTodo,
  MessageSquare,
} from "lucide-react";
import { useTripStore } from "./store/useTripStore";
import { useActivityStore } from "./store/useActivityStore";
import { useNoteStore } from "./store/useNoteStore";
import Calendar from "./components/core/Calendar";
import ActivityList from "./components/activities/ActivityList";
import NoteList from "./components/notes/NoteList";
import ChatBot from "./components/core/ChatBot";
import Button from "./components/ui/Button";
import ActivityModal from "./components/activities/ActivityModal";
import NoteModal from "./components/notes/NoteModal";
import { Activity } from "./types/activity";
import { Note } from "./types/note";

type Tab = "calendar" | "notes" | "assistant";

function App() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState<Tab>("calendar");
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | undefined>();
  const [editingNote, setEditingNote] = useState<Note | undefined>();

  const { trips, addTrip } = useTripStore();
  const { activities, addActivity, updateActivity, deleteActivity } = useActivityStore();
  const { notes, addNote, updateNote, deleteNote } = useNoteStore();

  // For demo purposes, create a trip if none exists
  React.useEffect(() => {
    if (trips.length === 0) {
      addTrip({
        title: "Summer Vacation",
        description: "A relaxing beach getaway",
        startDate: format(new Date(), "yyyy-MM-dd"),
        endDate: format(
          new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          "yyyy-MM-dd"
        ),
      });
    }
  }, []);

  const currentTrip = trips[0]; // For demo, we'll use the first trip

  const activitiesForSelectedDate = activities.filter(
    (activity) => activity.date === format(selectedDate, "yyyy-MM-dd")
  );

  const handleAddActivity = (data: Omit<Activity, "id" | "tripId">) => {
    if (currentTrip) {
      addActivity({ ...data, tripId: currentTrip.id });
    }
  };

  const handleEditActivity = (activity: Activity) => {
    setEditingActivity(activity);
    setIsActivityModalOpen(true);
  };

  const handleUpdateActivity = (data: Omit<Activity, "id" | "tripId">) => {
    if (editingActivity) {
      updateActivity({
        ...editingActivity,
        ...data,
      });
      setEditingActivity(undefined);
    }
  };

  const handleAddNote = (data: Omit<Note, "id" | "tripId">) => {
    if (currentTrip) {
      addNote({ ...data, tripId: currentTrip.id });
    }
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setIsNoteModalOpen(true);
  };

  const handleUpdateNote = (data: Omit<Note, "id" | "tripId">) => {
    if (editingNote) {
      updateNote({
        ...editingNote,
        ...data,
      });
      setEditingNote(undefined);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="w-80 bg-white shadow-lg">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">TripMate</h1>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Activities
              </h2>
              <Button size="sm" onClick={() => setIsActivityModalOpen(true)}>
                <PlusCircle className="w-4 h-4 mr-1" />
                Add
              </Button>
            </div>
            <ActivityList
              activities={activitiesForSelectedDate}
              onDelete={(id) => deleteActivity(currentTrip?.id || "", id)}
              onEdit={handleEditActivity}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex space-x-4 mb-8">
            <Button
              variant={activeTab === "calendar" ? "primary" : "secondary"}
              onClick={() => setActiveTab("calendar")}
            >
              <CalendarIcon className="w-4 h-4 mr-2" />
              Calendar
            </Button>
            <Button
              variant={activeTab === "notes" ? "primary" : "secondary"}
              onClick={() => setActiveTab("notes")}
            >
              <ListTodo className="w-4 h-4 mr-2" />
              Notes
            </Button>
            <Button
              variant={activeTab === "assistant" ? "primary" : "secondary"}
              onClick={() => setActiveTab("assistant")}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Assistant
            </Button>
          </div>

          {activeTab === "calendar" && (
            <Calendar
              activities={activities}
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
            />
          )}

          {activeTab === "notes" && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Notes</h2>
                <Button size="sm" onClick={() => setIsNoteModalOpen(true)}>
                  <PlusCircle className="w-4 h-4 mr-1" />
                  Add Note
                </Button>
              </div>
              <NoteList
                notes={notes}
                onDelete={(id) => deleteNote(currentTrip?.id || "", id)}
                onEdit={handleEditNote}
              />
            </div>
          )}

          {activeTab === "assistant" && <ChatBot />}
        </div>
      </div>

      <ActivityModal
        isOpen={isActivityModalOpen}
        onClose={() => {
          setIsActivityModalOpen(false);
          setEditingActivity(undefined);
        }}
        onSubmit={editingActivity ? handleUpdateActivity : handleAddActivity}
        initialData={editingActivity}
        selectedDate={format(selectedDate, "yyyy-MM-dd")}
      />

      <NoteModal
        isOpen={isNoteModalOpen}
        onClose={() => {
          setIsNoteModalOpen(false);
          setEditingNote(undefined);
        }}
        onSubmit={editingNote ? handleUpdateNote : handleAddNote}
        initialData={editingNote}
      />
    </div>
  );
}

export default App;
