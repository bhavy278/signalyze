"use client";

import { KeyFinancial, RiskItem } from "@/types/analysis.types";
import { AnalysisData } from "@/types/document.types";

import {
  Landmark,
  FileText,
  Calendar,
  ShieldAlert,
  Gavel,
  ListChecks,
  Lock,
  Ban,
} from "lucide-react";
import React from "react";

// Helper Component: Badge for boolean values
const Badge = ({
  variant,
  children,
}: {
  variant: "success" | "destructive";
  children: React.ReactNode;
}) => {
  const baseStyles = "px-2.5 py-0.5 text-xs font-semibold rounded-full";
  const variantStyles = {
    success: "bg-green-100 text-green-800",
    destructive: "bg-red-100 text-red-800",
  };
  return (
    <span className={`${baseStyles} ${variantStyles[variant]}`}>
      {children}
    </span>
  );
};

// --- FIX IS HERE ---
// Helper Component: A single labeled item, now updated to accept children
const InfoItem = ({
  label,
  value,
  children, // 1. Accept 'children' as a prop
  isList = false,
}: {
  label: string;
  value?: string | string[]; // 2. Make 'value' optional
  children?: React.ReactNode;
  isList?: boolean;
}) => (
  <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
    <dt className="text-sm font-semibold text-gray-600">{label}</dt>
    <dd className="mt-1 text-sm text-gray-800 sm:mt-0 sm:col-span-2">
      {/* 3. Render children if they exist, otherwise fall back to the value prop */}
      {children ? (
        children
      ) : isList && Array.isArray(value) ? (
        <ul className="list-disc space-y-1 pl-5">
          {value.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      ) : (
        value
      )}
    </dd>
  </div>
);

// Main Component to display the entire analysis
export const AnalysisViewer = ({ analysis }: { analysis: AnalysisData }) => {
  if (!analysis) {
    return (
      <div className="text-center py-10">
        <p>No analysis data to display.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* --- Document Summary --- */}
      <AnalysisSection
        title="Document Summary"
        icon={<FileText className="text-blue-600" />}
      >
        <InfoItem label="Title" value={analysis.document_summary.title} />
        <InfoItem
          label="Parties Involved"
          value={analysis.document_summary.parties_involved}
        />
        <InfoItem
          label="Main Purpose"
          value={analysis.document_summary.main_purpose}
        />
      </AnalysisSection>

      {/* --- Potential Traps & Risks --- */}
      <AnalysisSection
        title="Potential Traps & Risks"
        icon={<ShieldAlert className="text-red-600" />}
      >
        {analysis.potential_traps_and_risks.map((item: RiskItem) => (
          <InfoItem key={item.key} label={item.title} value={item.details} />
        ))}
      </AnalysisSection>

      {/* --- Key Financials --- */}
      <AnalysisSection
        title="Key Financials"
        icon={<Landmark className="text-green-600" />}
      >
        {analysis.key_financials.map((item: KeyFinancial) => (
          <InfoItem key={item.key} label={item.title} value={item.details} />
        ))}
      </AnalysisSection>

      {/* --- Contract Lifecycle --- */}
      <AnalysisSection
        title="Contract Lifecycle"
        icon={<Calendar className="text-purple-600" />}
      >
        <InfoItem
          label="Effective Date"
          value={analysis.contract_lifecycle.effective_date}
        />
        <InfoItem
          label="Term Length"
          value={analysis.contract_lifecycle.term_length}
        />
        {/* This now works correctly */}
        <InfoItem label="Auto-Renewal">
          <Badge
            variant={
              analysis.contract_lifecycle.is_auto_renewal
                ? "success"
                : "destructive"
            }
          >
            {analysis.contract_lifecycle.is_auto_renewal ? "Yes" : "No"}
          </Badge>
        </InfoItem>
        <InfoItem
          label="Renewal Terms"
          value={analysis.contract_lifecycle.renewal_terms}
        />
        <InfoItem
          label="Termination Notice"
          value={analysis.contract_lifecycle.termination_notice_period}
        />
      </AnalysisSection>

      {/* --- Rights & Obligations --- */}
      <AnalysisSection
        title="Rights & Obligations"
        icon={<ListChecks className="text-indigo-600" />}
      >
        <InfoItem
          label="User Responsibilities"
          value={analysis.rights_and_obligations.user_responsibilities}
          isList
        />
        <InfoItem
          label="Provider Responsibilities"
          value={analysis.rights_and_obligations.provider_responsibilities}
          isList
        />
      </AnalysisSection>

      {/* --- Major Restrictions --- */}
      <AnalysisSection
        title="Major Restrictions on User"
        icon={<Ban className="text-orange-600" />}
      >
        <InfoItem
          label="Prohibited Actions"
          value={analysis.major_restrictions_on_user}
          isList
        />
      </AnalysisSection>

      {/* --- Dispute Resolution --- */}
      <AnalysisSection
        title="Dispute Resolution"
        icon={<Gavel className="text-yellow-600" />}
      >
        <InfoItem
          label="Governing Law"
          value={analysis.dispute_resolution.governing_law}
        />
        <InfoItem
          label="Dispute Method"
          value={analysis.dispute_resolution.dispute_method}
        />
      </AnalysisSection>

      {/* --- Data & Privacy --- */}
      <AnalysisSection
        title="Data & Privacy"
        icon={<Lock className="text-gray-600" />}
      >
        <InfoItem
          label="Data Usage Policy"
          value={analysis.data_and_privacy.data_usage_policy}
        />
      </AnalysisSection>
    </div>
  );
};

// The AnalysisSection helper component remains the same
const AnalysisSection = ({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) => (
  <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
    <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
      <h3 className="text-lg leading-6 font-bold text-gray-800 flex items-center">
        {icon}
        <span className="ml-3">{title}</span>
      </h3>
    </div>
    <div className="px-4 divide-y divide-gray-200">{children}</div>
  </div>
);
