# API Authentication Documentation

## Overview
Your Laravel 12 backend now includes a complete secured API authentication system using **Laravel Sanctum**. This provides token-based API authentication with automatic token expiration.

## Security Features
 **Token-Based Authentication** - Bearer token authentication for API requests  
 **Password Hashing** - Passwords are hashed using bcrypt  
 **Rate Limiting** - Built-in protection against brute force attacks  
 **CSRF Protection** - Automatic CSRF token validation  
 **Token Expiration** - API tokens automatically expire after 30 days  
 **Secure Headers** - Automatic security headers included  

## API Endpoints

### Public Endpoints (No Authentication Required)

#### 1. User Login
**POST** `/api/auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password"
}
```

**Response (200 OK):**
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "user@example.com",
    "email_verified_at": null,
    "created_at": "2024-12-01T10:30:00.000000Z",
    "updated_at": "2024-12-01T10:30:00.000000Z"
  },
  "token": "1|abcdef1234567890..."
}
```

**Error Response (422 Unprocessable Entity):**
```json
{
  "message": "The provided credentials are incorrect.",
  "errors": {
    "email": ["The provided credentials are incorrect."]
  }
}
```

#### 2. User Registration
**POST** `/api/auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "password",
  "password_confirmation": "password"
}
```

**Response (201 Created):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "user@example.com",
    "email_verified_at": null,
    "created_at": "2024-12-01T10:30:00.000000Z",
    "updated_at": "2024-12-01T10:30:00.000000Z"
  },
  "token": "1|abcdef1234567890..."
}
```

**Error Response (422 Unprocessable Entity):**
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "email": ["The email has already been taken."],
    "password": ["The password must be at least 8 characters."]
  }
}
```

---

### Protected Endpoints (Authentication Required)

All protected endpoints require the following header:
```
Authorization: Bearer {token}
```

#### 3. User Logout
**POST** `/api/auth/logout`

**Headers:**
```
Authorization: Bearer your_token_here
```

**Response (200 OK):**
```json
{
  "message": "Logged out successfully"
}
```

#### 4. Get User Profile
**GET** `/api/auth/profile`

**Headers:**
```
Authorization: Bearer your_token_here
```

**Response (200 OK):**
```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "user@example.com",
    "email_verified_at": null,
    "created_at": "2024-12-01T10:30:00.000000Z",
    "updated_at": "2024-12-01T10:30:00.000000Z"
  }
}
```

---

## Using the API

### With cURL
```bash
# Login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password"
  }'

# Get profile (using token from login response)
curl -X GET http://localhost:8000/api/auth/profile \
  -H "Authorization: Bearer 1|abcdef1234567890..."
```

### With JavaScript (Fetch API)
```javascript
// Login
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password'
  })
});

const data = await response.json();
const token = data.token;

// Get profile
const profileResponse = await fetch('/api/auth/profile', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const profile = await profileResponse.json();
console.log(profile.user);
```

### With Axios
```javascript
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Login
const { data } = await api.post('/auth/login', {
  email: 'user@example.com',
  password: 'password'
});

// Store token in localStorage
localStorage.setItem('api_token', data.token);

// Add token to future requests
api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;

// Get profile
const profileData = await api.get('/auth/profile');
console.log(profileData.data.user);

// Logout
await api.post('/auth/logout');
localStorage.removeItem('api_token');
```

---

## Token Management

### Token Characteristics
- **Type:** Bearer token
- **Expiration:** 30 days from creation
- **Abilities:** All (`*`) - Full access to API
- **Storage:** Database in `personal_access_tokens` table

### Revoking Tokens
Tokens are automatically revoked when users logout. You can also manually delete tokens from the `personal_access_tokens` table.

### Token Refresh
Tokens expire after 30 days. Users need to login again to get a new token. You can implement token refresh endpoints if needed.

---

## Security Best Practices

1. **Never expose tokens in logs or error messages**
2. **Store tokens securely** (localStorage, sessionStorage, or secure cookies)
3. **Use HTTPS in production** to prevent token interception
4. **Implement token rotation** for sensitive operations
5. **Clear tokens on logout** (automatically done by our implementation)
6. **Validate token expiration** on the frontend
7. **Use strong passwords** (minimum 8 characters recommended)

---

## Adding Protected Routes

To add new protected API routes, add them in `/routes/api.php` inside the authenticated middleware group:

```php
Route::middleware('auth:sanctum')->group(function () {
    // Your protected routes
    Route::get('/posts', [PostController::class, 'index']);
    Route::post('/posts', [PostController::class, 'store']);
});
```

Access the authenticated user in controllers:
```php
public function index(Request $request)
{
    $user = $request->user(); // Authenticated user
    // Your logic here
}
```

---

## Testing the API

You can test the API using tools like:
- **Postman** - GUI-based API testing
- **Insomnia** - REST client
- **Thunder Client** - VS Code extension
- **cURL** - Command-line tool

---

## Environment Configuration

Key environment variables (in `.env`):

```
APP_URL=http://localhost:8000
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=pestilink
DB_USERNAME=root
DB_PASSWORD=
```

---

## Troubleshooting

### 401 Unauthorized
- Token is missing or invalid
- Token has expired
- Check `Authorization: Bearer {token}` header

### 422 Unprocessable Entity
- Validation errors in request body
- Check error messages in response

### 500 Internal Server Error
- Check Laravel logs in `storage/logs/`
- Verify database connection
- Ensure migrations are run

---

## Support

For more information about Laravel Sanctum, visit: https://laravel.com/docs/sanctum
