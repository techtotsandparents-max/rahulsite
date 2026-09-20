# Azure Infrastructure Low-Level Design (LLD)

## Target Architecture Overview

The target architecture moves RahulSite from a public endpoint model to a secure, private network model within Azure. It uses **VNet Integration** for outbound traffic from compute resources (Web App, Function App, LLM App) and **Private Endpoints** to secure PaaS services (Cosmos DB, Storage, Key Vault). 

To optimize cost, the Web App, Function App, and the LLM Container App (implemented as a Web App for Containers) all share the same App Service Plan.

### Key Components

- **Resource Group:** `Rahulsite`
- **Subscription:** `Rahultest`
- **App Service Plan:** `ASP-prometheusRG-8346 (B1: 1)` (Shared by Web App, Function App, LLM App)
- **Virtual Network:** Manages two primary subnets (`snet-integration`, `snet-endpoints`). Optionally, an `snet-appgw` for Application Gateway ingress.
- **Key Vault:** Stores all application secrets. Accessed via Managed Identity.

## Network Architecture Diagram

```mermaid
flowchart LR
    %% External Entities
    Internet((Public Internet))
    GH([GitHub Actions CI/CD])

    subgraph Azure [Microsoft Azure]
        
        %% Ingress Layer (Based on Image 1/2)
        subgraph SNetGateway [Subnet: App Gateway]
            AppGW[Application Gateway]
        end
        
        subgraph VNet [Virtual Network: vnet-rahulsite]
            
            %% Compute / App Service Environment equivalent
            subgraph SNetIntegration [Subnet: Compute Integration]
                direction TB
                note1[App Service Plan: ASP-prometheusRG-8346]
                
                WebApp[Web App: RahulSite UI]
                FuncApp[Function App: API / Backend]
                LLMApp[Web App for Containers: Offline LLM]
                
                WebApp -->|Internal Call| FuncApp
                FuncApp -->|Inference Call| LLMApp
            end

            %% Data & Secrets Layer
            subgraph SNetEndpoints [Subnet: Private Endpoints]
                direction TB
                PE_Cosmos((PE: Cosmos DB))
                PE_KV((PE: Key Vault))
                PE_Storage((PE: Blob Storage))
            end
        end
        
        %% Actual Azure Resources
        Cosmos[(Azure Cosmos DB)]
        KV[Azure Key Vault]
        Storage[(Azure Storage Account)]

        %% Private Link Connections
        PE_Cosmos -.->|Private Link| Cosmos
        PE_KV -.->|Private Link| KV
        PE_Storage -.->|Private Link| Storage
    end

    %% Ingress Flow
    Internet -->|HTTPS| AppGW
    AppGW -->|Route Traffic| WebApp
    GH -.->|Deploy| WebApp
    GH -.->|Deploy| FuncApp
    GH -.->|Deploy| LLMApp

    %% Outbound Flow via VNet Integration
    WebApp -->|VNet Integration| PE_Cosmos
    WebApp -->|VNet Integration| PE_KV
    WebApp -->|VNet Integration| PE_Storage
    
    FuncApp -->|VNet Integration| PE_Cosmos
    FuncApp -->|VNet Integration| PE_KV
    
    LLMApp -->|VNet Integration| PE_Storage

    %% Styling
    classDef vnet fill:#e1f5fe,stroke:#03a9f4,stroke-width:2px,stroke-dasharray: 5 5;
    classDef subnet fill:#f3f4f6,stroke:#9ca3af,stroke-width:1px;
    classDef resource fill:#fff,stroke:#3b82f6,stroke-width:2px;
    classDef pe fill:#e0f2fe,stroke:#0284c7,stroke-width:1.5px,shape:circle;

    class VNet vnet;
    class SNetIntegration,SNetEndpoints,SNetGateway subnet;
    class WebApp,FuncApp,LLMApp,KV,Cosmos,Storage,AppGW resource;
    class PE_KV,PE_Cosmos,PE_Storage pe;
```

## Security & Connectivity Rules

1. **VNet Integration:** Web App, Function App, and LLM Container App must be integrated into `snet-integration`.
2. **Private Endpoints:** PaaS services will have public network access disabled. They are accessed via private IP addresses assigned in `snet-endpoints`.
3. **Internal App Communication:** The Function App and LLM App should be restricted to only accept traffic originating from within the Virtual Network (or via Private Endpoint if scaling up) to prevent direct public access.
4. **Managed Identities:** Web App and Function App will use System Assigned Managed Identities.
5. **Key Vault RBAC:** Access to Key Vault secrets will be granted via Role-Based Access Control (RBAC) to the managed identities.
