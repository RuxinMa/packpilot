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
### Quick Curl Testing Commands

```json
{
  "Start the port": "PYTHONPATH=. /Users/calvinchen/anaconda3/bin/python backend/wsgi.py",
  
  "Creat test users (On a different terminal)": "PYTHONPATH=. /Users/calvinchen/anaconda3/bin/python backend/create_test_users.py",

  "Getting Token with Login (Manager token)": "curl -X POST http://127.0.0.1:8000/api/auth/token   -H "Content-Type: application/json"   -d '{"username": "manager1", "password": "password123", "role": "Manager"}'",
  
  "Add Item (Replace the word TOKEN with actual token from last step)":"curl -X POST http://127.0.0.1:8000/api/manager/assign_task   -H "Authorization: Bearer TOKEN"   -H "Content-Type: application/json"   -d '{"worker_id": 1,"item_ids": [1,2]}'"

}
```
