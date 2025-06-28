# Packing Optimization System API Documentation

## Base URL
http://localhost:5173 (Frontend)  
http://localhost:8000 (Backend API)

## Authentication
All protected endpoints require JWT token authentication via the `Authorization` header:  
Authorization: Bearer <jwt_token>

## User Roles
- **Manager**: Can manage items, containers, tasks, and perform optimizations  
- **Worker**: Can view assigned tasks and mark them as completed

---

## Authentication Endpoints

### POST /api/auth/token
User login endpoint that returns JWT access token.

**Request Body:**
```json
{
  "username": "string",
  "password": "string", 
  "role": "Manager" | "Worker"
}
```

**Response (Success):**
```json
{
  "status": "success",
  "message": "Login successful",
  "token": "jwt_token_string",
  "role": "Manager" | "Worker",
  "redirect_url": "/manager/dashboard" | "/worker/dashboard"
}
```

**Response (Error):**
```json
{
  "status": "error",
  "message": "Incorrect username, password, or role",
  "token": null,
  "role": null,
  "redirect_url": null
}
```

**Status Codes:** `200`, `400`, `401`

---

## Container Management (Manager Only)

### POST /api/manager/add_container
Create a new container.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "width": 100.0,
  "height": 80.0,
  "depth": 120.0,
  "label": "Container A"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Container added successfully",
  "container": {
    "container_id": 1,
    "width": 100.0,
    "height": 80.0,
    "depth": 120.0,
    "label": "Container A"
  }
}
```

**Status Codes:** `201`, `400`, `403`

### GET /api/manager/get_containers 
Get all containers.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "status": "success",
  "containers": [
    {
      "container_id": 1,
      "width": 100.0,
      "height": 80.0,
      "depth": 120.0,
      "label": "Container A"
    }
  ]
}
```

**Status Codes:** `200`, `400`

### GET /api/manager/get_container/{container_id}
Get specific container details.

**Headers:** `Authorization: Bearer <token>`

**Path Parameters:**
- `container_id` (integer): Container ID

**Response:**
```json
{
  "status": "success",
  "container": {
    "container_id": 1,
    "width": 100.0,
    "height": 80.0,
    "depth": 120.0,
    "label": "Container A"
  }
}
```

**Status Codes:** `200`, `400`, `404`

---

## Item Management (Manager Only)

### POST /api/manager/add_item
Create a new item.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "width": 20.0,
  "height": 15.0,
  "depth": 10.0,
  "orientation": "any",
  "remarks": "Fragile item",
  "is_fragile": true
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Item added successfully",
  "item_id": 1,
  "item_name": "Item0001"
}
```

**Status Codes:** `201`, `400`

### GET /api/manager/get_items
Get all items with optional filtering.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `assigned` (boolean, optional): Filter by assignment status

**Response:**
```json
{
  "status": "success",
  "items": [
    {
      "item_id": 1,
      "item_name": "Item0001",
      "width": 20.0,
      "height": 15.0,
      "depth": 10.0,
      "orientation": "any",
      "remarks": "Fragile item",
      "is_fragile": true,
      "is_assigned": false
    }
  ]
}
```

**Status Codes:** `200`, `400`

### GET /api/manager/get_item/{item_id}
Get specific item details.

**Headers:** `Authorization: Bearer <token>`

**Path Parameters:**
- `item_id` (integer): Item ID

**Response:**
```json
{
  "status": "success",
  "item": {
    "item_id": 1,
    "item_name": "Item0001",
    "width": 20.0,
    "height": 15.0,
    "depth": 10.0,
    "orientation": "any",
    "remarks": "Fragile item",
    "is_fragile": true,
    "is_assigned": false
  }
}
```

**Status Codes:** `200`, `400`, `404`

### PUT /api/manager/update_item/{item_id}
Update item details (only unassigned items).

**Headers:** `Authorization: Bearer <token>`

**Path Parameters:**
- `item_id` (integer): Item ID

**Request Body:**
```json
{
  "width": 25.0,
  "height": 20.0,
  "length": 15.0,
  "orientation": "fixed",
  "remarks": "Updated remarks",
  "is_fragile": false
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Item updated successfully"
}
```

**Status Codes:** `200`, `400`, `404`

### DELETE /api/manager/delete_item/{item_id}
Delete an item (only unassigned items).

**Headers:** `Authorization: Bearer <token>`

**Path Parameters:**
- `item_id` (integer): Item ID

**Response:**
```json
{
  "status": "success",
  "message": "Item Item0001 deleted successfully"
}
```

**Status Codes:** `200`, `400`, `404`

### POST /api/manager/batch_delete_items
Delete multiple items.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "item_ids": [1, 2, 3]
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Successfully deleted 3 items",
  "deleted_items": ["Item0001", "Item0002", "Item0003"]
}
```

**Status Codes:** `200`, `400`, `404`

---

## Task Management

### POST /api/manager/assign_task (Manager Only)
Assign a task to a worker.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "task_name": "Packing Task 1",
  "container_id": 1,
  "assigned_to": "worker1",
  "deadline": "2024-12-31T23:59:59",
  "item_ids": [1, 2, 3]
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Task assigned successfully",
  "task_id": 1,
  "assigned_to": "worker1",
  "items_assigned": 3
}
```

**Status Codes:** `200`, `400`, `403`, `404`

### GET /api/manager/get_tasks (Manager Only)
Get all tasks with optional filtering.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `status` (string, optional): Filter by status ("Assigned", "Completed")
- `assigned_to` (string, optional): Filter by assigned worker

**Response:**
```json
{
  "status": "success",
  "tasks": [
    {
      "task_id": 1,
      "task_name": "Packing Task 1",
      "container_id": 1,
      "assigned_to": "worker1",
      "manager_name": "manager1",
      "status": "Assigned",
      "deadline": "2024-12-31T23:59:59",
      "created_at": "2024-01-01T10:00:00",
      "workload": 3
    }
  ]
}
```

**Status Codes:** `200`, `400`, `403`

### GET /api/manager/get_task/{task_id} (Manager Only)
Get specific task details.

**Headers:** `Authorization: Bearer <token>`

**Path Parameters:**
- `task_id` (integer): Task ID

**Response:**
```json
{
  "status": "success",
  "task": {
    "task_id": 1,
    "task_name": "Packing Task 1",
    "container_id": 1,
    "assigned_to": "worker1",
    "manager_name": "manager1",
    "status": "Assigned", 
    "deadline": "2024-12-31T23:59:59",
    "created_at": "2024-01-01T10:00:00",
    "items": [
      {
        "item_id": 1,
        "item_name": "Item0001",
        "width": 20.0,
        "height": 15.0,
        "depth": 10.0,
        "x": 0.0,
        "y": 0.0,
        "z": 0.0,
        "placement_order": 1,
        "orientation": "any",
        "remarks": "Fragile item",
        "is_fragile": true,
        "is_assigned": true
      }
    ]
  }
}
```

**Status Codes:** `200`, `400`, `403`, `404`

### GET /api/worker/my_tasks (Worker Only)
Get tasks assigned to the authenticated worker.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "status": "success",
  "tasks": [
    {
      "task_id": 1,
      "task_name": "Packing Task 1",
      "manager_name": "manager1",
      "status": "Assigned",
      "deadline": "2024-12-31T23:59:59",
      "created_at": "2024-01-01T10:00:00",
      "workload": 3
    }
  ]
}
```

**Status Codes:** `200`, `400`, `403`

### GET /api/worker/task/{task_id} (Worker Only)
Get details of a task assigned to the worker.

**Headers:** `Authorization: Bearer <token>`

**Path Parameters:**
- `task_id` (integer): Task ID

**Response:**
```json
{
  "status": "success",
  "task": {
    "task_id": 1,
    "task_name": "Packing Task 1",
    "manager_name": "manager1",
    "status": "Assigned",
    "deadline": "2024-12-31T23:59:59",
    "created_at": "2024-01-01T10:00:00",
    "items": [...]
  }
}
```

**Status Codes:** `200`, `400`, `403`, `404`

### PUT /api/worker/complete_task/{task_id} (Worker Only)
Mark a task as completed.

**Headers:** `Authorization: Bearer <token>`

**Path Parameters:**
- `task_id` (integer): Task ID

**Response:**
```json
{
  "status": "success",
  "message": "Task completed successfully",
  "task_id": 1,
  "task_name": "Packing Task 1"
}
```

**Status Codes:** `200`, `400`, `403`, `404`

---

## AI Optimization Endpoints

### POST /api/ai/optimize
Optimize packing layout for given container and boxes.

**Request Body:**
```json
{
  "container": {
    "width": 100.0,
    "height": 80.0,
    "depth": 120.0
  },
  "boxes": [
    {
      "item_id": 1,
      "width": 20.0,
      "height": 15.0,
      "depth": 10.0,
      "is_fragile": true
    }
  ]
}
```

**Response:**
```json
{
  "status": "success",
  "cost": 0.85,
  "results": [
    {
      "item_id": 1,
      "placement_order": 1,
      "x": 0.0,
      "y": 0.0,
      "z": 0.0,
      "width": 20.0,
      "height": 15.0,
      "depth": 10.0,
      "is_fragile": true
    }
  ]
}
```

**Status Codes:** `200`, `400`

### POST /api/ai/optimize_task/{task_id}
Optimize packing layout for a specific task.

**Headers:** `Authorization: Bearer <token>`

**Path Parameters:**
- `task_id` (integer): Task ID

**Query Parameters:**
- `save` (boolean, optional): Save optimization results to database

**Response:**
```json
{
  "status": "success",
  "cost": 0.85,
  "results": [...],
  "task_info": {
    "task_id": 1,
    "task_name": "Packing Task 1",
    "container": {
      "container_id": 1,
      "width": 100.0,
      "height": 80.0,
      "depth": 120.0,
      "label": "Container A"
    }
  }
}
```

**Status Codes:** `200`, `400`, `403`, `404`

### GET /api/ai/get_task_layout/{task_id}
Get the current optimized layout of a task.

**Headers:** `Authorization: Bearer <token>`

**Path Parameters:**
- `task_id` (integer): Task ID

**Response:**
```json
{
  "status": "success",
  "cost": null,
  "results": [...],
  "task_info": {
    "task_id": 1,
    "task_name": "Packing Task 1",
    "container": {...}
  }
}
```

**Status Codes:** `200`, `400`, `403`, `404`

---

## Error Response Format

All endpoints follow a consistent error response format:

```json
{
  "status": "error",
  "message": "Error description"
}
```

### Common HTTP Status Codes
- `200`: Success  
- `201`: Created  
- `400`: Bad Request (validation error, invalid data)  
- `401`: Unauthorized (invalid credentials)  
- `403`: Forbidden (insufficient permissions)  
- `404`: Not Found (resource doesn't exist)

### Authentication Errors
- Missing or invalid JWT token returns `401`  
- Insufficient role permissions returns `403`

### Data Validation
- Invalid JSON format returns `400`  
- Missing required fields returns `400`  
- Invalid enum values (status, role) return `400`
