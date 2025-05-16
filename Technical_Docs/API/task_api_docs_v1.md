# Task API Documentation

## Base URL

For development: `http://localhost:8000`

## Authentication

### Assign Task

Assigns a task to a worker. Only users with the `Manager` role can access this endpoint.

- **URL**: `/api/manager/assign_task`
- **Method**: `POST`
- **Content-Type**: `application/json`
- **Authorization**: Bearer token required (JWT)

---

### Request Body

| Field        | Type     | Required | Description                                 |
|--------------|----------|----------|---------------------------------------------|
| task_name    | string   | Yes      | Name or description of the task             |
| container_id | integer  | Yes      | ID of the container this task is linked to  |
| assigned_to  | string   | Yes      | Username of the worker to assign the task to |
| deadline     | string   | No       | Optional ISO date string for the deadline   |

**Example**:
```json
{
  "task_name": "Pack container A",
  "container_id": 1,
  "assigned_to": "worker1",
  "deadline": "2025-05-20T17:00:00"
}
```

---

### ✅ Success Response

- **Status Code**: `200 OK`

```json
{
  "status": "success",
  "message": "Task assigned",
  "task_id": 1
}
```

---

### ❌ Error Responses

#### 400 Bad Request – Validation Failed

```json
{
  "status": "error",
  "message": "Validation failed"
}
```

#### 401 Unauthorized – Missing or Invalid Token

```json
{
  "status": "error",
  "message": "Invalid token"
}
```

#### 403 Forbidden – User Not Manager

```json
{
  "status": "error",
  "message": "Forbidden"
}
```

---

## 🧪 Test Accounts

| Username  | Password     | Role    |
|-----------|--------------|---------|
| manager1  | password123  | Manager |
| worker1   | password123  | Worker  |

---

## 🧰 Mock Data for Frontend Testing

### ✅ Mock Assign Task Request

```json
{
  "task_name": "Label container B",
  "container_id": 2,
  "assigned_to": "worker1",
  "deadline": "2025-06-01T12:00:00"
}
```

### ✅ Mock Success Response

```json
{
  "status": "success",
  "message": "Task assigned",
  "task_id": 3
}
```

### ❌ Mock Forbidden Response (Worker Token)

```json
{
  "status": "error",
  "message": "Forbidden"
}
```

### ❌ Mock Unauthorized Response (Missing Token)

```json
{
  "status": "error",
  "message": "Invalid token"
}
```

---

### Quick Curl Testing Commands

```json
{
  "Start the port": "PYTHONPATH=. /Users/calvinchen/anaconda3/bin/python backend/wsgi.py",
  
  "Creat test users (On a different terminal)": "PYTHONPATH=. /Users/calvinchen/anaconda3/bin/python backend/create_test_users.py",

  "Getting Token with Login (Manager token)": "curl -X POST http://127.0.0.1:8000/api/auth/token   -H "Content-Type: application/json"   -d '{"username": "manager1", "password": "password123", "role": "Manager"}'",
  
  "Add Item (Replace the word TOKEN with actual token from last step)":"curl -X POST http://127.0.0.1:8000/api/manager/assign_task   -H "Authorization: Bearer TOKEN"   -H "Content-Type: application/json"   -d '{"worker_id": 1,"item_ids": [1,2]}'"

}
```
## 🧠 Developer Notes

- Frontend should provide field-level validation before submitting.
- Orientation defaults to `"Face Up"` if not provided.
- All error messages follow a consistent structure with `status` and `message` fields.
