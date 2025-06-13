# Database Design Documentation

## Overview

This document describes the database schema for a warehouse management system that handles box packing optimization, user management, container management, and task assignments.

## Database Tables

### 1. Users Table (`users`)

Manages user authentication and role-based access control.

| Column   | Type           | Constraints                         | Description                                                              |
|----------|----------------|-------------------------------------|--------------------------------------------------------------------------|
| id       | Integer        | Primary Key, Auto-increment         | Unique user identifier                                                   |
| username | String(50)     | Unique, Not Null                    | User login name (5-20 characters, alphanumeric and underscores)          |
| password | String(128)    | Not Null                            | Hashed password                                                          |
| role     | Enum(UserRole) | Not Null                            | User role: Manager or Worker                                             |

**Enums:**  
UserRole: Manager, Worker

---

### 2. Containers Table (`containers`)

Stores container specifications for packing optimization.

| Column      | Type         | Constraints                 | Description                |
|-------------|--------------|-----------------------------|----------------------------|
| container_id| Integer      | Primary Key, Auto-increment | Unique container identifier|
| width       | Numeric(5,2) | Not Null                    | Container width in units   |
| height      | Numeric(5,2) | Not Null                    | Container height in units  |
| depth       | Numeric(5,2) | Not Null                    | Container depth in units   |
| label       | String(50)   | Nullable                    | Optional container label   |

---

### 3. Tasks Table (`tasks`)

Manages packing tasks and assignments.

| Column       | Type           | Constraints                             | Description                          |
|--------------|----------------|-----------------------------------------|--------------------------------------|
| task_id      | Integer        | Primary Key, Auto-increment             | Unique task identifier               |
| task_name    | String(100)    | Not Null                                | Task name                            |
| container_id | Integer        | Foreign Key → containers.container_id   | Associated container                 |
| assigned_to  | String(50)     | Not Null                                | Username of assigned worker          |
| manager_name | String(50)     | Not Null                                | Username of managing user            |
| status       | Enum(TaskStatus)| Default: Assigned                      | Current task status                  |
| deadline     | DateTime       | Nullable                                | Task completion deadline             |
| created_at   | DateTime       | Default: current timestamp              | Task creation time                   |

**Enums:**  
TaskStatus: Assigned (shown as "In Progress" in frontend UI), Completed

---

### 4. Items Table (`items`)

Stores item specifications and placement information.

| Column           | Type         | Constraints                                     | Description                  |
|------------------|--------------|-------------------------------------------------|------------------------------|
| item_id          | Integer      | Primary Key, Auto-increment                     | Unique item identifier       |
| item_name        | String(20)   | Unique, Not Null                                | Item name                    |
| width            | Numeric(5,2) | Not Null                                        | Item width in units          |
| height           | Numeric(5,2) | Not Null                                        | Item height in units         |
| depth            | Numeric(5,2) | Not Null                                        | Item depth in units          |
| x                | Numeric(8,2) | Nullable                                        | X-coordinate placement       |
| y                | Numeric(8,2) | Nullable                                        | Y-coordinate placement       |
| z                | Numeric(8,2) | Nullable                                        | Z-coordinate placement       |
| placement_order  | Integer      | Nullable                                        | Order of item placement      |
| orientation      | String(20)   | Default: "Face Up"                              | Item orientation             |
| remarks          | Text         | Nullable                                        | Additional notes             |
| is_fragile       | Boolean      | Default: False                                  | Fragile item flag            |
| is_assigned      | Boolean      | Default: False                                  | Assignment status            |
| task_id          | Integer      | Foreign Key → tasks.task_id, Nullable           | Associated task              |

---

## Relationships

### One-to-Many Relationships

- **Task → Items:** One task can contain multiple items  
  `tasks.task_id ← items.task_id`

- **Container → Tasks:** One container can be used in multiple tasks  
  `containers.container_id ← tasks.container_id`

---

## Business Rules

### User Management:
- Usernames must be 5-20 characters (alphanumeric and underscores only)
- Two role types: Manager (can create/manage tasks) and Worker (can execute tasks)

### Task Management:
- Tasks are assigned to workers by managers
- Tasks have two states: Assigned and Completed
- Each task is associated with one container

### Item Management:
- Items can be fragile (affects packing optimization)
- Items track 3D placement coordinates and orientation
- Items can be assigned to tasks for packing

### Container Management:
- Containers define the 3D space available for packing
- Used by AI optimization algorithms to determine optimal item placement

---

## Data Validation

- All dimensional fields (width, height, depth) use `Numeric(5,2)` precision
- Coordinate fields use `Numeric(8,2)` for higher precision placement
- Username validation ensures consistent naming conventions
- Foreign key constraints maintain referential integrity

---

## AI Integration

The system includes schemas for AI-powered packing optimization:

- **BoxInput**: Represents items for optimization  
- **ContainerInput**: Represents container specifications  
- **OptimizeRequest**: Combines boxes and container for optimization algorithms
