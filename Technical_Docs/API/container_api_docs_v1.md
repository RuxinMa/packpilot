# Container API Documentation

## Base URL

For development: `http://localhost:8000`

## Authentication

### Add Container

Adds a new container to the system. Only users with the `Manager` role can access this endpoint.

- **URL**: `/api/manager/add_container`
- **Method**: `POST`
- **Content-Type**: `application/json`
- **Authorization**: Bearer token required (JWT)

---

### Request Body

| Field  | Type   | Required | Description                    |
|--------|--------|----------|--------------------------------|
| length | number | Yes      | Length of the container (cm)  |
| width  | number | Yes      | Width of the container (cm)   |
| height | number | Yes      | Height of the container (cm)  |
| label  | string | No       | Optional container label      |

Example:
```json
{
  "length": 120.5,
  "width": 80.0,
  "height": 60.0,
  "label": "Main container"
}
```

---

### Success Response

- **Code**: `200 OK`
- **Content**:
```json
{
  "status": "success",
  "message": "Container added",
  "container_id": 1
}
```

---

### Error Responses

#### 401 Unauthorized
```json
{
  "status": "error",
  "message": "Invalid token"
}
```

#### 403 Forbidden
```json
{
  "status": "error",
  "message": "Forbidden"
}
```

#### 400 Bad Request
```json
{
  "status": "error",
  "message": "Invalid input format"
}
```

---

## Test Accounts

For development and testing purposes, you can use the following accounts:

| Username | Password    | Role    |
|----------|-------------|---------|
| manager1 | password123 | Manager |
| worker1  | password123 | Worker  |

---

## Mock Data for Frontend Testing

### Mock Add Container Request
```json
{
  "length": 120.5,
  "width": 80.0,
  "height": 60.0,
  "label": "Main container"
}
```

### Mock Success Response
```json
{
  "status": "success",
  "message": "Container added",
  "container_id": 1
}
```

### Mock Forbidden Response (Worker Token)
```json
{
  "status": "error",
  "message": "Forbidden"
}
```

### Mock Unauthorized Response (Missing/Invalid Token)
```json
{
  "status": "error",
  "message": "Invalid token"
}
```
### Quick Curl Testing Commands

```json
{
  "Start the port": "PYTHONPATH=. /Users/calvinchen/anaconda3/bin/python backend/wsgi.py",
  
  "Creat test users (On a different terminal)": "PYTHONPATH=. /Users/calvinchen/anaconda3/bin/python backend/create_test_users.py",

  "Getting Token with Login (Manager token)": "curl -X POST http://127.0.0.1:8000/api/auth/token   -H "Content-Type: application/json"   -d '{"username": "manager1", "password": "password123", "role": "Manager"}'",
  
  "Add Container (Replace the word TOKEN with actual token from last step)":"curl -X POST http://127.0.0.1:8000/api/manager/add_container \>   -H "Authorization: Bearer TOKEN" \>   -H "Content-Type: application/json" \>   -d '{>     "length": 120.0,>     "width": 80.0,>     "height": 60.0,>     "label": "Manager test container">   }'"

}
```

---

## Important Notes

1. This endpoint is restricted to `Manager` role only.
2. JWT tokens expire after 30 minutes.
3. Be sure to include the `Authorization` header: `Bearer <token>`.
4. Frontend should show error messages for 401 and 403 cases clearly.
