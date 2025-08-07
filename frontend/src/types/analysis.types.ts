export interface KeyFinancial {
  key: string;
  title: string;
  details: string;
}
export interface RiskItem {
  key: string;
  title: string;
  details: string;
}
interface AnalysisData {
  key_financials: KeyFinancial[];
  data_and_privacy: {
    data_usage_policy: string;
  };
  document_summary: {
    title: string;
    main_purpose: string;
    parties_involved: string;
  };
  contract_lifecycle: {
    term_length: string;
    renewal_terms: string;
    effective_date: string;
    is_auto_renewal: boolean;
    termination_notice_period: string;
  };
  dispute_resolution: {
    governing_law: string;
    dispute_method: string;
  };
  rights_and_obligations: {
    user_responsibilities: string[];
    provider_responsibilities: string[];
  };
  potential_traps_and_risks: RiskItem[];
  major_restrictions_on_user: string[];
}

interface Analysis {
  id: number;
  document_id: number;
  version: number;
  analysis_json: AnalysisData;
  created_at: string;
}

export interface SingleAnalysisResponse {
  success: boolean;
  analysis: Analysis[];
}

export interface AnalysisVersion {
  id: number;
  document_id: number;
  version: number;
  created_at: string;
}

export interface AllAnalysesResponse {
  success: boolean;
  analysis: AnalysisVersion[];
}
