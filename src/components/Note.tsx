import React from 'react'
import { Badge, Col, Row, Stack, Button } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { useNote } from './NoteLayout'
import { ReactMarkdown } from 'react-markdown/lib/react-markdown'

type NoteProps = {
  onDeleteNote: (id: string) => void
}

function Note({ onDeleteNote }: NoteProps) {
  const navigate = useNavigate()
  const note = useNote()

  return (
    <div>
      <Row className='align-item-center mb-4'>
        <Col>
          <h1>{note.title}</h1>
          {note.tags.length > 0 && (
            <Stack gap={1} direction='horizontal'
              className='text-wrap'>
              {note.tags.map(tag => (
                <Badge className='text-truncate' key={tag.id}>
                  {tag.label}
                </Badge>
              ))}
            </Stack>
          )}
        </Col>

        <Col xs="auto">
          <Stack direction='horizontal' gap={2}>
            <Link to={`/${note.id}/edit`}>
              <Button variant="primary">Edit</Button>
            </Link>
            <Button onClick={() => {
              onDeleteNote(note.id)
              navigate('/')
            }} variant='outline-danger' >Delete</Button>
            <Link to='/'>
              <Button variant='outline-secondary'>Back</Button>
            </Link>
          </Stack>
        </Col>
      </Row>
      <ReactMarkdown>{note.markdown}</ReactMarkdown>
    </div>
  )
}

export default Note