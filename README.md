# Personal Notes Server

This is the backend server for the Personal Notes application—a privacy-focused, full-stack note-taking app. The server is built with Node.js, Express, TypeScript, and MongoDB (via Mongoose). It provides RESTful APIs for user authentication, note and label management, theming, and more.

---

## Features

- **User Authentication:** Register, login, and manage user sessions securely.
- **Notes Management:** Create, update, delete, and list personal notes.
- **Labels:** Organize notes with custom labels.
- **Themes:** Support for customizable themes.
- **RESTful API:** Clean, versioned endpoints for all resources.
- **Validation:** Request validation using Joi.
- **Error Handling:** Centralized error handler middleware.
- **CORS:** Configured for secure cross-origin requests.
- **Logging:** HTTP request logging with Morgan.
- **Environment Config:** Uses `.env` for sensitive configuration.

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn
- MongoDB instance (local or remote)

### Installation

1. **Clone the repository:**

   ```sh
   git clone https://github.com/your-username/personal-notes.git
   cd personal-notes/server
   ```

2. **Install dependencies:**

   ```sh
   npm install
   # or
   yarn install
   ```

3. **Configure environment variables:**

   - Copy `.env.example` to `.env` and fill in your MongoDB URI and other secrets.

4. **Run the development server:**

   ```sh
   npm run dev
   # or
   yarn dev
   ```

   The server will start on the port specified in your `.env` (default: `5000`).

5. **Build for production:**
   ```sh
   npm run build
   npm start
   ```

---

## API Endpoints

All endpoints are prefixed with `/api`.

### User

- `POST   /api/user/register` — Register a new user
- `POST   /api/user/login` — Login user
- `GET    /api/user/details` — Get user profile
- `POST   /api/user/logout` — Logout user

### Notes

- `POST   /api/note/add` — Add a new note
- `PATCH  /api/note/update` — Update a note
- `DELETE /api/note/delete/:id` — Delete a note
- `GET    /api/note/list` — List notes (paginated)
- `GET    /api/note/listAll` — List all notes (not implemented)

### Labels

- `POST   /api/label/add` — Add a new label
- `PATCH  /api/label/update/:id` — Update a label
- `DELETE /api/label/delete/:id` — Delete a label
- `GET    /api/label/list` — List labels

### Themes

- `POST   /api/theme/add` — Add a new theme
- `PATCH  /api/theme/update/:id` — Update a theme
- `DELETE /api/theme/delete/:id` — Delete a theme
- `GET    /api/theme/list` — List themes

---

## Project Structure

```
server/
├── .env
├── package.json
├── tsconfig.json
├── public/
│   └── index.html
└── src/
    ├── index.ts                # Entry point (Express app)
    ├── config/                 # Configuration (env, constants)
    ├── constants/              # App-wide constants
    ├── controllers/            # Route handlers (business logic)
    │   ├── admin/
    │   ├── labels/
    │   ├── notes/
    │   ├── themes/
    │   └── users/
    ├── db/                     # Database connection
    ├── middlewares/            # Express middlewares (auth, error handler)
    ├── models/                 # Mongoose models and DB logic
    ├── routes/                 # Express routers
    ├── services/               # Utility services (error, hashing, etc.)
    └── types/                  # TypeScript types/interfaces
```

---

## Development Notes

- **Controllers** handle request validation and responses.
- **Models** encapsulate all database logic.
- **Schemas** define the MongoDB collections via Mongoose.
- **Authentication** is handled via JWT and cookies.
- **Error Handling** is centralized in `middlewares/errorHandler.ts`.

---

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/feature-name`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/feature-name`)
5. Open a pull request

---

## License

MIT

---

> Backend for Personal Notes. See the [client-web](../client-web/README.md) for the frontend.
