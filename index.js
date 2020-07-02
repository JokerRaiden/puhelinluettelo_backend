const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(express.json())
morgan.token('body-token', (req, res) => {
  if (req.method === 'POST') {
    return JSON.stringify(req.body)
  }
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body-token'))
app.use(cors())

let persons = [
  {
    id: 1, 
    name: 'Arto Hellas',
    number: '040-123456' 
  },
  { 
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523'
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345'
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122'
  }
]

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/info', (req, res) => {
  let numberOfPersons = persons.length
  let date = new Date()

  res.send(`
    <p>
      Phonebook has info of ${numberOfPersons} people.
    </p>
    <p>
      ${date}
    </p>
    `)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(person => person.id === id)

  if (person) {
    res.json(person)
  }
  else {
    res.status(404).end()
  }
  
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id)

  res.status(204).end()
})

app.post('/api/persons', (req, res) => {
  const newPerson = req.body

  if (!newPerson.name || !newPerson.number) {
    return res.status(400).json({ 
      error: 'name or number is missing' 
    })
  }

  const existing = persons.find(person => person.name.toLowerCase() === newPerson.name.toLowerCase())

  if (existing) {
    return res.status(400).json({ 
      error: 'person is already in phonebook' 
    })
  }

  const newId = Math.floor(Math.random() * 1000) + 1

  const personToAdd = {
    id: newId,
    name: newPerson.name,
    number: newPerson.number
  }

  persons = persons.concat(personToAdd);

  res.json(personToAdd)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})