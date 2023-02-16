import React, { useMemo } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Container } from 'react-bootstrap'
import NewNote from './components/NewNote'
import { useLocalStorage } from './hooks/useLocalStorage'
import { v4 as uuid } from 'uuid'

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

  const notesWithTags = useMemo(() => {
    return notes.map((note) => {
      return { ...note, tags: tags.filter((tag) => note.tagIds.includes(tag.id)) }
    })
  }, [])

  const onCreateNote = (data: NoteData) => {
    setNotes(prevNote => {
      return [...prevNote,
      { ...data, id: uuid(), tagIds: tags.map((tag) => tag.id) }
      ]
    })
  }

  return (
    <Container className='my-4'>
      <Routes>
        <Route path='/' element={<p>hi</p>}></Route>
        <Route path='/new' element={<NewNote onSubmit={onCreateNote} onAddTag={addTag} availableTags={tags} />}></Route>
        <Route path='/:id' element={<p>id</p>}>
          <Route index element={<p>id</p>}></Route>
          <Route path='edit' element={<p>edit</p>}></Route>
        </Route>
        <Route path='*' element={<Navigate to={'/'} />}></Route>
      </Routes>

    </Container>
  )
}

export default App