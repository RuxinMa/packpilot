# Login API Documentation
## Base URL

For development: `http://localhost:8000`

## Authentication

### Login

Authenticates a user and returns a JWT token for accessing protected resources.

- **URL**: `/api/auth/token`
- **Method**: `POST`
- **Content-Type**: `application/json`

#### Request Body

| Field    | Type   | Required | Description                                     |
|----------|--------|----------|-------------------------------------------------|
| username | string | Yes      | 5-20 characters, alphanumeric and underscores (for now backend code can verify the length only)   |
| password | string | Yes      | User password                                   |
| role     | string | Yes      | Either "Manager" or "Worker"                    |

Example:
```json
{
  "username": "manager1",
  "password": "password123",
  "role": "Manager"
}
```

#### Success Response

- **Code**: `200 OK`
- **Content**:

```json
{
  "status": "success",
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJtYW5hZ2VyMSIsInJvbGUiOiJNYW5hZ2VyIiwiZXhwIjoxNjkwMjkyNDAwfQ.8KYYlw7FegBtaGFXPaDS9Agg4RpXv0iP4XHMzf_J6kw",
  "role": "Manager",
  "redirect_url": "/manager/dashboard"
}
```

#### Error Response

- **Code**: `401 Unauthorized`
- **Content**:
```json
{
  "status": "error",
  "message": "Incorrect username, password, or role",
  "token": null,
  "role": null,
  "redirect_url": null
}
```

## Test Accounts

For development and testing purposes, you can use the following accounts:

| Username | Password    | Role    |
|----------|-------------|---------|
| manager1 | password123 | Manager |
| worker1  | password123 | Worker  |

## Mock Data for Frontend Testing

### Mock Login Response (Manager)

```json
{
  "status": "success",
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJtYW5hZ2VyMSIsInJvbGUiOiJNYW5hZ2VyIiwiZXhwIjoxNjkwMjkyNDAwfQ.8KYYlw7FegBtaGFXPaDS9Agg4RpXv0iP4XHMzf_J6kw",
  "role": "Manager",
  "redirect_url": "/manager/dashboard"
}
```

### Mock Login Response (Worker)

```json
{
  "status": "success",
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ3b3JrZXIxIiwicm9sZSI6IldvcmtlciIsImV4cCI6MTY5MDI5MjQwMH0.6X5iQGKkQrGAIgDCpXJNFWLNnLNjhhgMYXwzcsGFMfw",
  "role": "Worker",
  "redirect_url": "/worker/dashboard"
}
```

### Mock Login Error Response

```json
{
  "status": "error",
  "message": "Incorrect username, password, or role",
  "token": null,
  "role": null,
  "redirect_url": null
}
```

## Important Notes

1. **Token Expiration**: The JWT token expires after 30 minutes.
2. **Username Format**: Frontend should validate username format (5-20 characters, alphanumeric and underscores only) before submitting.
3. **Role Validation**: The login requires the correct role to be provided.
4. **Redirect**: Frontend should handle redirection based on the `redirect_url` field in the response. 