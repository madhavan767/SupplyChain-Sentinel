"""
SupplyChain Sentinel — Central Application State Store
Maintains unified state across all pages:
Dashboard, Suppliers, Inventory, Shipments, Dependency Map, Risk Analysis, AI Assistant, Recovery Planning.
"""

from typing import Dict, Any, List
import copy
from data.seed_data import (
    SUPPLIERS,
    COMPONENTS,
    PRODUCTS,
    SHIPMENTS,
    PURCHASE_ORDERS,
    CUSTOMER_ORDERS,
    INCIDENTS,
    RAG_DOCUMENTS
)
from services.recovery_engine import recovery_engine

class SentinelStateStore:
    def __init__(self):
        self.reset()

    def reset(self):
        self.scenario_active = True
        self.impact_traced = True
        self.suppliers = copy.deepcopy(SUPPLIERS)
        self.components = copy.deepcopy(COMPONENTS)
        self.products = copy.deepcopy(PRODUCTS)
        self.shipments = copy.deepcopy(SHIPMENTS)
        self.purchase_orders = copy.deepcopy(PURCHASE_ORDERS)
        self.customer_orders = copy.deepcopy(CUSTOMER_ORDERS)
        self.incidents = copy.deepcopy(INCIDENTS)
        recovery_engine.reset_options()

    def run_scenario(self):
        """
        Activates the Supplier A 5-day delay disruption on component C-101.
        """
        self.scenario_active = True
        self.impact_traced = True

        # Ensure Supplier A is HIGH risk
        for s in self.suppliers:
            if s["supplier_id"] == "SUP-001":
                s["risk_status"] = "HIGH"

        # Ensure Component C-101 is CRITICAL_SHORTAGE
        for c in self.components:
            if c["component_id"] == "C-101":
                c["status"] = "CRITICAL_SHORTAGE"

        # Ensure Shipment SHP-801 is Delayed +5 days
        for sh in self.shipments:
            if sh["shipment_id"] == "SHP-801":
                sh["status"] = "Delayed"
                sh["delay_days"] = 5
                sh["revised_delivery"] = "2026-11-13"

        # Ensure customer orders are At Risk
        for co in self.customer_orders:
            if co["order_id"] in ["ORD-501", "ORD-502", "ORD-503"]:
                co["status"] = "At Risk"

    def clear_scenario(self):
        """
        Reverts the Supplier A disruption to a normal baseline state.
        """
        self.scenario_active = False
        self.impact_traced = False

        for s in self.suppliers:
            if s["supplier_id"] == "SUP-001":
                s["risk_status"] = "LOW"

        for c in self.components:
            if c["component_id"] == "C-101":
                c["status"] = "NORMAL"

        for sh in self.shipments:
            if sh["shipment_id"] == "SHP-801":
                sh["status"] = "In Transit"
                sh["delay_days"] = 0
                sh["revised_delivery"] = "2026-11-08"

        for co in self.customer_orders:
            if co["order_id"] in ["ORD-501", "ORD-502", "ORD-503"]:
                co["status"] = "On Track"

    def get_kpis(self) -> Dict[str, Any]:
        """
        Computes accurate KPI metrics directly derived from the dataset.
        """
        total_suppliers = len(self.suppliers)
        active_shipments = sum(1 for s in self.shipments if s["status"] in ["In Transit", "Delayed", "Pending"])
        total_inventory_items = len(self.components)
        active_risk_alerts = len([i for i in self.incidents if i["status"] in ["ACTIVE_INVESTIGATION", "MONITORING"]]) if self.scenario_active else 0
        affected_orders = len([o for o in self.customer_orders if o["status"] == "At Risk"]) if self.scenario_active else 0

        total_value_at_risk = sum(o["order_value"] for o in self.customer_orders if o["status"] == "At Risk") if self.scenario_active else 0

        return {
            "total_suppliers": total_suppliers,
            "active_shipments": active_shipments,
            "total_inventory_items": total_inventory_items,
            "active_risk_alerts": active_risk_alerts,
            "affected_orders": affected_orders,
            "total_value_at_risk": total_value_at_risk,
            "scenario_active": self.scenario_active,
            "impact_traced": self.impact_traced
        }

state_store = SentinelStateStore()
