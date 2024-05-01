import React from 'react'
import ReactDOM from 'react-dom/client'
import TodoTasks from 'toDo/TodoTasks'

import './index.css'
import { defaultData } from './mocks/defaultData'

const App = () => (
  <div className="container">
    <h2 style={{ marginBottom: '1rem' }}>To-Do Task List</h2>
    <TodoTasks defaultData={defaultData} />
  </div>
)
const rootElement = document.getElementById('app')
if (!rootElement) throw new Error('Failed to find the root element')

const root = ReactDOM.createRoot(rootElement as HTMLElement)

root.render(<App />)
