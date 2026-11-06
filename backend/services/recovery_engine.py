"""
SupplyChain Sentinel — Operational Recovery Planning Engine
Formulates concrete, quantifiable recovery options for the primary disruption scenario:
Supplier A delays Component C-101 (500 units) by 5 days.
Allows user to evaluate, compare, approve, reject, or mark options under review.
"""

from typing import List, Dict, Any

# Initial baseline recovery options
INITIAL_RECOVERY_OPTIONS = [
    {
        "id": "REC-OPT-001",
        "title": "Warehouse Inter-Facility Reallocation (Munich Hub)",
        "strategy": "Inventory Transfer",
        "action_description": "Transfer 180 units of Component C-101 from Munich European Logistics Hub strategic buffer to Central DC Chicago via priority dedicated air courier (DHL Express 48h).",
        "time_to_resolve_hours": 48,
        "time_to_resolve_display": "48 Hours (2 Days)",
        "estimated_cost": 1450.00,
        "feasibility": "High",
        "feasibility_score": 95,
        "operational_impact": "Directly covers Siemens Energy ORD-501 (120 units of P-201 = 240 MCUs, reduced deficit) and completely covers Philips Medical ORD-502. Mitigates 65% of total imminent line stoppage risk.",
        "supporting_evidence": "DOC-INV-AUDIT (Global Distribution Network Inventory Audit Q4 confirms 180 units unreserved in Munich Hub Bin M-08).",
        "assumptions_and_constraints": "Requires customs expedite clearance at Chicago O'Hare. Packaging requires standard ESD compliance.",
        "status": "Recommended",
        "review_notes": "Lowest operational friction and fastest execution speed.",
        "is_recommended": True
    },
    {
        "id": "REC-OPT-002",
        "title": "Activate Pre-Qualified Alternative Supplier (Vanguard Microdevices)",
        "strategy": "Secondary Sourcing",
        "action_description": "Issue emergency purchase order for 350 pin-compatible microcontrollers (VM-3200) to Vanguard Microdevices (SUP-007, Hsinchu, Taiwan) under pre-negotiated tier-2 agreement.",
        "time_to_resolve_hours": 72,
        "time_to_resolve_display": "72 Hours (3 Days)",
        "estimated_cost": 5950.00,
        "feasibility": "High",
        "feasibility_score": 88,
        "operational_impact": "Fully resolves the entire 320-unit net shortage across all customer orders (ORD-501 Siemens, ORD-502 Philips, ORD-503 Schneider, ORD-504 Tesla) with 30 units surplus safety margin.",
        "supporting_evidence": "DOC-SUP-A-CONTRACT Clause 9.1 (Authorizes secondary sourcing during vendor allocation) & DOC-SUP-PERF (Vanguard reliability 91.3%, spot stock verified).",
        "assumptions_and_constraints": "Incurs a $2.50/unit emergency surcharge ($17.00/unit vs $14.50 contracted with Supplier A). Firmware flashing verified pin-compatible.",
        "status": "Available",
        "review_notes": "Slight cost premium ($5,950 total) but provides 100% volume recovery.",
        "is_recommended": False
    },
    {
        "id": "REC-OPT-003",
        "title": "Enforce Contract Clause 8.4 — Expedited Air Charter via Supplier A",
        "strategy": "Contract SLA Enforcement",
        "action_description": "Formally invoke Master Supply Agreement Clause 8.4 requiring Supplier A (Apex Microelectronics) to split the 500-unit batch, air-freighting the first 250 qualified units via direct private charter at Supplier A's sole expense.",
        "time_to_resolve_hours": 60,
        "time_to_resolve_display": "48–60 Hours",
        "estimated_cost": 0.00,
        "feasibility": "Medium",
        "feasibility_score": 75,
        "operational_impact": "Accelerates arrival of 250 units by 3 days ahead of revised schedule. Zero direct expense to company; preserves commercial leverage.",
        "supporting_evidence": "DOC-SUP-A-CONTRACT Section 8.4 (Liquidated damages and mandatory air charter cost absorption upon supplier packaging delay).",
        "assumptions_and_constraints": "Contingent on Supplier A packaging line completing QA re-screening of the first 250-unit sub-lot by Nov 08.",
        "status": "Available",
        "review_notes": "Zero direct cost, but carries execution risk if supplier QA re-test fails.",
        "is_recommended": False
    },
    {
        "id": "REC-OPT-004",
        "title": "Dynamic Customer Order Rescheduling & Tiered Allocation",
        "strategy": "Demand Shaping & Rationing",
        "action_description": "Allocate all 150 units of existing Chicago inventory to immediately fulfill 100% of Philips Medical (ORD-502, 80 MCUs) and 50% of Siemens Energy (ORD-501, 70 MCUs). Issue a 2% SLA commercial goodwill discount on the remaining 50% Siemens delivery due Nov 14.",
        "time_to_resolve_hours": 24,
        "time_to_resolve_display": "Immediate (24 Hours)",
        "estimated_cost": 3200.00,
        "feasibility": "Very High",
        "feasibility_score": 92,
        "operational_impact": "Prevents any interruption to high-criticality medical telemetry lines (Philips). Avoids catastrophic customer breach while delayed shipment SHP-801 arrives Nov 13.",
        "supporting_evidence": "DOC-BOM-SPEC & CUSTOMER_ORDERS contract penalty terms (Siemens accepts staged split shipments under commercial waiver protocol).",
        "assumptions_and_constraints": "Requires customer sign-off from Siemens procurement lead. Sales account manager must issue commercial goodwill credit voucher.",
        "status": "Available",
        "review_notes": "Immediate operational execution without relying on cross-border logistics.",
        "is_recommended": False
    }
]

class RecoveryEngine:
    def __init__(self):
        self.options = [dict(opt) for opt in INITIAL_RECOVERY_OPTIONS]

    def get_options(self) -> List[Dict[str, Any]]:
        return self.options

    def update_option_status(self, option_id: str, new_status: str, notes: str = "") -> Dict[str, Any]:
        valid_statuses = ["Recommended", "Available", "Under Review", "Approved", "Rejected"]
        for opt in self.options:
            if opt["id"] == option_id:
                opt["status"] = new_status
                if notes:
                    opt["review_notes"] = notes
                return opt
        raise ValueError(f"Option {option_id} not found")

    def reset_options(self):
        self.options = [dict(opt) for opt in INITIAL_RECOVERY_OPTIONS]

recovery_engine = RecoveryEngine()
