export interface Contact {
    id: number;
    first_name: string;
    last_name: string;
    full_name: string;
    email: string | null;
    phone: string | null;
    job_title: string | null;
    notes: string | null;
    status: 'active' | 'inactive' | 'lead';
    companies?: Company[];
    deals?: Deal[];
    activities?: Activity[];
    deals_count?: number;
    created_at: string;
    updated_at: string;
}

export interface Company {
    id: number;
    name: string;
    email: string | null;
    phone: string | null;
    website: string | null;
    industry: string | null;
    address: string | null;
    notes: string | null;
    contacts?: Contact[];
    deals?: Deal[];
    activities?: Activity[];
    contacts_count?: number;
    created_at: string;
    updated_at: string;
}

export interface Deal {
    id: number;
    title: string;
    description: string | null;
    value: number | null;
    value_formatted: string | null;
    stage: DealStage;
    stage_label: string;
    probability: number;
    weighted_value: number;
    expected_close_date: string | null;
    actual_close_date: string | null;
    notes: string | null;
    is_open: boolean;
    is_closed: boolean;
    contact?: Contact | null;
    company?: Company | null;
    activities?: Activity[];
    created_at: string;
    updated_at: string;
}

export type DealStage = 'lead' | 'qualified' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';

export interface DealStages {
    [key: string]: string;
}

export interface Activity {
    id: number;
    type: ActivityType;
    type_label: string;
    subject: string;
    description: string | null;
    scheduled_at: string | null;
    completed_at: string | null;
    status: 'pending' | 'completed' | 'cancelled';
    is_overdue: boolean;
    activityable_type: 'Contact' | 'Company' | 'Deal';
    activityable_id: number;
    activityable?: Contact | Company | Deal;
    created_at: string;
    updated_at: string;
}

export type ActivityType = 'call' | 'email' | 'meeting' | 'task' | 'note';

export interface ActivityTypes {
    [key: string]: string;
}

export interface PipelineStage {
    label: string;
    deals: Deal[];
    total_value: number;
}

export interface Pipeline {
    [key: string]: PipelineStage;
}

export interface CrmStatistics {
    total_leads: number;
    open_deals: number;
    pipeline_value: number;
    weighted_value: number;
    won_this_month: number;
}

export interface PaginatedData<T> {
    data: T[];
    links: {
        first: string | null;
        last: string | null;
        prev: string | null;
        next: string | null;
    };
    meta: {
        current_page: number;
        from: number | null;
        last_page: number;
        path: string;
        per_page: number;
        to: number | null;
        total: number;
    };
}
