import { AxiosResponse } from "axios";

export interface Document {
  id: number;
  user_id: string;
  filename: string;
  original_filename: string;
  filepath: string;
  size: number;
  type: string;
  uploaded_at: string;
  deleted: boolean;
  latest_version: number | null;
}

export interface AnalysisVersion {
  id: number;
  document_id: number;
  version: number;
  created_at: string;
}

export interface AnalysisData {
  document_summary: {
    title: string;
    parties_involved: string;
    main_purpose: string;
  };
  key_financials: Array<{
    key: string;
    title: string;
    details: string;
  }>;
  contract_lifecycle: {
    effective_date: string;
    term_length: string;
    is_auto_renewal: boolean;
    renewal_terms: string;
    termination_notice_period: string;
  };
  rights_and_obligations: {
    user_responsibilities: string[];
    provider_responsibilities: string[];
  };
  major_restrictions_on_user: string[];
  data_and_privacy: {
    data_usage_policy: string;
  };
  dispute_resolution: {
    governing_law: string;
    dispute_method: string;
  };
  potential_traps_and_risks: Array<{
    key: string;
    title: string;
    details: string;
  }>;
}

export interface Analysis extends AnalysisVersion {
  analysis_json: AnalysisData;
}

export interface SingleDocumentResponse {
  success: boolean;
  message: string;
  data: Document[];
}

export interface AllDocumentsResponse {
  success: boolean;
  message: string;
  data: Document[];
}

export interface AnalysisResponse {
  success: boolean;
  analysis: Analysis;
}

export interface AnalysisVersionsResponse {
  success: boolean;
  analysis: AnalysisVersion[];
}

export interface UploadResponse extends AxiosResponse {
  success: boolean;
  message: string;

  data: Document;
}
