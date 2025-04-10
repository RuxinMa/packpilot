# System Architecture Diagram

PlantUML code for the diagram is shown below.

```PlantUML
@startuml
skinparam {
  BackgroundColor transparent
  ArrowColor #333
  BorderColor #666
  ComponentStyle rectangle
  ComponentBorderColor #666
  DatabaseBackgroundColor #fafafa
  DatabaseBorderColor #666
  ActorBorderColor #666
  PackageBackgroundColor transparent
  PackageBorderColor #666
}
skinparam linetype ortho
' Define color schemes
!define UserFlow #CCEEFF
!define ItemFlow #FFDDCC
!define TaskFlow #DDFFCC
!define VisualizationFlow #EEDDFF
' Define text colors
!define UserTextColor #0066CC
!define ItemTextColor #CC5500
!define TaskTextColor #33AA33
!define VisualizationTextColor #7733CC
' Define actors
actor "Manager" as manager #F0F0F0
actor "Worker" as worker #F0F0F0
' Main components
package "Frontend" {
  component "Login Component" as loginComponent
  component "Manager Console" as managerConsole {
    component "Item Management" as itemManagement
    component "Task Assignment" as taskAssignment
    component "Task History" as taskHistory
  }
  component "Worker Console" as workerConsole {
    component "Task Progress Tracker" as progressTracker
    component "Item Navigation" as itemNavigation
  }
  component "Visualization Module" as visualizationModule {
    component "2D View" as view2D
    component "3D View" as view3D
  }
}
package "Backend" {
  component "Authentication Service" as authService
  component "Item Service" as itemService
  component "Task Service" as taskService
  database "Database" as db {
    component "User Repository" as userRepo
    component "Item Repository" as itemRepo
    component "Task Repository" as taskRepo
    component "Container Repository" as containerRepo
  }
}

' External API - Placement Algorithm
cloud "External Services" {
  [Placement Algorithm API] as placementAlgorithmAPI #LightGray
}

' Relationships with colored arrows and colored labels by flow type
' User flow - Blue
manager -[#3366FF]-> loginComponent : <color:#0066CC>authenticate</color>
worker -[#3366FF]-> loginComponent : <color:#0066CC>authenticate</color>
loginComponent -[#3366FF]-> authService : <color:#0066CC>validate credentials</color>
authService -[#3366FF]-> userRepo : <color:#0066CC>retrieve user data</color>
' Item flow - Orange
manager -[#FF6600]-> itemManagement : <color:#CC5500>add items</color>
itemManagement -[#FF6600]-> taskAssignment : <color:#CC5500>add tasks</color>
managerConsole -[#FF6600]-> itemService : <color:#CC5500>manage items</color>
itemService -[#FF6600]-> itemRepo : <color:#CC5500>CRUD operations</color>
itemNavigation -[#FF6600]-> visualizationModule : <color:#CC5500>update view</color>
' Task flow - Green
worker -[#33CC33]-> workerConsole : <color:#33AA33>view assigned tasks</color>
manager -[#33CC33]-> taskAssignment : <color:#33AA33>assign tasks</color>
managerConsole -[#33CC33]-> taskService : <color:#33AA33>assign tasks</color>
workerConsole -[#33CC33]-> taskService : <color:#33AA33>retrieve tasks</color>
taskService -[#33CC33]-> progressTracker : <color:#33AA33>update progress</color>
taskService -[#33CC33]-> containerRepo : <color:#33AA33>store container dimensions</color>
taskService -[#33CC33]-> taskRepo : <color:#33AA33>CRUD operations</color>
taskService -[#33CC33]-> itemRepo : <color:#33AA33>retrieve items</color>
' Visualization flow - Purple
view2D <-[#9966CC]-> view3D : <color:#7733CC>toggle between views</color>
visualizationModule -[#9966CC]-> itemRepo : <color:#7733CC>retrieve item data</color>
placementAlgorithmAPI -[#9966CC]-> visualizationModule : <color:#7733CC>return optimal placement</color>
placementAlgorithmAPI -[#9966CC]-> itemRepo : <color:#7733CC>retrieve item dimensions</color>
placementAlgorithmAPI -[#9966CC]-> containerRepo : <color:#7733CC>retrieve container dimensions</color>

legend right
  <b>Flow Types</b>
  |= Color |= Flow |
  |<#CCEEFF>| <color:#0066CC>User Flow</color> |
  |<#FFDDCC>| <color:#CC5500>Item Flow</color> |
  |<#DDFFCC>| <color:#33AA33>Task Flow</color> |
  |<#EEDDFF>| <color:#7733CC>Visualization Flow</color> |
endlegend
@enduml
```
[UML diagram](https://uml.planttext.com/plantuml/png/fLTDRziu4BthLt2TGqv1ZGfrqS8LwafMjq3JDT9qzr3qG4kCB4GM1PAowztal-_mGn8fqMaM2mEsFFFcSJWpd17VSu6PQFTLmE_Bki4Cxz4_0K8VS7PVCDhMUKmhof1WkEQW9hK0xOenUjIAYp0C9Pwod30ZMYmM88hflg4r67mLfueWHZA1ww8YjifZbc21jvYJiGSNTrX-RCJKU9K9oZpo3P3XOiBfxge3ZSqVhTXKPKt4gI68Ch6ZmILAo1s8KARWFDkHFU71RxcMVkE4fHKzeeiuNg_Jj5Ty4cIl5McQ977SAsunlzUA94bJI_5doLjSbNzZKT9Q8zPhYHby4EIdq8wu7jo2t6ndFbyiB5BfXgMDurUlvdF75qiRXgiLvDhha0Lx_JeCOOdUAonJmWFrWsRNk8OGind27EtrCyHWBZyTv2_AxWtYg1vxm2MwncKDMpJLmuD6fmpDKaPhGUfyfggtHw3PPrg0ILzmYhQIibxaues3O55pMX7RKIDIApWsCen86-wxDKgG3QAnXGmjMd5U5dLl8K0sYBmMlvSSGdJguUO_O1_TNUWOEflGiJox1yM_ORHWX7Dqoo2m9WcD4HgPT_DVyA4iL2Nqcnz4K_USsa7ND6-DamTReULJLrycK7paQ0p8yMKoHeGZH9We7nw7Uf6Tm5SkgrRiuA7Cj6jV2JkKcVODWyhy3wOHi95o-rwa2hADb4aSaBbfR6ZMjJW5ohVJ6CXpZMv8GtdPLqGBCYdoPcY4bIxwiCh34LOwwSD2BGauZrD7iavXh6JauV2kVmh2QboXrUOJkaAR2cVgSA1LLL1MYjq-o2hQvcZM8qrikCxJTu-99FkXohJJzIgvpCNdijY9ZmoVj0ytf5APvRkoWJC1CDqnIOwm76gGvZhlHHNUaegZxGdToOuh6pzmgDWhmHNwKBKaw1hPrNTeaej5clwuYaPD1hr5IyNwrlJW20-LHfOlb2uAJCFx_qGZ8uVGAkGfsm6E7zGXJ3G8WAJ55UzPRKk7iYkzAHyZWfNaG1H4LNZFTgdcJnV9Fs0M5quiqtIncCyblTjChKNqn8fmdYlCuEd8mc5p6wsVJM86jj40cFWsZQQXqeOUtwmekbIZA1gU-EPRWcX3c2vUXsfej2wRhvTEYDj69LisIIilgWkOl7naXDHEOSPn6Ce5t8aoKEiNXKXomi6KSIPd0khodSsB8THSlqoDIpXDpLDixfQUJzPNkKjdspXaevaw9JHvwN2_PdHwxfHFlYUG0OJo4cBCdLewIztr_odhkR8yI-Mfy744tRDowRvdTaMvQLa3Dmaz_T4IrdZpHhORNVTou5ihw3VIID02RXzeIyGHAbh1XdLyXyLXzNXkU1tFtGxddqaZRvywfSCIBQiXqgBSmrJiQV_BGi_UmBGodi5-hlp6IpnPWK552dWfGqpER9ZtossaRZgtC7S1jOr0zl0EwOi6F2ZbWnGkpGKhUXZF7pMi9R1RfJFG5o_Bm7H4DPDy1lf2PXcOobNDqcUWxsUMWGc6Mz4ZIzY_ZaBm7hxWOlul)

[UserFlow ONLY](https://uml.planttext.com/plantuml/png/fLPDRzim3BtxLt3feQTYGOscm90PJUDuAz0EnTPjXw87nLOTeOeLI4goREr_7_LXH_xOQGYGs8_lKHH9KRbIcaYzNVD8lR1gGoHPmvy8u9haBwKKswgO2ouaQ4agXMPQQRJEf1HxPpY9uzZmXIoezD1aCa5eBjORKQ7Wcpvm2fBccbGbfw5fG9OIJPP4qMu49y_4V496NppBjP03-3qw8sNFPtjNDQahVmjomrb5zM53GKYz4j4ffFGP8SWjNUKhkgOgUbSuzBkYCkDY3oVp-MAHPOtXHjErCsHPcixdZU61g1TdIDCi2mm_cDeIpduJpKJb68k5uHnZqFINTe6q8tX0t6zdF9vC0gScZC0wdrzSZCUjM09h7CzcMEl1W0BQvMKSun9DLCIKH4Ns1qPtfC8Kon4G1MltZ3aOcqzD-IdaYsVixMD3E8KxmYhSekyU5MrSoM2KIL5fMXKZsxqD0qQteaH9qt3MBJTO0xNvFa1KL4fm6WRg8Rj2IsFI24wuhjTWY1sXhiAa5cPAiR9g51gn8pIe-CmKfkZGqFqxSj_Qkt0vR6t2vVAVUx3-xwKe9LKA7YGcrXTXuq6F3Mx-2zcnqdP2i_aZr0-lrJjm9ugj3t8N6XpU3_KynUQZUo-W-_EqouWxZ3YrCRmT-yLCWg5scMtr2XzOxaBxHkMEvIusWYR_7lKp43BDzWUPDiaXqnJno2pyO8DHFU8igLZsSs3EDNob6w5Oqn5Rn0mqMA4EruGunBKHThWco24kzfB6yzWF9AyDNcKoZuTtyKjJMH4Ei_iRE8DxJd9xE636Io6PNgsZd8jj0QE6wNEZN9qU1oJ6sPDjqzhMcCmo9xUiNEbFaXnS35yfjvLLAxR1Cu4qDp5f0SHSQbZcgcWWJfQKArWUuDbCN3FuqOVDlGNEu9flQLGFihD779AJIPOzdIMT8GCVO6gzVl0pE277JgFJzzQMH7xW_R-ZZgZbC6ZalhST7Z_iGxpHC076BU6gyHegMoxhrklxarHBHdVKKco7DzuYJaiyWo1DYR2yqsLYBxO7J3EkkKmGU_q8xbx11sjyDU3KtwV9QtSvMnj3h5Uf1UwU3GJkialiuHWIkFit4BZxBx4dP4ZWhkD0u6x2f3tiEahSlyj2T8LV-3_iBm00)

[ItemFlow ONLY](https://uml.planttext.com/plantuml/png/TLPTJzim57tFhxXh7tX2guWe4keYkgJTa613KBO7n8ERc3Ig6rUsI-a6_ttN7t7pDLM2zDnpRexljQzx9HKHQhTXWLmNvPO8ie6_0S1NagvpmNTb5dF61IX1IebXMYgCJeNWUniOXc6e-LnaL3XeF1uZ5FFDbfSeU507Ha7GL94oPxGUwf4bH94baRJjOFX2zAVEw8gdgUAY1x_3P2Jlv6okgYArvH-rsh2YfEgmfS25Ml7W11BwWX2aXYxJ5TrG6NpABFeegPWpleTX7CzcyxaFN2kwiO7vF4dYs0SMHAvj84dcyrhWLo5tX1L_Y2fuQHcpcUOSFIZwfgoHfeC5ucuvez5uN4kgRTIYSNn-FXerlDIYOJYTOgzx3TLe5nTXYA_mheXkYGpCFnZSaX9BB0P096piCzPWf3yLvJSNQyVOcqTFE85RKfIuHBTxPB2rBOF1NF1IqJ8RcDth6J2uuJbA_8OpQPd6FDJaEuEeA2Ldj6xKGUOD3Oqk8rZXfdf7WTWHQYjqQM4gPP6NNg4GEqAzYk-5n18TFDrzH-v7SnMsXer5s5h-Tmqc_vtWkQ1Ima9WOLqJjWvqME_YVv3N8ZSxmI_-27NjDVOEtF9ivqo-rWCMxrezIt3pqRqJqFrPqcQ4BKQO60yVn_sY9q7VTfdkr0eVYjHQUw3YjKYjDu8XzpteLg3ErCllPPeYrvcwYKTcvWOR3AeHPqZPibi3VQxXdcwvBFoEs26ceTuEjRZQOX_NE6nnjSa-BkubXUUnQoIj0awbAu-7T_Qcg2W9W-dTDPp27IEfEHmmPJaNXLfjWfJnNGO3ptIraRPFJpqIdUpPRDCgvaFwDSER8b-fRu8Sh8TxoandvQhOufb0cfsOD0EYBpLiSvbvY94bPHAM1tZH4rSFVinXwcc0K_Y9DqXEWsgKdJxXG1-FHwFdqwWr0k0I9YRlfPkp4Saomv6JpoOG1Ir58rjpFFHcGyUA0p5KdxCrl3eENOcx2Qsmns6bwAJIxUxcYUyV4-1RAcpXVQg0qHoF80ZT8UpkP1cPUss1LKRMCaBi_GlOQmKVJF1TWnDtdKRl_btsOelCiT34wYsLm5wpDO4pPthP9x3NRqrWhx_8790-WRsDQm9x4KRDMTTIulfj5O8h_8C_m_u1)

[TaskFlow ONLY](https://uml.planttext.com/plantuml/png/ZLPDRziu4BthLypQXvw26XNg0aKgr2lPtGBD8aZJtKFH0orDP28oAP1qNBV9V-_mGxA-TbCOiEKtRnw7mvaHtsl3b3digqZVSr4pnVRmCmBua-NtfP87KQIoaWgCOaAJ6OKXwqefUVI6UHp7bYzLWIf0o-MIe5JkQod8uRCvLGWASyD4MM7NDE6MCSEsJECmWlaTivykO-oyoerK4_WrYR5ofDdVLKCQkZzrSbDnWUPK8qXbTZ9w0HdU4GIve-jyXtlKqH-5HxzeL9jA7c6UfklrPjCQFXhSUyDcasLfsXfkcRxtXYpRR3g6VxW-i8h_O8PBuHdhjUMSOp3utVX0-X7S4XwsirWibnrH6qR7cgQlNoyMlLWwrZXUhUYi9mFgqDwyYMDQeesAsIFHaVk1sHKJb68r0wPXxvyf1mlxQIZ_IdKV64Vts19Um1NZWhOOgaT7jJyoc6sK50P5CNFLsp9WzacMvD8Md9EjBDP2VNu8a3o4bXLs0msGMw7dOzC8td7VhC49EqD33vjQM6dDIz5w6CBEqAJ7NrnJYaujFVmdxbD_5pw7lKtuNFxd7fp-jPAbGgtXLb5Ymo7K0GpOvER_PW-yT9NGRluCZSFhrGvSoU8GWdpe6Zm-3lLLHiM7n-20nrVPa14F677cOdWwrukT15FbiZgO7Jtmt8Vs6TK3ptriZ4pXVpJEG9Tfjp_9T4dkCkqXdfb566mmQqQS8nNRSGviNyCDrbBpjY8EX5beyeG6N1lY5DT5EE3Q8AUuL4k6-d4SIDuOWfVDF3Nl-hj19LW5g-kFS07N5SjTSy2gAgNYPhUFyaeU2fYrp90RxS_fwuIB5VlcohInjIQxpFmJBtVcWs8d7yCDLkvazOxNr1D4ynCJ2s3sfKR7B8eMgjWMAmtR4zpPYMi7Fscu73dW0ZueH165ENNnTMvdNnn_kqW6_VOMBftesp164rkM5BPjTrh8fbXVldIK96e6Oq-lFnx6WbvhMgc9OYGOylkRQlqj_RwOGgCuFk10hklJ4njCdB7WeQPMmPRtl6Al8iTwTehYcGG5fnnhMoRFIpVTCLPDRxva86jKlkAUbsgQydyoQ2bdfQZ2agOOA5lar22NsyHT3MwfK8crJGXxV0V-pKmFplXemSjm8qaUswNytI1nayKIcrKQ1tzJwJZuwqBYnikKWx_1T1p2Pbp_J3du2qt7mTybalxhOk19-_TPYDxJ5zraVm40)

[VisualizationFlow ONLY](https://uml.planttext.com/plantuml/png/bLRRRjiu47tNLqpjXpu5QrIeYmQkKDUosm9D4RJPxaEG1rfYP28IAP1KN7UJVz_XHRHkkzZ2W2sVEJCySo6fzqeJgPkgZDG3upMHf8A_8u0F97ief6XulX6baA0buGhDb6kqhgKKHsUOnt5i-4BcL7fekLmYj15LBJWwVDUdaeAacIQyA6dNDE6M4atsHD6XWlazCPykO-oyphIG4_Wr1YF5A6O_gvOqT7_krAPadEfJJK58VH3HIqZfFKAGMRhA3hIYAdgHE_HFHUMk54UORpRRxMuN39yrhPnXjqlJpIOOReXwS8OqtUqwXXzCDQHaluXcWZl6TciuPmsQ_jHEI5_13U8-dSLYkUm4DJ8writczUl5egUbOutZzHfxFIceGtlp9evnYQ2Ac9QeoFx0x8fmBB6S0L5GkMUimS9yMifVGZvunj4-1i9Bk2ACOuf-UbHKkvR1R2S5rvJdCpkzWG6pBw90bp1mDcnfi03r-LuWUd0bIjeLwY6xGi_7b16SOzMkmH0xGqCFKrfOAyKA7ZmqOcTeqkCJKrYYKw3x_yXzxcVXQjXBmjNoNtEmyQ-bA2HL2cua5jOteVQWnoQJ_qeUMM4d8IH_XiRoUhC3Lo9llCZ7hi7XOwclKXm-UlGEzFWg7JBY0IDEhORdyxoOas1gNDQDFk03ovoqxrG-iinf8sZo_wDn1RfCa_uaqnQvopHDF3DpVx31h3tYB2dVZsjWzZLyexLGB4n4WvY19Ziqu1g9KrohSC0r8gUuE4iQz-DOIDOQl9UfF6xUxKzD9ISbhAy_mmLSboIpcmFMPI4aquSgoahHv30BJ5yRvVfqE-5YWjtPCMrjmMIMcNzXnK5_bEJaD7oZfUsiEh0QzmJIt8b9So3cKiCsypn09TdJKi7-1FVcn3K7FyReJw-rO3QDhF5kS_C8gulR-TktvgozkqZy2C8bh6pWItz69beKU1_2dkeZfTpIrEeFoqcYgQtGYzgsS1nNKYqPVQIMOgSgH9skqa3jUE6f9Hh9GTIQLTYd4FPt5lhV2J2CeqpJVYTwRmZ_Oud0credAcc1nmH8CqKuWQjzOk_U6vm4PEqJn9xUWRlwyC4QdmouybT-yXHMTfTlOhUk8RQhj0xkLQ3ZuExZnExVAGVtYj1nS5TqOZVnb8DxO-Wu-6Bq9thWYVcxAaJlyGjV5Vy1)
