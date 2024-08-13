import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

const blog = {
  title: 'Component testing is done with react-testing-library',
  url: 'true.com',
  author: 'seppo',
  likes: 123,
  user: { name: 'seppo' },
}

test('renders only title', () => {
  render(<Blog blog={blog} />)

  const element = screen.getByText(
    'Component testing is done with react-testing-library'
  )
  expect(element).toBeDefined()

  const urlElement = screen.queryByText(`URL: ${blog.url}`)
  expect(urlElement).toBeNull()

  const authorElement = screen.queryByText(`Author: ${blog.author}`)
  expect(authorElement).toBeNull()

  const likesElement = screen.queryByText(`likes: ${blog.likes}`)
  expect(likesElement).toBeNull()
})

test('clicking the button fetch blog info', async () => {
  const mockHandler = vi.fn()

  render(<Blog blog={blog} toggleImportance={mockHandler} />)

  const user = userEvent.setup()
  const button = screen.getByText('Show')
  await user.click(button)

  const element = screen.getByText(
    'Component testing is done with react-testing-library'
  )
  expect(element).toBeDefined()

  const urlElement = screen.getByText(`URL: ${blog.url}`)
  expect(urlElement).toBeInTheDocument()

  const authorElement = screen.getByText(`Author: ${blog.author}`)
  expect(authorElement).toBeInTheDocument()

  const likesElement = screen.queryByText(`likes: ${blog.likes}`)
  expect(likesElement).toBeDefined()
})

test('clicking the button calls event handler twice', async () => {
  const mockHandler = vi.fn()
  const user = userEvent.setup()

  render(<Blog blog={blog} user={{ name: 'seppo' }} handleLike={mockHandler} />)

  const showButton = screen.getByText('Show')
  await user.click(showButton)

  const likeButton = screen.getByText('Like')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockHandler).toHaveBeenCalledTimes(2)

  console.log(mockHandler.mock.calls)
})
