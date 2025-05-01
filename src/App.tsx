import React, { useState } from "react";
import { format } from "date-fns";
import {
  PlusCircle,
  Calendar as CalendarIcon,
  ListTodo,
  MessageSquare,
} from "lucide-react";
import { useTripStore } from "./store/useTripStore";
import Calendar from "./components/core/Calendar";
import ActivityList from "./components/activities/ActivityList";
import NoteList from "./components/notes/NoteList";
import ChatBot from "./components/core/ChatBot";
import Button from "./components/ui/Button";
import ActivityModal from "./components/activities/ActivityModal";
import NoteModal from "./components/notes/NoteModal";
import { Activity, Note } from "./types/trip";

type Tab = "calendar" | "notes" | "assistant";

function App() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState<Tab>("calendar");
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<
    Activity | undefined
  >();
  const [editingNote, setEditingNote] = useState<Note | undefined>();

  const {
    trips,
    addTrip,
    addActivity,
    updateActivity,
    deleteActivity,
    addNote,
    updateNote,
    deleteNote,
  } = useTripStore();

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

  const activitiesForSelectedDate =
    currentTrip?.activities.filter(
      (activity) => activity.date === format(selectedDate, "yyyy-MM-dd")
    ) || [];

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
        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab("calendar")}
              className={`py-2 px-4 border-b-2 font-medium text-sm flex items-center ${
                activeTab === "calendar"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <CalendarIcon className="w-4 h-4 mr-2" />
              Calendar
            </button>
            <button
              onClick={() => setActiveTab("notes")}
              className={`py-2 px-4 border-b-2 font-medium text-sm flex items-center ${
                activeTab === "notes"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <ListTodo className="w-4 h-4 mr-2" />
              Notes
            </button>
            <button
              onClick={() => setActiveTab("assistant")}
              className={`py-2 px-4 border-b-2 font-medium text-sm flex items-center ${
                activeTab === "assistant"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Assistant
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          {activeTab === "calendar" ? (
            <Calendar
              activities={currentTrip?.activities || []}
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
            />
          ) : activeTab === "notes" ? (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Trip Notes
                </h2>
                <Button onClick={() => setIsNoteModalOpen(true)}>
                  <PlusCircle className="w-5 h-5 mr-2" />
                  Add Note
                </Button>
              </div>
              <NoteList
                notes={currentTrip?.notes || []}
                onDelete={(id) => deleteNote(currentTrip?.id || "", id)}
                onEdit={handleEditNote}
              />
            </div>
          ) : (
            <ChatBot />
          )}
        </div>
      </div>

      {/* Modals */}
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
        selectedDate={format(selectedDate, "yyyy-MM-dd")}
      />
    </div>
  );
}

export default App;
