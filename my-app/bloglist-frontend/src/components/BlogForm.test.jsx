import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('<BlogForm /> updates parent state and calls onSubmit', async () => {
  const user = userEvent.setup()
  const createBlog = vi.fn()

  render(<BlogForm createBlog={createBlog} />)

  const titleInput = screen.getByPlaceholderText('Title here')
  const authorInput = screen.getByPlaceholderText('Author here')
  const urlInput = screen.getByPlaceholderText('URL here')
  const sendButton = screen.getByText('Create')

  await userEvent.type(titleInput, 'testing a form title')
  await userEvent.type(authorInput, 'testing a form author')
  await userEvent.type(urlInput, 'testing a form url')
  await userEvent.click(sendButton)

  await waitFor(() => {
    expect(createBlog).toHaveBeenCalledTimes(1)

    expect(createBlog).toHaveBeenCalledWith({
      title: 'testing a form title',
      author: 'testing a form author',
      url: 'testing a form url',
    })
  })

  console.log(createBlog.mock.calls)
})
