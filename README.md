# SupplyChain Sentinel

> **Tagline:** From Fragmented Supply Chains to Intelligent Decisions  
> **Project Domain:** AI & DeepTech  
> **Team:** WWI  
> **Institution:** Kakinada Institute of Engineering and Technology  

---

## 1. Project Overview

**SupplyChain Sentinel** is an enterprise AI-powered Supply Chain Risk Intelligence & Recovery Control Tower prototype. Modern global hardware manufacturers and industrial OEMs suffer from fragmented visibility across tier-1/tier-2 suppliers, logistics partners, and ERP inventories. When an upstream disruption occurs, procurement teams struggle to trace ripple effects to customer delivery commitments.

SupplyChain Sentinel provides:
- **Unified Supplier & Inventory Monitoring**: Centralized telemetry across suppliers, shipments, parts inventories, and customer purchase commitments.
- **Dependency Intelligence Knowledge Graph**: Interactive multi-tier graph modeling the relationships between Suppliers, Shipments, Components, Finished Products, Warehouses, and Customer Orders.
- **Explainable Multi-Factor Risk Intelligence**: A transparent, weighted risk model that decomposes operational risk into Delivery Urgency, Shortage Severity, Component Criticality, and Supplier Dependency.
- **Grounded AI Assistant (RAG)**: Conversational intelligence powered by Retrieval-Augmented Generation over Master Supply Agreements (MSAs), carrier exception notices, warehouse audits, and Bills of Materials (BOMs).
- **Interactive Recovery Planning**: Four quantifiable mitigation pathways (inter-warehouse reallocation, backup supplier activation, expedited air charter, customer delivery tiering) with live approval state workflows.

---

## 2. The Primary Demonstration Scenario

A supplier named **Supplier A (Apex Microelectronics - `SUP-001`)** reports that a shipment containing **500 microcontrollers (Component `C-101`)** will be delayed by **five days** (rescheduled from Nov 08 to Nov 13, 2026) due to electrical lot qualification holds at Hsinchu Fab 4.

The platform immediately investigates this disruption:
1. **Identifies Affected Products**: Product `P-201` (Edge Gateway Pro, requires 2x C-101), Product `P-202` (Medical Telemetry, requires 1x C-101), Product `P-203` (Power Monitor, requires 1x C-101), and Product `P-204` (Fleet Telematics, requires 2x C-101).
2. **Calculates Inventory Shortage**: Central DC Chicago holds only 150 total units of C-101 (120 units reserved for work-in-progress, leaving only 30 unreserved units). The immediate demand for critical customer orders before Nov 14 totals 470 units, resulting in an acute **net deficit of −320 units**.
3. **Flags Customer Orders at Risk**:
   - `ORD-501` (Siemens Energy Automation) — 120 units ($86,400) due Nov 10.
   - `ORD-502` (Philips Medical Systems) — 80 units ($68,000) due Nov 12.
   - `ORD-503` (Schneider Electric) — 150 units ($72,000) due Nov 14.
   - Total financial exposure: **$253,400**.
4. **Knowledge Graph Traversal**: The interactive graph visually highlights the exact disruption propagation path from Supplier A → C-101 → Products → Customer Orders.
5. **Grounded AI RAG Diagnosis**: Retrieves exact contract clauses (MSA-2023-A Clause 8.4 and 9.1) and warehouse buffer audits (Munich Hub has 180 units available).
6. **Formulates 4 Operational Recovery Options**: Enables decision-makers to evaluate and approve an inter-facility transfer from Munich (Option 1) or secondary sourcing from Vanguard Microdevices (Option 2).

---

## 3. Application Architecture & Technology Stack

```
SupplyChain Sentinel
├── backend/ (FastAPI + Python 3.9+)
│   ├── main.py                     # REST API endpoints & CORS middleware
│   ├── data/seed_data.py           # 12 Suppliers, 30 Components, 15 Products, 20 Shipments, 50 Orders
│   ├── services/
│   │   ├── risk_engine.py          # Explainable multi-factor risk scoring engine
│   │   ├── graph_engine.py         # Knowledge graph construction & DFS impact traversal
│   │   ├── rag_engine.py           # Grounded RAG with document citation & fallback engine
│   │   ├── recovery_engine.py      # 4 operational recovery options with state updates
│   │   └── state_store.py          # Central in-memory state manager & scenario controls
│   └── requirements.txt
│
└── frontend/ (React 18 + TypeScript + Vite + Tailwind CSS)
    ├── src/
    │   ├── components/             # Sidebar, Navbar, DemoControls, NodeComponents
    │   ├── context/AppContext.tsx   # Global reactive state synchronizer
    │   ├── pages/
    │   │   ├── Dashboard.tsx        # /dashboard (Control Tower KPIs, Alerts, Pipeline)
    │   │   ├── Suppliers.tsx        # /suppliers (Directory, Reliability, Drawers)
    │   │   ├── Inventory.tsx        # /inventory (BOM explosion, Shortage math, Orders)
    │   │   ├── Shipments.tsx        # /shipments (Milestone tracking, Exception notices)
    │   │   ├── DependencyMap.tsx    # /dependency-map (Interactive React Flow Knowledge Graph)
    │   │   ├── RiskAnalysis.tsx     # /risk-analysis (Transparent weighted formula & sliders)
    │   │   ├── AIAssistant.tsx      # /ai-assistant (Grounded RAG conversational UI & Citations)
    │   │   └── RecoveryPlans.tsx    # /recovery-plans (Option comparison & approval workflow)
    │   └── services/api.ts          # Centralized API service layer
    └── package.json
```

---

## 4. Installation & Quick Start

### Prerequisites
- Node.js (v18+ or v20+)
- Python (3.9+)

### Step 1: Start Backend Server
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --host 127.0.0.1 --port 8000
```
Backend will be live at: `http://127.0.0.1:8000`  
API Swagger Docs available at: `http://127.0.0.1:8000/docs`

### Step 2: Start Frontend Server
In a separate terminal:
```bash
cd frontend
npm install
npm run dev
```
Frontend will be live at: `http://localhost:5173/`

---

## 5. Environment Variables

Create a `.env` file in the `backend/` directory (refer to `backend/.env.example`):

```bash
# Optional: Google Gemini API key for live LLM inference in the AI Assistant.
# If omitted or left blank, the system automatically uses the deterministic
# grounded fallback engine with 100% verified factual citations.
GEMINI_API_KEY=
PORT=8000
HOST=0.0.0.0
```

---

## 6. Demo Scenario Walkthrough (Judges Presentation Path)

The optimal presentation flow follows the end-to-end journey:

1. **Dashboard (`/dashboard`)**:
   - Inspect the KPI control tower: 12 Suppliers, 17 Active Shipments, 30 Components, 2 Active Alerts, 3 Affected Orders.
   - Observe the prominent **Supplier A Disruption Alert Banner** detailing the 5-day delay on C-101.
2. **Shipment Monitoring (`/shipments`)**:
   - Examine shipment `SHP-801` (Pacific Air Freight).
   - Click to open the **Simulated Shipment Milestone Timeline** showing the packaging electrical QA hold at Hsinchu Fab 4.
3. **Dependency Map (`/dependency-map`)**:
   - View the multi-tier interactive knowledge graph connecting Suppliers, Components, Products, and Orders.
   - Click **"Trace Disruption Impact"**: The graph illuminates the red failure path from Supplier A → C-101 → P-201/P-202/P-203 → Customer Orders (Siemens, Philips, Schneider).
   - Review the side **Impact Summary Panel** showing the −320 unit net deficit and $253,400 revenue exposure.
4. **Risk Intelligence (`/risk-analysis`)**:
   - Review the transparent scoring formula:
     $$\text{Risk Score} = 0.35 \times \text{Urgency} + 0.25 \times \text{Shortage} + 0.25 \times \text{Criticality} + 0.15 \times \text{Dependency}$$
   - Observe the **89.5 / 100 (HIGH RISK)** composite score.
   - Interact with the factor sensitivity sliders to demonstrate real-time risk recalculation.
5. **AI Assistant (`/ai-assistant`)**:
   - Click suggested prompt: *"What happens if Supplier A delays Component C-101 by five days?"*
   - Observe the structured response with verified citations to `DOC-INC-2024-001`, `DOC-SUP-A-CONTRACT`, and `DOC-INV-AUDIT`.
   - Click any citation chip to inspect the underlying verified source excerpt.
6. **Recovery Planning (`/recovery-plans`)**:
   - Review the 4 formulated recovery options (Munich Hub Reallocation, Vanguard Secondary Sourcing, Supplier A Air Charter, Customer Tiering).
   - Toggle **"Compare All 4 Options"** to view side-by-side trade-offs.
   - Click **"Approve for Execution"** on Option 1 (Munich Reallocation): Observe the state dynamically update to **Approved** across the platform.
7. **Demo Controls**:
   - Test **"Reset Demo"** in the top navigation bar to restore the baseline dataset.
   - Test **"Run Scenario"** to re-trigger the primary incident.

---

## 7. Current Limitations vs. Future Roadmap

| Area | Current Prototype Implementation | Production / Planned Roadmap |
|---|---|---|
| **Data Ingestion** | Controlled seeded dataset (12 suppliers, 30 parts, 50 orders) | Live webhook integrations with SAP ERP, Oracle SCM, and EDI 856 ASN feeds |
| **Risk Modeling** | Explainable rule-based prototype scoring model with factor sliders | Machine-learning calibrated probabilistic models with weather and AIS vessel feeds |
| **Knowledge Graph** | In-memory graph serialized for React Flow visualization | Distributed Neo4j property graph with graph neural network (GNN) link prediction |
| **RAG Retrieval** | Keyword/BM25 token search with Gemini LLM or grounded deterministic fallback | Hybrid dense vector search (Qdrant/Pinecone) with reranking and automated SLA extraction |
| **Recovery Execution** | Interactive approval and review workflow in UI state | Automated ERP PO generation, carrier booking API integration, and automated customer notifications |
