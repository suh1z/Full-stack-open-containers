import { render, screen } from '@testing-library/react'
import Todo from './Todo'
import React from 'react'

test('renders text and  done status', () => {
  const todo = {
    text: 'testing Todos',
    done: true
  }
  render(<Todo todo={todo} />)

  const element = screen.getByText('testing Todos')
  expect(element).toBeDefined()
  const elementStatus = screen.getByText('This todo is done')
  expect(elementStatus).toBeDefined()
})

test('renders text and false status', () => {
  const todo = {
    text: 'testing Tadas',
    done: false
  }
  render(<Todo todo={todo} />)

  const element = screen.getByText('testing Tadas')
  expect(element).toBeDefined()
  const elementStatus = screen.getByText('This todo is not done')
  expect(elementStatus).toBeDefined()
})
