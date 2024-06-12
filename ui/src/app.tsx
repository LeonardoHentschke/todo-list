import { ChangeEvent, useEffect, useState } from 'react';
import { NewNoteCard } from './components/new-note-card';
import { NoteCard } from './components/note-card';
import axios from 'axios';
import { toast } from 'sonner';

interface Note {
  id: string;
  createdAt: Date;
  content: string;
}

export function App() {
  const [search, setSearch] = useState('');
  const [notes, setNotes] = useState<Note[]>([]);

  const fetchNotes = async () => {
    try {
      const { data } = await axios.get('http://localhost:8080/tasks');
      setNotes(data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  useEffect(() => {
    fetchNotes().then((r) => console.log('Notas carregadas - ', r));
  }, []);

  async function onNoteCreated(content: string) {
    try {
      await axios.post('http://localhost:8080/tasks', { content });
      await fetchNotes();
    } catch (error) {
      console.error('Error creating note:', error);
    }
  }

  async function onNoteDeleted(id: string) {
    try {
      await axios.delete(`http://localhost:8080/tasks/${id}`);
      await fetchNotes();

      toast.warning('Nota excluida!');
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  }

  async function onNoteUpdated(id: string, content: string) {
    try {
      await axios.put(`http://localhost:8080/tasks/${id}`, { content });
      await fetchNotes();
    } catch (error) {
      console.error('Error updating note:', error);
    }
  }

  function handleSearch(event: ChangeEvent<HTMLInputElement>) {
    const query = event.target.value;

    setSearch(query);
  }

  const filteredNotes =
    search !== ''
      ? notes.filter((note) => note.content.toLocaleLowerCase().includes(search.toLocaleLowerCase()))
      : notes;

  return (
    <div className="mx-auto my-12 max-w-6xl space-y-6 px-5">
      <form className="w-full">
        <input
          type="text"
          placeholder="Busque em suas notas..."
          className="placeholder:text-state-500 w-full bg-transparent text-3xl font-semibold tracking-tight outline-none"
          onChange={handleSearch}
        />
      </form>

      <div className="h-px bg-slate-700" />

      <div className="grid auto-rows-[250px] grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <NewNoteCard onNoteCreated={onNoteCreated} />

        {filteredNotes.map((note) => {
          return <NoteCard onNoteDeleted={onNoteDeleted} onNoteUpdated={onNoteUpdated} key={note.id} note={note} />;
        })}
      </div>
    </div>
  );
}
