## `Skate Notes App Server`

`Live App:` https://skate-notes.vercel.app/

### `Routes`

### `/api/auth/signup`

### `POST`
takes `username`, `email` and `password`.
verifies that `password` is between 8 and 72 characters and contains a capital letter and symbol.
verifies that username is not already taken.

### `/api/auth/login`

### `POST`
takes `username` and `password` and checks if they are correct. If so it uses jsonwebtoken
to login with 30 minute timeout.

### `GET`
verifies `session token` if still valid, it will return the username.

### `/api/auth/info`
verifies `username` and `token`. It then returns all the notes for each trick of that user.

### `/api/auth/save`

### `POST`
takes the `angle`, `x-index`, and `y-index` of the left and right foot along with the `trick name`, `note`, `username` and `note id`. It finds the note id in the database and updates all the fields.

### `/api/auth/new`

### `POST`
takes `trick name` and `username`. Creates a new trick for that user with the input `trick name`

### `/api/auth/delete`

### `POST`
takes `note id`, verifies `token`. Deletes the note with that `note id`.


## Scripts

Start the application `npm start`

Start nodemon for the application `npm run dev`

Run the tests `npm test`

## Deploying

When your new project is ready for deployment, add a new Heroku application with `heroku create`. This will make a new git remote called "heroku" and you can then `npm run deploy` which will push to this remote's master branch.
