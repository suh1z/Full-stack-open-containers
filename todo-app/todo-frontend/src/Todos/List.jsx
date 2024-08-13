import React from 'react'
import Todo from './Todo'

const TodoList = ({ todos, deleteTodo, completeTodo }) => {
  return (
    <div>
      {todos.map((todo, index) => (
        <div key={todo.id}>
          <Todo todo={todo} deleteTodo={deleteTodo} completeTodo={completeTodo} />
          <hr />
        </div>
      ))}
    </div>
  )
}

export default TodoList
