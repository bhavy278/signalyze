import { AxiosResponse } from "axios";

/**
 * Represents the structure of a single document record in the database.
 */
export interface Document {
  id: number;
  user_id: string;
  filename: string;
  original_filename: string;
  filepath: string;
  size: number;
  type: string;
  uploaded_at: string; // ISO date string
  deleted: boolean;
}

/**
 * Represents a single version of an analysis, primarily for listing.
 */
export interface AnalysisVersion {
  id: number;
  document_id: number;
  version: number;
  created_at: string; // ISO date string
}

/**
 * The detailed JSON structure returned by the OpenAI analysis.
 * This should match the JSON schema in your backend prompt.
 */
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

/**
 * Represents a full analysis record, including the parsed JSON data.
 */
export interface Analysis extends AnalysisVersion {
  analysis_json: AnalysisData;
}

// --- API Service Response Types ---

/**
 * The expected response structure when fetching a single document.
 * Note: Your backend sends the document inside an array `data: [doc]`.
 */
export interface SingleDocumentResponse {
  success: boolean;
  message: string;
  data: Document[];
}

/**
 * The expected response structure when fetching all documents for a user.
 */
export interface AllDocumentsResponse {
  success: boolean;
  message: string;
  data: Document[];
}

/**
 * The expected response structure when fetching a single, full analysis.
 */
export interface AnalysisResponse {
  success: boolean;
  analysis: Analysis;
}

/**

 * The expected response structure when fetching the list of all analysis versions for a document.
 */
export interface AnalysisVersionsResponse {
  success: boolean;
  analysis: AnalysisVersion[];
}

/**
 * The expected response structure after successfully uploading a document.
 * The data object represents the document information before it has a database ID.
 */
export interface UploadResponse extends AxiosResponse {
  success: boolean;
  message: string;
  // data: Omit<Document, "id">;
  data: Document;
}
