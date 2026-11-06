export type RiskLevel = 'HIGH' | 'MEDIUM' | 'LOW';
export type ComponentStatus = 'CRITICAL_SHORTAGE' | 'LOW_STOCK' | 'NORMAL';
export type ShipmentStatus = 'Delayed' | 'In Transit' | 'Delivered' | 'Pending';
export type OrderStatus = 'At Risk' | 'Pending Allocation' | 'On Track' | 'Confirmed' | 'Delayed (+5 Days)' | 'Delayed (+1 Day)' | 'Received';
export type OrderPriority = 'Critical' | 'High' | 'Medium' | 'Low';

export interface Supplier {
  supplier_id: string;
  supplier_name: string;
  location: string;
  contact_email: string;
  reliability_score: number;
  average_lead_time: number;
  risk_status: RiskLevel;
  category: string;
  contract_ref: string;
  active_shipments_count: number;
  components_supplied: string[];
}

export interface Component {
  component_id: string;
  component_name: string;
  supplier_id: string;
  supplier_name: string;
  available_stock: number;
  reserved_stock: number;
  reorder_level: number;
  unit_cost: number;
  criticality: string;
  package_type: string;
  alternate_supplier_id?: string | null;
  warehouse_location: string;
  status: ComponentStatus;
}

export interface Product {
  product_id: string;
  product_name: string;
  category: string;
  unit_price: number;
  component_requirements: Record<string, number>;
  criticality: string;
  disruption_impact: string;
}

export interface Shipment {
  shipment_id: string;
  supplier_id: string;
  supplier_name: string;
  component_id: string;
  component_name: string;
  quantity: number;
  origin: string;
  destination: string;
  carrier: string;
  tracking_ref: string;
  expected_delivery: string;
  revised_delivery: string;
  delay_days: number;
  status: ShipmentStatus;
  delay_reason?: string | null;
  incident_id?: string | null;
  po_ref?: string | null;
}

export interface PurchaseOrder {
  po_id: string;
  supplier_id: string;
  supplier_name: string;
  component_id: string;
  component_name: string;
  quantity: number;
  unit_price: number;
  total_amount: number;
  order_date: string;
  due_date: string;
  revised_due_date: string;
  status: string;
  payment_terms: string;
  associated_shipment: string;
}

export interface CustomerOrder {
  order_id: string;
  customer_name: string;
  product_id: string;
  product_name: string;
  quantity: number;
  c101_required: number;
  order_value: number;
  due_date: string;
  priority: OrderPriority;
  status: OrderStatus;
  contract_sla_penalty: string;
  destination_facility: string;
}

export interface Incident {
  incident_id: string;
  supplier_id: string;
  supplier_name: string;
  component_id: string;
  component_name: string;
  shipment_id: string;
  po_ref: string;
  incident_type: string;
  delay_days: number;
  affected_quantity: number;
  severity: string;
  date_detected: string;
  status: string;
  description: string;
  operational_impact: string;
  root_cause: string;
}

export interface RiskFactor {
  name: string;
  key: string;
  weight: number;
  weight_percent: string;
  raw_value: number;
  contribution: number;
  rationale: string;
}

export interface RiskAnalysisResponse {
  disruption_assessment: {
    overall_score: number;
    max_score: number;
    classification: RiskLevel;
    badge_color: string;
    model_type: string;
    formula: string;
    factors: RiskFactor[];
    explanation: {
      what_happened: string;
      why_is_this_risky: string;
      entities_affected: string[];
      supporting_evidence: string[];
      suggested_actions: string[];
    };
  };
  network_summary: {
    overall_health_score: number;
    health_status: string;
    suppliers_by_risk: {
      high: number;
      medium: number;
      low: number;
      total: number;
    };
    shipments_by_status: {
      delayed: number;
      in_transit: number;
      delivered: number;
      pending: number;
      total: number;
    };
    inventory_by_status: {
      critical: number;
      low: number;
      normal: number;
      total: number;
    };
  };
  scenario_active: boolean;
}

export interface Citation {
  doc_id: string;
  title: string;
  type: string;
  category: string;
  date: string;
  relevance_excerpt: string;
}

export interface ChatResponse {
  query: string;
  answer: string;
  engine: string;
  is_llm: boolean;
  confidence: number;
  evidence_quality: string;
  citations: Citation[];
  suggested_followups: string[];
}

export interface RecoveryOption {
  id: string;
  title: string;
  strategy: string;
  action_description: string;
  time_to_resolve_hours: number;
  time_to_resolve_display: string;
  estimated_cost: number;
  feasibility: string;
  feasibility_score: number;
  operational_impact: string;
  supporting_evidence: string;
  assumptions_and_constraints: string;
  status: 'Recommended' | 'Available' | 'Under Review' | 'Approved' | 'Rejected';
  review_notes: string;
  is_recommended: boolean;
}

export interface ImpactTrace {
  incident_id: string;
  source_supplier: {
    id: string;
    name: string;
    location: string;
    incident: string;
  };
  affected_component: {
    id: string;
    name: string;
    delayed_shipment_qty: number;
    available_stock: number;
    reserved_stock: number;
    unreserved_stock: number;
    total_immediate_demand: number;
    net_shortage: number;
  };
  affected_products: Array<{
    product_id: string;
    product_name: string;
    units_per_product: number;
    exposure_severity: string;
    affected_orders_count: number;
  }>;
  affected_customer_orders: Array<{
    order_id: string;
    customer: string;
    product: string;
    order_qty: number;
    c101_required: number;
    order_value: number;
    due_date: string;
    days_until_due: number;
    priority: string;
    sla_penalty_risk: string;
  }>;
  financial_exposure: {
    total_at_risk_revenue: number;
    imminent_penalty_cost: number;
    shortage_deficit_units: number;
  };
}
