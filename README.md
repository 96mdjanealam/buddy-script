# BuddyScript

BuddyScript is a modern, full-stack social media application where users can share their thoughts, upload images, comment on posts, and interact with the community. It features a complete authentication system with a responsive and accessible user interface.

## 🚀 Tech Stack

### Frontend

- **Framework**: Next.js 16 (App Router)
- **Library**: React 19
- **Styling**: Tailwind CSS v4
- **Form Handling**: React Hook Form with Zod validation
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js 5
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens) via HttpOnly Cookies
- **File Uploads**: Cloudinary (handled via Multer)
- **Security**: Helmet, CORS config, bcrypt (password hashing)

---

## ✨ Key Features

1. **Secure Authentication**
   - User registration and login.
   - Secure session management using HTTP-only cookies and cross-origin resource sharing (CORS) handling.

2. **Feeds & Posts**
   - Create text-based posts or upload images.
   - Real-time display of recent posts from the community.
   - Like and unlike posts, with visualization of recent likers.

3. **Comments System**
   - Fully nested commenting system allowing top-level comments and threaded replies.
   - Like functionality for individual comments.

4. **User Profiles**
   - Public profiles for viewing a user's posts.
   - "Newbies" panel helping users discover new people.
   - Edit personal profile details, including updating the profile image.

---

## 🛠️ Project Structure

The repository is built as a monorepo containing both the frontend and backend architectures:

```text
buddy-script/
├── buddy-script-front/       # Next.js Frontend Application
│   ├── src/
│   │   ├── app/              # Next.js 16 App Router pages
│   │   ├── components/       # Reusable UI components
│   │   ├── context/          # React Context (e.g., AuthProvider)
│   │   ├── lib/              # Utility configurations (Axios, etc.)
│   │   ├── services/         # API abstraction layer
│   │   └── types/            # Global TypeScript types
│   ├── .env                  # Frontend Environment variables
│   └── package.json
│
└── buddy-script-server/      # Express.js Backend Application
    ├── src/
    │   ├── config/           # DB & Environment variables config
    │   ├── controllers/      # Route handlers/logic
    │   ├── middlewares/      # Auth, Error handling, Upload limits
    │   ├── models/           # Mongoose Database Schemas
    │   ├── routes/           # Express Route definitions
    │   └── services/         # Business logic
    ├── .env                  # Backend Environment variables
    └── package.json
```

---

## 💻 Getting Started (Local Development)

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v20+ recommended)
- [MongoDB](https://www.mongodb.com/) (Local installation or MongoDB Atlas URI)
- [Cloudinary Account](https://cloudinary.com/) (For image uploads)

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd buddy-script
```

### 2. Configure the Backend

Navigate to the server directory, install dependencies, and setup your `.env` file.

```bash
cd buddy-script-server
npm install
```

Create a `.env` file inside `buddy-script-server/` using the following variables:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb_URI
JWT_SECRET=your_super_secret_jwt_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Start the backend development server:

```bash
npm run dev
```

_(The server should run on http://localhost:5000)_

### 3. Configure the Frontend

Open a new terminal window, navigate to the frontend directory, install dependencies, and setup the `.env` file.

```bash
cd buddy-script-front
npm install
```

Create a `.env` file inside `buddy-script-front/` using the following variable:

```env
NEXT_PUBLIC_BASE_API_URL=http://localhost:5000
```

Start the frontend development server:

```bash
npm run dev
```

_(The app should run on http://localhost:3000)_

---

## 📡 API Endpoints Overview

| Route Path | Method | Description | Auth Required |
| --- | --- | --- | --- |
| `/api/auth/register` | `POST` | Create a new user account | No |
| `/api/auth/login` | `POST` | Authenticate and retrieve token set via cookie | No |
| `/api/auth/logout` | `POST` | Clears the auth cookie session | Yes |
| `/api/users/me` | `GET` / `PATCH` | Get or update current logged-in user details | Yes |
| `/api/users/latest` | `GET` | Get paginated list of users ("Newbies") | Yes |
| `/api/users/:userId`| `GET` | Get a user's public profile | Yes |
| `/api/feed/` | `GET` | Fetch all feed posts (paginated) | Yes |
| `/api/posts/` | `POST` | Create a new post | Yes |
| `/api/posts/:postId/like` | `POST` | Toggle a post like | Yes |
| `/api/posts/:postId/comments` | `GET` | Fetch comments for a single post | Yes |
| `/api/posts/:postId/comments` | `POST` | Post a new comment on a post | Yes |
| `/api/comments/:commentId/replies` | `GET` | Fetch replies for a specific comment | Yes |
| `/api/comments/:commentId/like` | `POST` | Toggle a comment like | Yes |

_(All API responses follow a standardized `ApiResponse` structure containing `success`, `statusCode`, `message`, and `data` fields.)_

---

## 🧪 Testing Guidelines

Currently, the safest way to ensure components and features function flawlessly is by relying on a robust end-to-end (E2E) testing cycle locally.

- Ensure that the Cloudinary credentials strictly reflect a sandbox/development environment so you don't pollute your production medial library.
- Make sure MongoDB compass or your local MongoDB service is actively running before testing endpoints. Or optionally use a MongoDB Atlas cluster URI testing environment to better mirror a production state.
