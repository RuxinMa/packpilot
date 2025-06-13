#### 1. Login API
- **Endpoint**: `/api/login`
- **Method**: `POST`
- **Request Body**:
```json
{
    "username": "string",
    "password": "string",
    "role": "manager|worker"
}
```
- **Response**:
```json
{
    "status": "success|error",
    "message": "string",
    "token": "string",
    "role": "manager|worker",
    "redirect_url": "string"
}
```

#### 2. Sign Up API (Non - functional, for UI)
- **Endpoint**: `/api/signup`
- **Method**: `POST`
- **Request Body**:
```json
{
    "username": "string",
    "password": "string",
    "confirm_password": "string"
}
```
- **Response**:
```json
{
    "status": "success|error",
    "message": "string"
}
```

#### 3. Add Item API (Manager)
- **Endpoint**: `/api/manager/add_item`
- **Method**: `POST`
- **Request Body**:
```json
{
    "length": "number",
    "width": "number",
    "height": "number",
    "orientation": "string",
    "remarks": "string"
}
```
**Response**:
```json
{
    "status": "success|error",
    "message": "string",
    "item_id": "number"
}
```

#### 4. Edit Item API (Manager)
- **Endpoint**: `/api/manager/edit_item/{item_id}`
- **Method**: `PUT`
- **Request Body**:
```json
{
    "length": "number",
    "width": "number",
    "height": "number",
    "orientation": "string",
    "remarks": "string"
}
```
- **Response**:
```json
{
    "status": "success|error",
    "message": "string"
}
```

#### 5. Delete Item API (Manager)
- **Endpoint**: `/api/manager/delete_item/{item_id}`
- **Method**: `DELETE`
- **Response**:
```json
{
    "status": "success|error",
    "message": "string"
}
```

#### 6. Assign Task API (Manager)
- **Endpoint**: `/api/manager/assign_task`
- **Method**: `POST`
- **Request Body**:
```json
{
    "item_ids": "array",
    "worker_id": "number",
    "container_length": "number",
    "container_width": "number",
    "container_height": "number"
}
```
- **Response**:
```json
{
    "status": "success|error",
    "message": "string",
    "task_id": "number"
}
```

#### 7. Get Task History API (Manager)
- **Endpoint**: `/api/manager/task_history`
- **Method**: `GET`
- **Response**:
```json
{
    "status": "success|error",
    "message": "string",
    "tasks": [
        {
            "task_name": "string",
            "worker": "string",
            "workload": "number",
            "status": "Completed|Assigned"
        }
    ]
}
```

#### 8. Get Worker Tasks API (Worker)
- **Endpoint**: `/api/worker/tasks`
- **Method**: `GET`
- **Response**:
```json
{
    "status": "success|error",
    "message": "string",
    "tasks": [
        {
            "task_id": "number",
            "item_id": "number",
            "item_name": "string",
            "size": "string",
            "direction": "string",
            "note": "string"
        }
    ]
}
```

#### 9. Next Item API (Worker)
- **Endpoint**: `/api/worker/next_item/{task_id}`
- **Method**: `GET`
- **Response**:
```json
{
    "status": "success|error",
    "message": "string",
    "item": {
        "item_id": "number",
        "item_name": "string",
        "size": "string",
        "direction": "string",
        "note": "string"
    }
}
```

#### 10. Previous Item API (Worker)
- **Endpoint**: `/api/worker/previous_item/{task_id}`
- **Method**: `GET`
- **Response**:
```json
{
    "status": "success|error",
    "message": "string",
    "item": {
        "item_id": "number",
        "item_name": "string",
        "size": "string",
        "direction": "string",
        "note": "string"
    }
}
```  