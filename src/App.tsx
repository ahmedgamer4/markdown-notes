import React, { useMemo } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Container } from 'react-bootstrap'
import NewNote from './components/NewNote'
import { useLocalStorage } from './hooks/useLocalStorage'
import { v4 as uuid } from 'uuid'
import NoteList from './components/NoteList'
import NoteLayout from './components/NoteLayout'
import Note from './components/Note'
import EditNote from './components/EditNote'

export type Note = {
  id: string
} & NoteData // this creates a new type with id and NoteData

export type RawNote = {
  id: string
} & RawNoteData

export type RawNoteData = {
  title: string,
  markdown: string,
  tagIds: string[]
}

export type NoteData = {
  title: string,
  markdown: string,
  tags: Tag[]
}

export type Tag = {
  id: string,
  label: string
}

function App() {
  const [notes, setNotes] = useLocalStorage<RawNote[]>('NOTES', [])
  const [tags, setTags] = useLocalStorage<Tag[]>('TAGS', [])

  const addTag = (tag: Tag) => {
    setTags((prev) => [...prev, tag])
  }

  const updateTag = (id: string, label: string) => {
    setTags(prevTags => {
      return prevTags.map(tag => {
        if (tag.id === id) {
          return { ...tag, label }
        }
        else {
          return tag
        }
      })
    })
  }

  const deleteTag = (id: string) => {
    setTags((prevTags) => {
      console.log('deleted ', id)
      return prevTags.filter((tag) => tag.id !== id)
    })
  }

  const notesWithTags = useMemo(() => {
    return notes.map((note) => {
      return { ...note, tags: tags.filter((tag) => note.tagIds.includes(tag.id)) }
    })
  }, [notes, tags])

  const onCreateNote = (data: NoteData) => {
    setNotes(prevNote => {
      return [...prevNote,
      { ...data, id: uuid(), tagIds: tags.map((tag) => tag.id) }
      ]
    })
  }

  const onUpdateNote = (id: string, { tags, ...data }: NoteData) => {
    setNotes(prevNotes => {
      return prevNotes.map((prevNote) => {
        if (prevNote.id === id) {
          return { ...prevNote, ...data, tagIds: tags.map((tag) => tag.id) }
        }
        else {
          return prevNote
        }
      })
    })
  }

  const onDeleteNote = (id: string) => {
    setNotes((prevNotes) => {
      console.log('deleted ', id)
      return prevNotes.filter((note) => note.id !== id)
    })
  }

  return (
    <Container className='my-4'>
      <Routes>
        <Route path='/' element={<NoteList updateTag={updateTag} deleteTag={deleteTag} notes={notesWithTags} availableTags={tags} />}></Route>
        <Route path='/new' element={<NewNote onSubmit={onCreateNote} onAddTag={addTag} availableTags={tags} />}></Route>
        <Route path='/:id' element={<NoteLayout notes={notesWithTags} />}>
          <Route index element={<Note onDeleteNote={onDeleteNote} />}></Route>
          <Route path='edit' element={<EditNote
            onSubmit={onUpdateNote}
            availableTags={tags}
            onAddTag={addTag}
          />}></Route>
        </Route>
        <Route path='*' element={<Navigate to={'/'} />}></Route>
      </Routes>

    </Container>
  )
}

export default App