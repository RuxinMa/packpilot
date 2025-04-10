#### 1. Users Table
| Column Name | Data Type | Description |
| --- | --- | --- |
| user_id | INT | Primary key, auto - increment |
| username | VARCHAR(20) | Unique, 5 - 20 characters, alphanumeric and underscores |
| password | VARCHAR(255) | Hashed password |
| role | ENUM('Manager', 'Worker') | User role |

#### 2. Items Table
| Column Name | Data Type | Description |
| --- | --- | --- |
| item_id | INT | Primary key, auto - increment |
| item_name | VARCHAR(20) | Auto - generated, e.g., "Item0001" |
| length | DECIMAL(5, 2) | Item length in centimeters |
| width | DECIMAL(5, 2) | Item width in centimeters |
| height | DECIMAL(5, 2) | Item height in centimeters |
| orientation | VARCHAR(20) | Item orientation, default "Face Up" |
| is_fragile | BOOLEAN | Flag to indicate if the item is fragile |
| remarks | TEXT | Optional remarks |
| is_assigned | BOOLEAN | Flag to indicate if the item is assigned to a task |

#### 3. Tasks Table
| Column Name | Data Type | Description |
| --- | --- | --- |
| task_id | INT | Primary key, auto - increment |
| task_name | VARCHAR(20) | Auto - generated, non - editable |
| worker_id | INT | Foreign key referencing Users.user_id |
| status | ENUM('Assigned', 'Completed') | Task status |

#### 4. TaskItems Table
| Column Name | Data Type | Description |
| --- | --- | --- |
| id | INT | Primary key, auto - increment |
| task_id | INT | Foreign key referencing Tasks.task_id |
| item_id | INT | Foreign key referencing Items.item_id |
    
#### 5. Container Table
| Column Name | Data Type | Description |
| --- | --- | --- |
| container_id | INT | Primary key, auto - increment |
| container_name | VARCHAR(20) | Auto - generated, e.g., "Container0001" |
| container_length | DECIMAL(5, 2) | Container length in centimeters |
| container_width | DECIMAL(5, 2) | Container width in centimeters |
| container_height | DECIMAL(5, 2) | Container height in centimeters |