## UML sequence diagram

PlantUML code for the UML sequence diagram is shown below.

```@startuml
!theme plain

participant "User" as U
participant "Frontend\n(React)" as F
participant "AuthService" as AS
participant "TaskService" as TS
participant "ItemService" as IS
participant "Backend\n(Flask)" as B
participant "Database" as DB
participant "AI Service" as AI

== User Authentication Flow ==
U -> F: Login with credentials
F -> AS: authService.login(username, password, role)
AS -> B: POST /api/auth/token
B -> DB: Query user credentials
DB --> B: User data
B --> AS: JWT token + role + redirect_url
AS -> F: Store token in localStorage
F --> U: Redirect to dashboard

== [Manager] Item Management Flow ==
U -> F: Add new item
F -> IS: ItemService.addItem(itemData)
IS -> B: POST /api/manager/add_item
B -> DB: Insert item record
DB --> B: Item ID
B --> IS: Item created response
IS --> F: Success confirmation
F --> U: Item added to inventory

== [Manager] Task Assignment Flow ==
U -> F: Create new task
F -> TS: TaskService.assignTask(taskData)
TS -> B: POST /api/manager/assign_task
B -> DB: Create task record
B -> DB: Update items assignment
DB --> B: Confirmation
B --> TS: Task created response
TS --> F: Success message
F --> U: Task assigned notification

== [Worker] Task Retrieval Flow ==
U -> F: View my tasks
F -> TS: TaskService.getTasksByWorker(workerId)
TS -> B: GET /api/worker/my_tasks
B -> DB: Query assigned tasks
DB --> B: Task list
B --> TS: Task data
TS --> F: Formatted tasks
F --> U: Display task list

== [Worker] AI Optimization Flow ==
U -> F: Request task optimization
F -> TS: Request to get optimized layout
TS -> B: POST /api/ai/optimize_task/{task_id}
B -> AI: run_ai_optimizer(task_data)
AI -> DB: Get task items and container
DB --> AI: Items and container data
AI --> B: Optimized layout
B -> DB: Update item positions
DB --> B: Save confirmation
B --> TS: Optimization result
TS --> F: Layout updated
F --> U: Show optimized layout

== [Manager] Task Status Update Flow ==
U -> F: Update task status
F -> TS: TaskService.updateTaskStatus(taskId, status)
TS -> B: PUT /api/manager/update_task_status
B -> DB: Update task status
DB --> B: Update confirmation
B --> TS: Status updated
TS --> F: Success response
F --> U: Status change confirmed
@enduml
```
[UML sequence diagram](https://cdn-0.plantuml.com/plantuml/png/TPHHZ-Cq4CVVyoc6U-gAXRvNMdJfbPw2G0lRbdi0LCt5SwsrYHriPwk2-EvuF6cIDhsNLl7yP-RldyT-xmEwqDPLzaquKatGLAXDbZLnLPUwGHFWtSwJUmVeONUzldRM13BgJpDx8Ip3GnAjhqLv6uuRSc-wf1JEDzVnBVhNSNnx4oy2rUDuSHDVOlag7jPLB2KUbjUQ5GRyZ5uAh6w2UG5N_eeiUte2tZEmTp9HYa5R0-lAdk3fATl1Tp_0UW4_suCsSDBX2AKZnKgiVBRcSBvP00vR_xvYxQoDLGtMz0WDUd-oJZs2inKzPFc6ivOB-FLviuKvDdhEwVDWu-wo9GTNCVfRI-uCNEQgvIeAKhhuLXYGSpeVFttQGge3twPk_4TAEoh3ldMLzEODRO9rr4crWSgMMF4Q7eXt5KMx1RnqgL4N6_dZPujE9MP__88cIjrVm8S6ybMJ2HDokL9Ww0GwweHN4NroreKNAiMVCrRmyJranPHGBVtcKRnduS2fC953IFKXcesW1qRYhbYnUjIPWM8W5VM-iJ4_TUp0j6L9taDfpHVjwZGEFH79ZXv8CHDjtiX4QESR9Zpea7kl3-Okam-fVS8IebImRACvJkonf7nUcR58o6o_JaRqUzOESBfElDZ16MAxHd6CmNd0tks8teSn0ruTN4uHRYS8w_WpdYT9b4unqzYWltGNJW1-ikwrv_T2mMbwmsg2xtSTmTNdj2j_7zw10d_wvLbgpaxfhr0ZX1z_x0XAR5wV4pn_UmLxmnBjyOZDIljmmqOkvS1ZRPbXw2lqF5RQDnNAHgJG5OQyWEScw5h_S_zHUg6_M_91qkr8EJ3f9HOYaek85CIsjWttvWdr_29BFER_ykzUg_y4J5uimBLcZtf_qRbPagWqedbnmVUHnDjbn8pYMnLG6tA2KQeLqx0Wv59Yx_dM-BqfXiPwpViV7z86tmZA-uDyHTUHRoiXqhtvgHEqgO4QJcrpjASfoJilm2PWQ7tdS79wiYo0V5BU7sNfpojIBx4kr6END7uJTZTFGagLKzoBUk0sRJz0a-1NiOcF7ipqulTlmi1CKieZcaDVD-Q-9wFQkleV)
