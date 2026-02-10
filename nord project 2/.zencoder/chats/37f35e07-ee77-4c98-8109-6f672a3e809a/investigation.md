# Investigation Report

## Bug Summary
The application crashes when trying to add a new todo because of a `ReferenceError: date is not defined`. Additionally, the delete functionality is broken due to multiple syntax and logic errors.

## Root Cause Analysis
1. **Add Bug**: In `server.js:28`, `date.now()` is used instead of the built-in `Date.now()`. JavaScript is case-sensitive.
2. **Delete Bug (Logic)**: `todos` is declared as a `const` array (line 10), but the delete route tries to reassign it in line 39.
3. **Delete Bug (Typo)**: `todos.fillter` is used instead of `todos.filter` in line 39.
4. **Delete Bug (Path)**: The route is defined as `/delet/:id`, which might not match the frontend expectation if it expects `/delete/:id`.

## Affected Components
- `server.js`: `app.post("/add")`, `app.get("/delet/:id")` handlers, and `todos` variable declaration.
- `views/index.ejs`: Delete link path, script tag spelling, and modal ID.
- `public/script.js`: `openModel` function name, `modal` ID reference, and `duretion` typo.

## Proposed Solution
1. **server.js**:
   - Change `const todos` to `let todos`.
   - Fix `date.now()` to `Date.now()`.
   - Fix `/delet/:id` to `/delete/:id`.
   - Fix `.fillter()` to `.filter()`.
2. **views/index.ejs**:
   - Fix `<scrip src="script.js">` to `<script src="script.js">`.
   - Fix `<div id="model">` to `<div id="modal">`.
3. **public/script.js**:
   - Fix `function openModel` to `function openModal`.
   - Fix `duretion:0.4` to `duration:0.4`.
# Investigation Report

## Bug Summary
The application crashes when trying to add a new todo because of a `ReferenceError: date is not defined`. Additionally, the delete functionality is broken due to multiple syntax and logic errors.

## Root Cause Analysis
1. **Add Bug**: In `server.js:28`, `date.now()` is used instead of the built-in `Date.now()`. JavaScript is case-sensitive.
2. **Delete Bug (Logic)**: `todos` is declared as a `const` array (line 10), but the delete route tries to reassign it in line 39.
3. **Delete Bug (Typo)**: `todos.fillter` is used instead of `todos.filter` in line 39.
4. **Delete Bug (Path)**: The route is defined as `/delet/:id`, which might not match the frontend expectation if it expects `/delete/:id`.

## Affected Components
- `server.js`: `app.post("/add")`, `app.get("/delet/:id")` handlers, and `todos` variable declaration.
- `views/index.ejs`: Delete link path, script tag spelling, and modal ID.
- `public/script.js`: `openModel` function name, `modal` ID reference, and `duretion` typo.

## Proposed Solution
1. **server.js**:
   - Change `const todos` to `let todos`.
   - Fix `date.now()` to `Date.now()`.
   - Fix `/delet/:id` to `/delete/:id`.
   - Fix `.fillter()` to `.filter()`.
2. **views/index.ejs**:
   - Fix `<scrip src="script.js">` to `<script src="script.js">`.
   - Fix `<div id="model">` to `<div id="modal">`.
3. **public/script.js**:
   - Fix `function openModel` to `function openModal`.
   - Fix `duretion:0.4` to `duration:0.4`.
