import React from 'react'
import { NoteData, Tag } from '../App'
import NoteForm from './NoteForm'

type NoteFormProps = {
  onSubmit: (data: NoteData) => void
  onAddTag: (tag: Tag) => void
  availableTags: Tag[]
}

function NewNote({ onSubmit, onAddTag, availableTags }: NoteFormProps) {
  return (
    <div>
      <h1 className='mb-4'>New Note</h1>
      <NoteForm onSubmit={onSubmit} availableTags={availableTags} onAddTag={onAddTag} />
    </div>
  )
}

export default NewNote