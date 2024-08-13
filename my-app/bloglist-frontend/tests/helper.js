const loginWith = async (page, username, password) => {
  await page.getByRole('button', { name: 'login' }).click()
  await page.getByTestId('username').fill(username)
  await page.getByTestId('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

const createBlog = async (page, title, author, Url) => {
  await page.getByRole('button', { name: 'New Blog' }).click()
  await page.fill('input[placeholder="Title here"]', title)
  await page.fill('input[placeholder="Author here"]', author)
  await page.fill('input[placeholder="URL here"]', Url)
  await page.getByRole('button', { name: 'create' }).click()
  await page.getByText(title, author, Url).waitFor()
}

export { loginWith, createBlog }
