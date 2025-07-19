### ✅ Final `README.md` for `express-app-learning`

# Express App Learning

A beginner-friendly RESTful API built with Node.js, Express, and MongoDB. This project demonstrates how to structure a basic backend application using controllers, routes, middleware, and environment configuration.

---

## 🚀 Features

- User authentication with JWT
- CRUD operations (e.g., Todo management)
- MongoDB with Mongoose
- Modular and clean folder structure
- Environment-based configuration

## 📁 Project Structure

```markdown
- express-app-learning/
- ├── controllers/ # Request logic handlers
- ├── models/ # Mongoose schemas and models
- ├── routes/ # Route definitions
- ├── middleware/ # Custom middleware (e.g., auth)
- ├── .env # Environment configuration
- ├── app.js # Main app file (Express setup)
- ├── package.json # Project metadata and dependencies
- └── README.md
```

## 📦 Installation

1. **Clone the repository**

```markdown
git clone https://github.com/firadfd/express-app-learning.git
cd express-app-learning
```

2. **Install dependencies and Build Project**

```markdown
npm install
npm i
npm run build
```

3. Create a .env file

```markdown
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_jwt_secret_key
```

## ▶️ Running the App

- For development with auto-reload:
  npm run dev

- For production:

```markdown
npm run dev
```

## 📡 API Endpoints

> All routes are prefixed with `/api`.

### 🔐 Auth Routes

#### `POST /api/auth/signup`

Register a new user.

**Body:**

```markdown
{
"name": "John",
"email": "john@example.com",
"password": "secret123"
}
```

#### `POST /api/auth/login`

Log in an existing user.

**Body:**

```markdown
{
"email": "john@example.com",
"password": "secret123"
}
```

### 📝 Todo Routes

#### `GET /api/todos`

Get all todos for the authenticated user.

#### `POST /api/todos`

Create a new todo.

**Body:**

```json
{
  "title": "Learn Express",
  "description": "Build a backend app"
}
```

---

#### `PUT /api/todos/:id`

Update an existing todo.

**Body:**

```json
{
  "title": "Updated Title",
  "description": "Updated description"
}
```

---

#### `DELETE /api/todos/:id`

Delete a todo by its ID.

---

## 🔐 Auth Middleware

To access protected routes like `/api/todos`, add the JWT token to your `Authorization` header:

```
Authorization: <your_token>
```

## ⚙️ Environment Variables

```markdown
| Key        | Description                |
| ---------- | -------------------------- |
| PORT       | 3000                       |
| MONGO_URI  | MongoDB connection string  |
| JWT_SECRET | Secret key for JWT signing |
```

## 👨‍💻 Author

**MD. Firaduzzaman**

**Flutter Developer** & **Backend Learner**

---

## 📄 License

MIT License

```
If you want, I can **add Postman examples**, or convert this to Bengali or Markdown with emojis. Just say the word!
```
