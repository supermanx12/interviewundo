# React Practical Questions

This document lists the practical questions from the `seed-react.ts` seed file, including their descriptions and difficulty levels.

## 1. Counter App (Easy)

**Slug**: `counter-app`

Build a Counter component with increment and decrement buttons.

The component should render:

1. A display showing the current count (with \`data-testid="count-display"\`, defaults to 0).
2. An increment button (with \`data-testid="increment-btn"\`).
3. A decrement button (with \`data-testid="decrement-btn"\`).

Clicking the increment button should increase the count by 1.
Clicking the decrement button should decrease the count by 1.

---

## 2. Toggle Button (Easy)

**Slug**: `toggle-button`

Build a button that toggles its label between "ON" and "OFF" when clicked.

The component should render:

1. A button (with \`data-testid="toggle-btn"\`, default label is "OFF").
   Clicking the button toggles the text state.

---

## 3. Show/Hide Password (Easy)

**Slug**: `show-hide-password`

Create a PasswordToggle component containing a password input field and a visibility toggle button.

The component should render:

1. An input field (with \`data-testid="password-input"\`, default attribute \`type="password"\`, default value \`my-secret-pwd\`).
2. A button (with \`data-testid="toggle-visibility"\`).

Clicking the button switches the input type between "password" and "text" to show or hide the password.

---

## 4. Todo App (Medium)

**Slug**: `todo-app`

Build a simple Todo App component. Users should be able to type a todo item into an input and click "Add" to add it to a list.

The component should render:

1. An input field (with \`data-testid="todo-input"\`).
2. An add button (with \`data-testid="add-btn"\`).
3. Todo list items (each item list element with \`data-testid="todo-item-N"\` where N is the 0-indexed position in the list).
4. Each item should have a delete button (with \`data-testid="delete-btn-N"\`).

Clicking "Delete" removes that specific item from the list.

---

## 5. Fetch API Data (Medium)

**Slug**: `fetch-api-data`

Build a FetchUsers component that fetches a list of users from \`https://jsonplaceholder.typicode.com/users\` on mount.

The component should render:

1. While fetching, display "Loading..." (with \`data-testid="loading"\`).
2. If successful, display the list of user names (list container with \`data-testid="user-list"\`, individual user list items with \`data-testid="user-item-N"\` where N is the 0-indexed position).
3. If the fetch fails, display the error message (with \`data-testid="error-message"\`).

---
