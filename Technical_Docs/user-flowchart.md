## user flowchart

Mermaid code for the user flowchart is shown below.

```flowchart TD
    %% user type and entry
    MANAGER["👤 Manager"]
    WORKER["👷 Worker"]
    LOGIN["🔐 Login"]

    %% authentication process
    LOGIN --> VERIFY["Verify Credentials"]
    VERIFY --> JWT["Generate JWT"]
    JWT --> RBAC["Apply Role Permissions"]

    %% Manager workflow
    subgraph Manager_Workflow["Manager Workflow"]
        direction TB
        M_HOME[Access Manager Panel] --> M_ADD_ITEM[Add Items]
        M_ADD_ITEM --> M_CREATE_TASK[Create Task]
        M_CREATE_TASK --> M_CREATE_CONT[Create Container]
        M_CREATE_CONT --> M_ASSIGN[Assign to Worker]
        M_ASSIGN --> M_MONITOR[Monitor Task Progress]
    end

    %% Worker workflow
    subgraph Worker_Workflow["Worker Workflow"]
        direction TB
        W_DASH[Access My Tasks] --> W_START[Start Task]
        W_START --> W_REQ_LAYOUT[Request AI Layout]
        AI_OPTIMIZE --> W_LAYOUT[Get Layout Info]
        W_LAYOUT --> W_EXECUTE[Execute Packing]
        W_EXECUTE --> W_DONE[Mark Task Completed]
    end

    %% connect real users
    MANAGER --> LOGIN
    WORKER --> LOGIN

    %% RBAC to specific dashboard
    RBAC --> M_HOME
    RBAC --> W_DASH

    %% AI connection process
    W_REQ_LAYOUT --> AI_OPTIMIZE["🧠 AI Optimizer"]

    %% interaction
    M_ASSIGN --> W_DASH
    W_DONE --> M_MONITOR

    %% type definition
    classDef user fill:#D1C4E9,stroke:#512DA8,stroke-width:2px,color:#311B92,font-weight:bold;
    classDef auth fill:#E3D7FF,stroke:#673AB7,stroke-width:2px,color:#311B92,font-weight:bold;
    classDef manager_flow fill:#F8D7DA,stroke:#C62828,stroke-width:2px,color:#7B1A1A,font-weight:bold;
    classDef worker_flow fill:#BBDEFB,stroke:#1565C0,stroke-width:2px,color:#0D47A1,font-weight:bold;
    classDef ai fill:#C8E6C9,stroke:#2E7D32,stroke-width:2px,color:#1B5E20,font-weight:bold;

    %% class
    class MANAGER,WORKER user;
    class LOGIN,VERIFY,JWT,RBAC auth;
    class M_HOME,M_ADD_ITEM,M_CREATE_TASK,M_CREATE_CONT,M_ASSIGN,M_MONITOR manager_flow;
    class W_DASH,W_START,W_REQ_LAYOUT,W_LAYOUT,W_EXECUTE,W_DONE worker_flow;
    class AI_OPTIMIZE ai;
```
[user flowchart](https://mermaid.live/edit#pako:eNqlVt1uo0YUfpXRRHuHo4B_wKxUCQPO0o3t1GbX3bUjawJjexTM0GGsxBvlHVqp9-1FpT5CX6uP0GEYCGwTrar6Cjjn-86Z8_ONH2FEYwxtuE3ofbRHjIPQW6dA_N68AcccM8BPGQYojQFOOTuVtokzdS79-WoN__7tlz_ABKVoh9ka3pTm5Wz-vrL-BZaU3TWMV7PLYCptv_4MruiOpNJUB0VHvhehSIQ4oSnIGI1wnjewoNP5Dnz058H4k6D5iBnZnoDLcFygUJLXkUof6f79MhS-lzjFDHFcvNZe4lm6zEeOK3ycLEtOYE4TDK4xO5A8F1nk7RTVecG9OFlRuNKQH293DGX7yrxZKrNgrRDVpzp68YsJw5E8bDh6_jrZvJtN_JUTFcevQ16jFCc3MuHJxvG8TRD6k5UTxyDg-JDfNPGVWXm7c98J_U3oLN6vRLmKOoQov2tBGj5tlDubhhXKpSlHRJTyJWjhWKW3WASX05UjSrhLAadqEto5Sh8FmMymQTibryY0JZwymR64ZnTHRAkUDKdxoxMl42uNKK3NPij__9CG5cZzFu_qNpxkUnnZgeVmETrzcLXgcnHaxVRG5Tj3f9hcOZ9mH8LVHP90xDkHTgCu0IkeeQPkBJvZdRhMgs--AirQJebKGwTplrbilC7K3__Rdz-E_sp_wNFRNOsaRXck3bUAykchvNnUX00Quyvr7dJDlmCO4xcLHtE0FVUCYhISqQ95SxEkpdzSphI0v9ZMxb4VQ5FnOCJbEoEY5ftbilhcukh7ORfFInz1sWxLg05UU-X2L9VoVl-CG1WWQvTn7wV8lnFyIF-UVNXEJOVCNCStOmpzaKs81KiIUrZnuUEkhTTGWyKGuyaLEpTnHt6WWrslSWKfebrb84dazhm9w_ZZXzc8x1KvnXsS871tZA9aRBPK7LOuro-GhrYVS9m5x2S35_YtTeK3X_EXsqr4_a5njsc1_8DsOiPz__IflOgVa6XijC3P9Jw6jjswLOP1c5gj3dGdb8a5L3e6EWY08vzxqA6j9wd99-LVMBdez3T0b5eLKHbX8gfuczMM3_S6xqvs-qjvGxcvsT9vUBGiEa1aHU3tSjEIzWzKxdHKy0wTt5Uml6DoZ8utXBPtWfa1lpxrLYXWqiHW6kltdbDFXM64pgRNa66Ttnx-UKqiqTVoNKrF1pQ4RN5CDe4YiaHN2RFr8CDuXFS8wscCtIbiz8ABr6EtHmOhUWu4Tp8EJkPpZ0oPFYzR424P7a24_sXbMYvFPeURJK6BQ_2VCSXDzKXHlEPb7A4tyQLtR_gA7b5hnhvdvmXo_QvLvLCGGjxBu2P1zs2-ZfYGg95Q1y2996TBLzKufm4Yfd2yBrox7JpDwzSe_gHUk-Jg)
