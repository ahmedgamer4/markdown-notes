import React, { FormEvent, useRef, useState } from 'react'
import { Button, Col, Form, Row, Stack } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import CreatableSelect from 'react-select/creatable'
import { NoteData, Tag } from '../App'
import { v4 as uuid } from 'uuid'

type NoteFormProps = {
  onSubmit: (data: NoteData) => void
  onAddTag: (tag: Tag) => void
  availableTags: Tag[]
} & Partial<NoteData>

function NoteForm({ onSubmit, onAddTag, availableTags, title = '', markdown = '', tags = [] }: NoteFormProps) {
  const titleRef = useRef<HTMLInputElement>(null)
  const markdonwnRef = useRef<HTMLTextAreaElement>(null)
  const [selectedTags, setSelectedTags] = useState<Tag[]>(tags)
  const navigate = useNavigate()

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    onSubmit({
      title: titleRef.current!.value, // the exlamation point ensures that these field could not be null cause we have put required on input fields
      markdown: markdonwnRef.current!.value,
      tags: selectedTags
    })

    navigate('..')
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Stack>
        <Row>
          <Col>
            <Form.Group controlId='title'>
              <Form.Label>Title</Form.Label>
              <Form.Control ref={titleRef} defaultValue={title} required />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId='tags'>
              <Form.Label>Tags</Form.Label>
              <CreatableSelect
                value={selectedTags.map((tag) => {
                  return { label: tag.label, value: tag.id }
                })}
                onChange={(tags) => {
                  setSelectedTags(tags.map((tag) => {
                    return { label: tag.label, id: tag.value }
                  }))
                }}
                onCreateOption={(label) => {
                  const newTag = { id: uuid(), label }
                  onAddTag(newTag)
                  setSelectedTags((prev) => [...prev, newTag])
                }}
                options={availableTags.map(tag => {
                  return { label: tag.label, value: tag.id }
                })}
                isMulti />
            </Form.Group>
          </Col>
        </Row>
        <Form.Group controlId='markdown'>
          <Form.Label>Body</Form.Label>
          <Form.Control required as='textarea' ref={markdonwnRef} defaultValue={markdown} rows={15} />
        </Form.Group>
        <Stack direction='horizontal' gap={2} className='justify-content-end mt-3'>
          <Button type='submit' variant='primary'>Save</Button>
          <Link to='..'>
            <Button type='button' variant='outline-secondary'>Cancel</Button>
          </Link>
        </Stack>
      </Stack>
    </Form>
  )
}

export default NoteForm