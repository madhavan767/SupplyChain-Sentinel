"""
SupplyChain Sentinel — FastAPI Intelligence Engine Backend
Tagline: From Fragmented Supply Chains to Intelligent Decisions
Institution: Kakinada Institute of Engineering and Technology | Team: WWI
"""

import os
from typing import Optional, List, Dict, Any
from fastapi import FastAPI, HTTPException, Query, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

from services.state_store import state_store
from services.risk_engine import calculate_disruption_risk, get_network_risk_summary
from services.graph_engine import build_dependency_graph, trace_disruption_impact
from services.rag_engine import process_assistant_query, RAG_DOCUMENTS
from services.recovery_engine import recovery_engine

app = FastAPI(
    title="SupplyChain Sentinel API",
    description="Enterprise Supply Chain Risk Intelligence & Recovery Platform",
    version="1.0.0"
)

# Enable CORS for frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatQueryRequest(BaseModel):
    query: str

class PlanStatusRequest(BaseModel):
    status: str
    notes: Optional[str] = ""

@app.get("/")
def root():
    return {
        "platform": "SupplyChain Sentinel",
        "tagline": "From Fragmented Supply Chains to Intelligent Decisions",
        "team": "WWI",
        "institution": "Kakinada Institute of Engineering and Technology",
        "status": "Operational",
        "mode": "DEMO MODE (Controlled Seeded Dataset)"
    }

@app.get("/api/health")
def health_check():
    return {"status": "ok", "scenario_active": state_store.scenario_active}

@app.get("/api/kpis")
def get_kpis():
    kpis = state_store.get_kpis()
    health_summary = get_network_risk_summary(
        state_store.suppliers,
        state_store.shipments,
        state_store.components
    )
    return {
        **kpis,
        "health_summary": health_summary
    }

@app.get("/api/suppliers")
def get_suppliers(
    search: Optional[str] = None,
    risk: Optional[str] = None
):
    results = state_store.suppliers
    if search:
        s_lower = search.lower()
        results = [
            s for s in results
            if s_lower in s["supplier_name"].lower() or s_lower in s["supplier_id"].lower() or s_lower in s["location"].lower()
        ]
    if risk and risk.upper() != "ALL":
        results = [s for s in results if s["risk_status"] == risk.upper()]
    return results

@app.get("/api/suppliers/{supplier_id}")
def get_supplier_detail(supplier_id: str):
    supplier = next((s for s in state_store.suppliers if s["supplier_id"] == supplier_id), None)
    if not supplier:
        raise HTTPException(status_code=404, detail="Supplier not found")

    # Associated components
    components = [c for c in state_store.components if c["supplier_id"] == supplier_id]
    # Associated shipments
    shipments = [sh for sh in state_store.shipments if sh["supplier_id"] == supplier_id]
    # Associated purchase orders
    pos = [po for po in state_store.purchase_orders if po["supplier_id"] == supplier_id]
    # Open incidents
    incidents = [i for i in state_store.incidents if i["supplier_id"] == supplier_id and state_store.scenario_active]

    return {
        "supplier": supplier,
        "components": components,
        "shipments": shipments,
        "purchase_orders": pos,
        "open_incidents": incidents
    }

@app.get("/api/inventory")
def get_inventory(
    search: Optional[str] = None,
    status: Optional[str] = None
):
    results = state_store.components
    if search:
        s_lower = search.lower()
        results = [
            c for c in results
            if s_lower in c["component_name"].lower() or s_lower in c["component_id"].lower() or s_lower in c["supplier_name"].lower()
        ]
    if status and status.upper() != "ALL":
        results = [c for c in results if c["status"] == status.upper()]
    return results

@app.get("/api/inventory/{component_id}")
def get_component_detail(component_id: str):
    comp = next((c for c in state_store.components if c["component_id"] == component_id), None)
    if not comp:
        raise HTTPException(status_code=404, detail="Component not found")

    supplier = next((s for s in state_store.suppliers if s["supplier_id"] == comp["supplier_id"]), None)
    alternate = next((s for s in state_store.suppliers if s["supplier_id"] == comp.get("alternate_supplier_id")), None)
    
    # Products that require this component
    connected_products = [
        p for p in state_store.products
        if component_id in p["component_requirements"]
    ]

    return {
        "component": comp,
        "supplier": supplier,
        "alternate_supplier": alternate,
        "connected_products": connected_products
    }

@app.get("/api/orders")
def get_orders(
    order_type: Optional[str] = "customer",
    status: Optional[str] = None,
    priority: Optional[str] = None
):
    if order_type == "purchase":
        results = state_store.purchase_orders
    else:
        results = state_store.customer_orders
        if status and status.upper() != "ALL":
            results = [o for o in results if o["status"].upper() == status.upper()]
        if priority and priority.upper() != "ALL":
            results = [o for o in results if o["priority"].upper() == priority.upper()]
    return results

@app.get("/api/shipments")
def get_shipments(
    status: Optional[str] = None
):
    results = state_store.shipments
    if status and status.upper() != "ALL":
        results = [s for s in results if s["status"].upper() == status.upper()]
    return results

@app.get("/api/shipments/{shipment_id}")
def get_shipment_detail(shipment_id: str):
    sh = next((s for s in state_store.shipments if s["shipment_id"] == shipment_id), None)
    if not sh:
        raise HTTPException(status_code=404, detail="Shipment not found")

    supplier = next((s for s in state_store.suppliers if s["supplier_id"] == sh["supplier_id"]), None)
    comp = next((c for c in state_store.components if c["component_id"] == sh["component_id"]), None)
    incident = next((i for i in state_store.incidents if i.get("shipment_id") == shipment_id), None)

    return {
        "shipment": sh,
        "supplier": supplier,
        "component": comp,
        "incident": incident
    }

@app.get("/api/incidents")
def get_incidents():
    if not state_store.scenario_active:
        return []
    return state_store.incidents

@app.get("/api/dependencies")
def get_dependency_graph(highlight: bool = False):
    return build_dependency_graph(
        suppliers=state_store.suppliers,
        components=state_store.components,
        products=state_store.products,
        shipments=state_store.shipments,
        customer_orders=state_store.customer_orders,
        highlight_disruption=highlight or state_store.impact_traced
    )

@app.post("/api/dependencies/trace")
def trace_dependencies():
    state_store.impact_traced = True
    return trace_disruption_impact(incident_id="INC-2024-001")

@app.get("/api/risk-analysis")
def get_risk_analysis():
    disruption = calculate_disruption_risk()
    network_summary = get_network_risk_summary(
        state_store.suppliers,
        state_store.shipments,
        state_store.components
    )
    return {
        "disruption_assessment": disruption,
        "network_summary": network_summary,
        "scenario_active": state_store.scenario_active
    }

@app.get("/api/recovery-plans")
def get_recovery_plans():
    return {
        "scenario": "Supplier A (C-101) 5-Day Shipment Delay",
        "options": recovery_engine.get_options()
    }

@app.post("/api/recovery-plans/{plan_id}/status")
def update_recovery_plan_status(plan_id: str, payload: PlanStatusRequest):
    try:
        updated = recovery_engine.update_option_status(
            option_id=plan_id,
            new_status=payload.status,
            notes=payload.notes or ""
        )
        return {"success": True, "plan": updated}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@app.post("/api/assistant/chat")
def chat_with_assistant(payload: ChatQueryRequest):
    return process_assistant_query(payload.query)

@app.get("/api/documents")
def get_documents():
    return RAG_DOCUMENTS

@app.post("/api/scenario/run")
def run_scenario():
    state_store.run_scenario()
    return {"success": True, "message": "Disruption scenario activated (Supplier A 5-day delay)"}

@app.post("/api/scenario/reset")
def reset_scenario():
    state_store.reset()
    return {"success": True, "message": "Demo state reset to original baseline"}

@app.post("/api/scenario/clear")
def clear_scenario():
    state_store.clear_scenario()
    return {"success": True, "message": "Scenario cleared to non-disrupted state"}
