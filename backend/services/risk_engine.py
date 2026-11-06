"""
SupplyChain Sentinel — Transparent Risk Scoring Engine
Formula:
Risk Score = (0.35 * Delivery Urgency) + (0.25 * Inventory Shortage Severity) + (0.25 * Component Criticality) + (0.15 * Supplier Dependency Risk)
Each factor normalized to 0-100 scale.
Category: High (>=70), Medium (40-69), Low (<40)
"""

from typing import Dict, Any, List

def calculate_disruption_risk(
    delivery_urgency: float = 92.0,
    shortage_severity: float = 88.0,
    component_criticality: float = 90.0,
    supplier_dependency: float = 85.0
) -> Dict[str, Any]:
    """
    Computes explainable risk assessment with factor contributions.
    """
    w_delivery = 0.35
    w_shortage = 0.25
    w_criticality = 0.25
    w_dependency = 0.15

    delivery_contribution = round(w_delivery * delivery_urgency, 2)
    shortage_contribution = round(w_shortage * shortage_severity, 2)
    criticality_contribution = round(w_criticality * component_criticality, 2)
    dependency_contribution = round(w_dependency * supplier_dependency, 2)

    total_score = round(
        delivery_contribution +
        shortage_contribution +
        criticality_contribution +
        dependency_contribution,
        2
    )

    if total_score >= 70:
        classification = "HIGH"
        badge_color = "red"
    elif total_score >= 40:
        classification = "MEDIUM"
        badge_color = "amber"
    else:
        classification = "LOW"
        badge_color = "green"

    return {
        "overall_score": total_score,
        "max_score": 100,
        "classification": classification,
        "badge_color": badge_color,
        "model_type": "Rule-Based Prototype Scoring Model (Multi-Factor Weighted)",
        "formula": "0.35 × Delivery Urgency + 0.25 × Inventory Shortage + 0.25 × Component Criticality + 0.15 × Supplier Dependency",
        "factors": [
            {
                "name": "Delivery Urgency",
                "key": "delivery_urgency",
                "weight": w_delivery,
                "weight_percent": "35%",
                "raw_value": delivery_urgency,
                "contribution": delivery_contribution,
                "rationale": "5-day shipment delay with customer due dates occurring in 4 days (Siemens ORD-501 due Nov 10)."
            },
            {
                "name": "Inventory Shortage Severity",
                "key": "shortage_severity",
                "weight": w_shortage,
                "weight_percent": "25%",
                "raw_value": shortage_severity,
                "contribution": shortage_contribution,
                "rationale": "Available unreserved stock (30 units) vs. required demand (470 units) yields an acute 320 unit net deficit."
            },
            {
                "name": "Component Criticality",
                "key": "component_criticality",
                "weight": w_criticality,
                "weight_percent": "25%",
                "raw_value": component_criticality,
                "contribution": criticality_contribution,
                "rationale": "Microcontroller C-101 is non-substitutable hardware brain across 4 active finished product lines."
            },
            {
                "name": "Supplier Dependency Risk",
                "key": "supplier_dependency",
                "weight": w_dependency,
                "weight_percent": "15%",
                "raw_value": supplier_dependency,
                "contribution": dependency_contribution,
                "rationale": "Supplier A historical reliability is 78.4% (Tier-2 Watchlist) with single-source lot lock."
            }
        ],
        "explanation": {
            "what_happened": "Supplier A (Apex Microelectronics) formally notified a 5-day postponement of shipment SHP-801 containing 500 units of MCU-32 Microcontrollers (C-101) due to packaging qualification re-tests at Hsinchu Fab 4.",
            "why_is_this_risky": "Central warehouse buffer holds only 30 unreserved units. Three critical customer orders (Siemens Energy, Philips Medical, Schneider Electric) total 470 units of C-101 demand within 8 days, leading to immediate line stoppage and liquidated damages.",
            "entities_affected": [
                "Supplier: Apex Microelectronics (SUP-001)",
                "Component: MCU-32 Cortex-M4 (C-101)",
                "Shipment: SHP-801 (Pacific Air Freight TW-EXP-94021)",
                "Products: P-201 (Edge Gateway), P-202 (Medical Telemetry), P-203 (Power Monitor), P-204 (Fleet Telematics)",
                "Customer Orders: ORD-501 (Siemens, $86.4k), ORD-502 (Philips, $68.0k), ORD-503 (Schneider, $72.0k)"
            ],
            "supporting_evidence": [
                "Master Supply Agreement MSA-2023-A Clause 8.4 (Liquidated damages for delayed delivery)",
                "Carrier Exception Notice TW-EXP-94021: Hold at origin packaging line 3",
                "Inventory Audit Q4: Central DC holds 150 units total (120 reserved, 30 unreserved)",
                "Bill of Materials: P-201 requires 2x C-101; P-202 requires 1x C-101; P-203 requires 1x C-101"
            ],
            "suggested_actions": [
                "Immediately approve inter-facility stock reallocation of 180 units from Munich European Hub (48h via DHL Priority Courier)",
                "Issue secondary purchase order to Vanguard Microdevices (SUP-007) for 350 pin-compatible microcontrollers",
                "Enforce MSA Clause 8.4 to demand expedited air charter from Supplier A for the remaining balance at supplier expense"
            ]
        }
    }

def get_network_risk_summary(suppliers: List[Dict], shipments: List[Dict], components: List[Dict]) -> Dict[str, Any]:
    """
    Computes overall risk profile across network entities.
    """
    high_count = sum(1 for s in suppliers if s["risk_status"] == "HIGH")
    med_count = sum(1 for s in suppliers if s["risk_status"] == "MEDIUM")
    low_count = sum(1 for s in suppliers if s["risk_status"] == "LOW")

    delayed_shipments = sum(1 for sh in shipments if sh["status"] == "Delayed")
    in_transit_shipments = sum(1 for sh in shipments if sh["status"] == "In Transit")
    delivered_shipments = sum(1 for sh in shipments if sh["status"] == "Delivered")
    pending_shipments = sum(1 for sh in shipments if sh["status"] == "Pending")

    critical_stock = sum(1 for c in components if c["status"] == "CRITICAL_SHORTAGE")
    low_stock = sum(1 for c in components if c["status"] == "LOW_STOCK")
    normal_stock = sum(1 for c in components if c["status"] == "NORMAL")

    return {
        "overall_health_score": 76.5,
        "health_status": "Attention Required",
        "suppliers_by_risk": {
            "high": high_count,
            "medium": med_count,
            "low": low_count,
            "total": len(suppliers)
        },
        "shipments_by_status": {
            "delayed": delayed_shipments,
            "in_transit": in_transit_shipments,
            "delivered": delivered_shipments,
            "pending": pending_shipments,
            "total": len(shipments)
        },
        "inventory_by_status": {
            "critical": critical_stock,
            "low": low_stock,
            "normal": normal_stock,
            "total": len(components)
        }
    }
