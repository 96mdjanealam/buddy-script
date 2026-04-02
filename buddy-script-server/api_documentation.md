# BuddyScript API Documentation

All API endpoints are prefixed with `/api`.  
**Note:** For all protected routes, the JWT token must be provided in the `accessToken` HTTP-only cookie OR as a `Bearer` token in the `Authorization` header.

## 1. Authentication (`/auth`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | ❌ | Register a new user |
| POST | `/auth/login` | ❌ | Login with email and password |
| POST | `/auth/logout` | ✅ | Logout and clear cookie |

### Register / Login
**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "strongPassword123"
}
```

---

## 2. User Profile (`/users`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/users/me` | ✅ | Get own profile info |
| PATCH | `/users/me` | ✅ | Update profile (name/image) |
| PATCH | `/users/me/password` | ✅ | Change password |
| GET | `/users/:userId` | ✅ | Get public profile of another user |

### Update Profile
**Request Type:** `multipart/form-data`
- `name` (string, optional)
- `image` (file, optional) - Profile image

### Change Password
**Request Body:**
```json
{
  "currentPassword": "oldPassword123",
  "newPassword": "newPassword456",
  "confirmNewPassword": "newPassword456"
}
```

### Public Profile Query
**Request Query:**
- `page` (number, default: 1)
- `limit` (number, default: 20)

---

## 3. Post Management (`/posts`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/posts` | ✅ | Create a new post |
| PATCH | `/posts/:postId` | ✅ | Update a post (owner only) |
| DELETE | `/posts/:postId` | ✅ | Delete a post (owner only) |
| PATCH | `/posts/:postId/visibility` | ✅ | Toggle public/private |

### Create / Update Post
**Request Type:** `multipart/form-data`
- `text` (string, optional)
- `visibility` (string: "public" | "private", default: "public")
- `image` (file, optional) - Post image
- *Note: At least text or image must be provided.*

### Toggle Visibility
**Request Body:**
```json
{
  "visibility": "private"
}
```

---

## 4. Feed (`/feed`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/feed` | ✅ | Get global public feed + own posts |

### Query Parameters
- `page` (number, default: 1)
- `limit` (number, default: 20)

---

## 5. Interactions (`/posts/:postId/...`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/posts/:postId/like` | ✅ | Toggle like/unlike |
| POST | `/posts/:postId/comments` | ✅ | Add a comment or reply |
| GET | `/posts/:postId/comments` | ✅ | List top-level comments |
| GET | `/comments/:commentId/replies`| ✅ | List replies to a comment |
| DELETE | `/comments/:commentId` | ✅ | Delete own comment |

### Add Comment / Reply
**Request Body:**
```json
{
  "text": "This is a great post!",
  "parentCommentId": "optional_id_for_reply"
}
```

### Comment/Reply Query
**Request Query:**
- `page` (number, default: 1)
- `limit` (number, default: 20)

---

## Standard Response Format

All responses follow this JSON structure:

```json
{
  "success": true, 
  "statusCode": 200,
  "message": "Action completed successfully",
  "data": { ... } // Payload varies by endpoint
}
```

### Error Response
```json
{
  "success": false,
  "statusCode": 401,
  "message": "Unauthorized",
  "errors": ["Specific error messages here"]
}
```
