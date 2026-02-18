import {
  afterAll,
  afterEach,
  beforeEach,
  expect,
  test as testBase,
} from 'vitest';
import { render } from 'vitest-browser-react';
import { AppComponent } from '@/app';
import { userEvent } from 'vitest/browser';
import { http, HttpResponse } from 'msw';
import { setupWorker } from 'msw/browser';

export const handlers = [
  http.post('http://localhost:4000/api/auth/sign-in/email', () => {
    return HttpResponse.json({
      redirect: false,
      token: 'jiunHjWwoU1j77NgvZjraArRM34rsG4p',
      user: {
        name: 'Mock User',
        email: 'test@mail.com',
        emailVerified: false,
        createdAt: '2026-02-16T17:39:40.572Z',
        updatedAt: '2026-02-16T17:39:40.572Z',
        id: '6993565c7ded67d448eb900d',
      },
    });
  }),
];

const worker = setupWorker(...handlers);

const test = testBase.extend({
  worker,
});

beforeEach(() => localStorage.clear());
afterEach(() => worker.resetHandlers());
afterAll(() => worker.stop());

test('should log in successfully', async () => {
  const user = userEvent.setup();

  const screen = await render(<AppComponent />);

  expect(localStorage.getItem('token')).toBeNull();

  const emailElement = screen.getByLabelText('Email');
  const passwordElement = screen.getByLabelText('Password');

  await expect.element(emailElement).toBeVisible();
  await expect.element(passwordElement).toBeVisible();

  await user.click(emailElement);
  expect(emailElement).toHaveFocus();

  await user.type(emailElement, 'test@email.com');
  expect(emailElement).toHaveValue('test@email.com');

  await user.click(passwordElement);
  expect(passwordElement).toHaveFocus();

  await user.type(passwordElement, 'password');
  expect(passwordElement).toHaveValue('password');

  const submitButton = screen.getByRole('button', { name: 'Sign In' });
  await expect.element(submitButton).toBeVisible();

  await worker.start();
  await user.click(submitButton);

  expect(localStorage.getItem('token')).toBeDefined();
});

test('should display a message if login fails', async () => {
  worker.stop();
  const user = userEvent.setup();

  const screen = await render(<AppComponent />);

  expect(localStorage.getItem('token')).toBeNull();

  const emailElement = screen.getByLabelText('Email');
  const passwordElement = screen.getByLabelText('Password');

  await expect.element(emailElement).toBeVisible();
  await expect.element(passwordElement).toBeVisible();

  await user.click(emailElement);
  expect(emailElement).toHaveFocus();

  await user.type(emailElement, 'test@email.com');
  expect(emailElement).toHaveValue('test@email.com');

  await user.click(passwordElement);
  expect(passwordElement).toHaveFocus();

  await user.type(passwordElement, 'password');
  expect(passwordElement).toHaveValue('password');

  const submitButton = screen.getByRole('button', { name: 'Sign In' });
  await expect.element(submitButton).toBeVisible();

  await user.click(submitButton);

  const messageElement = screen.getByText('Invalid email or password');
  await expect.element(messageElement).toBeVisible();
});
