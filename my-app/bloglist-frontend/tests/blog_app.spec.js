import { test, expect } from '@playwright/test'
import { loginWith, createBlog } from './helper'

test.describe('Note app', () => {
  test.beforeEach(async ({ page, request }) => {
    await request.post('http:localhost:3003/api/testing/reset')

    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Test User',
        username: 'testuser1',
        password: 'testpassword1',
      },
    })

    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Test User2',
        username: 'testuser2',
        password: 'testpassword2',
      },
    })

    await page.goto('http://localhost:5173')
  })

  test('Login form works', async ({ page }) => {
    const locator = page.getByText('Blogs')
    await expect(locator).toBeVisible()
    await expect(page.getByText('Log in to application')).toBeVisible()
  })

  test('login form can be opened', async ({ page }) => {})

  test.describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'testuser1', 'testpassword1')
      await expect(page.getByText('Test User logged in')).toBeVisible()
    })

    test.describe('When logged in', () => {
      test.beforeEach(async ({ page }) => {
        await loginWith(page, 'testuser1', 'testpassword1')
      })

      test('a new blog can be created', async ({ page }) => {
        await createBlog(page, 'Aakkoset', 'Abc', 'test.com')
        await page.getByText('Aakkoset').locator('..')
      })

      test('a blog can be liked', async ({ page }) => {
        await createBlog(page, 'Aakkoset', 'Abc', 'test.com')
        await page.getByRole('button', { name: 'Show' }).first().click()
        await page.getByRole('button', { name: 'Like' }).first().click()
        const likesContainer = await page
          .locator('div', { hasText: 'Likes:' })
          .first()
        const initialLikesText = await likesContainer.textContent()
        const initialLikes = parseInt(
          initialLikesText.match(/Likes:\s*(\d+)/)[1]
        )
        await likesContainer.getByRole('button', { name: 'Like' }).click()
        const updatedLikesText = await likesContainer.textContent()
        const updatedLikes = parseInt(
          updatedLikesText.match(/Likes:\s*(\d+)/)[1]
        )
        await expect(updatedLikes).toBe(initialLikes + 1)
      })

      test('a blog can be deleted by user', async ({ page }) => {
        await createBlog(page, 'Aakkoset', 'Abc', 'test.com')
        await page.getByRole('button', { name: 'Show' }).first().click()
        page.on('dialog', async (dialog) => {
          console.log(dialog.message('Remove blog Aakkoset by Abc?'))
          await dialog.accept()
        })
        await page.getByRole('button', { name: 'Delete' }).first().click()
        const errorDiv = await page.locator('.notification.success')
        await expect(errorDiv).toContainText('"Aakkoset" deleted successfully')
      })

      test('del button only visilbe', async ({ page }) => {
        await createBlog(page, 'Aakkoset', 'Abc', 'test.com')
        const firstBlog = await page.getByText('Aakkoset')
        await firstBlog.getByRole('button', { name: 'Show' }).first().click()
        const delbutton = await page.getByRole('button', { name: 'Delete' })
        await expect(delbutton).toBeVisible()

        await page.getByRole('button', { name: 'Logout' }).first().click()
        await loginWith(page, 'testuser2', 'testpassword2')
        await expect(page.getByText('Test User2 logged in')).toBeVisible()
        await page.getByRole('button', { name: 'Show' }).first().click()
        await expect(delbutton).not.toBeVisible()
      })

      test('most likes order', async ({ page }) => {
        await createBlog(page, 'Aakkoset', 'Abc', 'test.com')
        await createBlog(page, 'Bbkkoset', 'bcd', 'test.com')
        await createBlog(page, 'Cckkoset', 'cde', 'test.com')

        const firstBlog = await page.getByText('Aakkoset')
        await firstBlog.getByRole('button', { name: 'Show' }).click()
        await page.getByRole('button', { name: 'Like' }).click()
        await page.getByRole('button', { name: 'Like' }).click()

        const secondBlog = await page.getByText('Bbkkoset')
        await secondBlog.getByRole('button', { name: 'Show' }).click()
        const secondLike = await page
          .getByRole('button', { name: 'Like' })
          .nth(1)
        await secondLike.click()

        const thirdBlog = await page.getByText('Cckkoset')
        await thirdBlog.getByRole('button', { name: 'Show' }).click()
        const thirdLike = await page
          .getByRole('button', { name: 'Like' })
          .last()
        await thirdLike.click()
        await thirdLike.click()
        await thirdLike.click()

        await page.reload({ waitUntil: 'networkidle' })
        const blogTitles = await page
          .locator('div > div > div > div > span')
          .allTextContents()
        expect(blogTitles).toEqual([
          'Cckkoset Show',
          'Aakkoset Show',
          'Bbkkoset Show',
        ])
      })
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByRole('button', { name: 'login' }).click()
      const errorDiv = await page.locator('.notification.error')
      await expect(errorDiv).toContainText('wrong credentials')
      await expect(errorDiv).toHaveCSS(
        'border-left',
        '5px solid rgb(220, 53, 69)'
      )
      await expect(errorDiv).toHaveCSS('color', 'rgb(114, 28, 36)')
      await expect(page.getByText('Test User logged in')).not.toBeVisible()
    })
  })
})
