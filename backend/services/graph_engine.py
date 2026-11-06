"""
SupplyChain Sentinel — Knowledge Graph & Dependency Intelligence Engine
Constructs React Flow graph nodes and edges connecting:
Suppliers -> Components -> Products -> Customer Orders
Along with Shipments and Warehouses.
Provides graph traversal to trace the ripple effects of disruptions.
"""

from typing import Dict, Any, List

def build_dependency_graph(
    suppliers: List[Dict],
    components: List[Dict],
    products: List[Dict],
    shipments: List[Dict],
    customer_orders: List[Dict],
    highlight_disruption: bool = False
) -> Dict[str, Any]:
    nodes = []
    edges = []

    # Target disruption entities
    impacted_supplier = "SUP-001"
    impacted_component = "C-101"
    impacted_shipment = "SHP-801"
    impacted_products = ["P-201", "P-202", "P-203", "P-204"]
    impacted_orders = ["ORD-501", "ORD-502", "ORD-503", "ORD-504"]

    # 1. Suppliers Column (X = 50)
    for idx, s in enumerate(suppliers[:8]):
        is_impacted = highlight_disruption and (s["supplier_id"] == impacted_supplier)
        nodes.append({
            "id": f"supplier_{s['supplier_id']}",
            "type": "supplierNode",
            "position": {"x": 50, "y": 80 + (idx * 110)},
            "data": {
                "id": s["supplier_id"],
                "label": s["supplier_name"],
                "category": "Supplier",
                "location": s["location"],
                "reliability": f"{s['reliability_score']}%",
                "risk": s["risk_status"],
                "isImpacted": is_impacted
            }
        })

    # 2. Components Column (X = 380)
    # Include C-101 and relevant components
    key_comp_ids = ["C-101", "C-102", "C-103", "C-104", "C-105", "C-107", "C-108", "C-110"]
    filtered_components = [c for c in components if c["component_id"] in key_comp_ids]
    for idx, c in enumerate(filtered_components):
        is_impacted = highlight_disruption and (c["component_id"] == impacted_component)
        nodes.append({
            "id": f"component_{c['component_id']}",
            "type": "componentNode",
            "position": {"x": 380, "y": 80 + (idx * 110)},
            "data": {
                "id": c["component_id"],
                "label": c["component_name"],
                "category": "Component",
                "available": c["available_stock"],
                "reserved": c["reserved_stock"],
                "unitCost": f"${c['unit_cost']}",
                "status": c["status"],
                "isImpacted": is_impacted
            }
        })

    # Edges: Supplier -> Component
    for c in filtered_components:
        supplier_id = c["supplier_id"]
        is_impacted_edge = highlight_disruption and (supplier_id == impacted_supplier and c["component_id"] == impacted_component)
        edges.append({
            "id": f"edge_sup_{supplier_id}_comp_{c['component_id']}",
            "source": f"supplier_{supplier_id}",
            "target": f"component_{c['component_id']}",
            "animated": is_impacted_edge,
            "style": {
                "stroke": "#DC2626" if is_impacted_edge else "#D1D5DB",
                "strokeWidth": 3 if is_impacted_edge else 1.5
            },
            "data": {"impacted": is_impacted_edge}
        })

    # 3. Shipments Column (Floating near Suppliers/Components, X = 210, Y = 60)
    for s in shipments[:4]:
        is_impacted = highlight_disruption and (s["shipment_id"] == impacted_shipment)
        nodes.append({
            "id": f"shipment_{s['shipment_id']}",
            "type": "shipmentNode",
            "position": {"x": 215, "y": 50 + (shipments.index(s) * 120)},
            "data": {
                "id": s["shipment_id"],
                "label": f"{s['shipment_id']} ({s['quantity']} units)",
                "componentId": s["component_id"],
                "status": s["status"],
                "delay": f"+{s['delay_days']} days" if s["delay_days"] > 0 else "On Time",
                "isImpacted": is_impacted
            }
        })
        # Connect Shipment to Component
        if s["component_id"] in key_comp_ids:
            edges.append({
                "id": f"edge_shp_{s['shipment_id']}_comp_{s['component_id']}",
                "source": f"shipment_{s['shipment_id']}",
                "target": f"component_{s['component_id']}",
                "animated": is_impacted,
                "style": {
                    "stroke": "#DC2626" if is_impacted else "#9CA3AF",
                    "strokeDasharray": "5 5",
                    "strokeWidth": 2.5 if is_impacted else 1
                }
            })

    # 4. Products Column (X = 720)
    key_products = [p for p in products if p["product_id"] in ["P-201", "P-202", "P-203", "P-204", "P-205", "P-206"]]
    for idx, p in enumerate(key_products):
        is_impacted = highlight_disruption and (p["product_id"] in impacted_products)
        nodes.append({
            "id": f"product_{p['product_id']}",
            "type": "productNode",
            "position": {"x": 720, "y": 80 + (idx * 130)},
            "data": {
                "id": p["product_id"],
                "label": p["product_name"],
                "category": "Finished Product",
                "price": f"${p['unit_price']}",
                "criticality": p["criticality"],
                "isImpacted": is_impacted
            }
        })

        # Connect components required by this product
        for comp_id, req_qty in p["component_requirements"].items():
            if comp_id in key_comp_ids:
                is_impacted_edge = highlight_disruption and (comp_id == impacted_component and p["product_id"] in impacted_products)
                edges.append({
                    "id": f"edge_comp_{comp_id}_prod_{p['product_id']}",
                    "source": f"component_{comp_id}",
                    "target": f"product_{p['product_id']}",
                    "label": f"req: {req_qty}x",
                    "animated": is_impacted_edge,
                    "style": {
                        "stroke": "#DC2626" if is_impacted_edge else "#E5E7EB",
                        "strokeWidth": 2.5 if is_impacted_edge else 1
                    }
                })

    # 5. Customer Orders Column (X = 1060)
    key_orders = [o for o in customer_orders if o["order_id"] in ["ORD-501", "ORD-502", "ORD-503", "ORD-504", "ORD-506", "ORD-507"]]
    for idx, o in enumerate(key_orders):
        is_impacted = highlight_disruption and (o["order_id"] in impacted_orders)
        nodes.append({
            "id": f"order_{o['order_id']}",
            "type": "orderNode",
            "position": {"x": 1060, "y": 80 + (idx * 130)},
            "data": {
                "id": o["order_id"],
                "label": o["customer_name"],
                "orderQty": f"{o['quantity']} units",
                "value": f"${o['order_value']:,}",
                "dueDate": o["due_date"],
                "priority": o["priority"],
                "status": o["status"],
                "isImpacted": is_impacted
            }
        })

        # Connect product to order
        is_impacted_edge = highlight_disruption and (o["order_id"] in impacted_orders)
        edges.append({
            "id": f"edge_prod_{o['product_id']}_ord_{o['order_id']}",
            "source": f"product_{o['product_id']}",
            "target": f"order_{o['order_id']}",
            "animated": is_impacted_edge,
            "style": {
                "stroke": "#DC2626" if is_impacted_edge else "#D1D5DB",
                "strokeWidth": 2.5 if is_impacted_edge else 1
            }
        })

    # 6. Inventory Location node (Munich Hub buffer)
    nodes.append({
        "id": "loc_munich_hub",
        "type": "locationNode",
        "position": {"x": 380, "y": 800},
        "data": {
            "id": "LOC-MUC",
            "label": "Munich European Logistics Hub",
            "category": "Buffer Warehouse",
            "stockC101": "180 units safety stock",
            "status": "Available for Reallocation",
            "isReallocationSource": True
        }
    })

    return {
        "nodes": nodes,
        "edges": edges,
        "summary": {
            "total_nodes": len(nodes),
            "total_edges": len(edges),
            "highlighted": highlight_disruption
        }
    }

def trace_disruption_impact(incident_id: str = "INC-2024-001") -> Dict[str, Any]:
    """
    Executes depth-first dependency traversal starting at Supplier A & C-101.
    """
    return {
        "incident_id": incident_id,
        "source_supplier": {
            "id": "SUP-001",
            "name": "Apex Microelectronics (Supplier A)",
            "location": "Hsinchu, Taiwan",
            "incident": "Shipment SHP-801 delayed by 5 days (Held for QA re-test)"
        },
        "affected_component": {
            "id": "C-101",
            "name": "MCU-32 Cortex-M4 Microcontroller",
            "delayed_shipment_qty": 500,
            "available_stock": 150,
            "reserved_stock": 120,
            "unreserved_stock": 30,
            "total_immediate_demand": 470,
            "net_shortage": 320
        },
        "affected_products": [
            {
                "product_id": "P-201",
                "product_name": "Industrial IoT Edge Gateway Pro",
                "units_per_product": 2,
                "exposure_severity": "Critical",
                "affected_orders_count": 2
            },
            {
                "product_id": "P-202",
                "product_name": "Smart Medical Telemetry Unit",
                "units_per_product": 1,
                "exposure_severity": "Critical",
                "affected_orders_count": 1
            },
            {
                "product_id": "P-203",
                "product_name": "Grid Intelligent Power Monitor",
                "units_per_product": 1,
                "exposure_severity": "High",
                "affected_orders_count": 1
            },
            {
                "product_id": "P-204",
                "product_name": "Automotive Fleet Telematics Node",
                "units_per_product": 2,
                "exposure_severity": "High",
                "affected_orders_count": 1
            }
        ],
        "affected_customer_orders": [
            {
                "order_id": "ORD-501",
                "customer": "Siemens Energy Automation",
                "product": "P-201",
                "order_qty": 120,
                "c101_required": 240,
                "order_value": 86400,
                "due_date": "2026-11-10",
                "days_until_due": 4,
                "priority": "Critical",
                "sla_penalty_risk": "High ($1,728/day penalty after Nov 10)"
            },
            {
                "order_id": "ORD-502",
                "customer": "Philips Medical Systems",
                "product": "P-202",
                "order_qty": 80,
                "c101_required": 80,
                "order_value": 68000,
                "due_date": "2026-11-12",
                "days_until_due": 6,
                "priority": "Critical",
                "sla_penalty_risk": "Severe (Hospital telemetry line disruption)"
            },
            {
                "order_id": "ORD-503",
                "customer": "Schneider Electric Smart Grid",
                "product": "P-203",
                "order_qty": 150,
                "c101_required": 150,
                "order_value": 72000,
                "due_date": "2026-11-14",
                "days_until_due": 8,
                "priority": "High",
                "sla_penalty_risk": "Moderate"
            },
            {
                "order_id": "ORD-504",
                "customer": "Tesla Energy Storage",
                "product": "P-204",
                "order_qty": 50,
                "c101_required": 100,
                "order_value": 27000,
                "due_date": "2026-11-18",
                "days_until_due": 12,
                "priority": "High",
                "sla_penalty_risk": "Low (Can be met if recovery option initiated within 48h)"
            }
        ],
        "financial_exposure": {
            "total_at_risk_revenue": 253400.00,
            "imminent_penalty_cost": 18500.00,
            "shortage_deficit_units": 320
        }
    }
