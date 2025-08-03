import { db } from "../config/db.config";
// import { analyzeDocumentWithOpenRouter } from "./ai.services";
import { analyzeDocumentWithOpenAI } from "./ai.services";
import { cleanText, getTextFromFile } from "./file.services";
import { diff } from "json-diff";

//  This is the function you already have, which creates a new analysis version.
export const getDocumentByIdAndAnalyze = async (id: number) => {
  const [[document]]: any = await db.query(
    "SELECT * FROM documents WHERE id = ?",
    [id]
  );

  if (!document) {
    throw new Error("Document not found");
  }

  const textFromFile = await getTextFromFile(document.filename);

  const analysisJson = await analyzeDocumentWithOpenAI(textFromFile);
  // const analysisJson = {
  //   document_summary: {
  //     title: "Arizona Residential Lease Agreements and Addenda",
  //     parties_involved: "Landlord and Tenant",
  //     main_purpose:
  //       "The document comprises multiple lease-related agreements, addenda, and policies outlining the rights, responsibilities, financial terms, rules, and procedures for tenants renting residential units in Arizona, including provisions for utilities, pet policies, modifications, default remedies, and community rules.",
  //   },
  //   key_financials: [
  //     {
  //       key: "securityDeposit",
  //       title: "Security Deposit",
  //       details:
  //         "Total refundable deposit of $ (amount varies per lease), due at signing; non-refundable deposit of $ (amount varies), also due at signing.",
  //     },
  //     {
  //       key: "monthlyRent",
  //       title: "Monthly Rent",
  //       details:
  //         "Specified in lease; includes base rent plus applicable taxes and additional charges such as animal rent, garage rent, storage, parking, etc. Due in advance, on or before the 1st of each month.",
  //     },
  //     {
  //       key: "lateFee",
  //       title: "Late Fee",
  //       details:
  //         "Up to $50 or a percentage of rent (percentage varies), charged if rent is not paid by the 3rd or 4th day of the month, depending on lease terms.",
  //     },
  //     {
  //       key: "concessionOrDiscount",
  //       title: "Concession/Discount",
  //       details:
  //         "One-time or monthly rent concessions specified in lease/addenda; e.g., a one-time credit or monthly discount, with conditions for repayment if early termination occurs.",
  //     },
  //     {
  //       key: "buyOutFee",
  //       title: "Lease Buy-Out Fee",
  //       details:
  //         "Fee of two months' rent (amount varies), payable in certified funds, for early lease termination.",
  //     },
  //     {
  //       key: "parkingFee",
  //       title: "Parking Fee",
  //       details:
  //         "One-time fee or monthly fee (amount varies), payable per vehicle, with conditions for delinquency and towing.",
  //     },
  //     {
  //       key: "utilitiesCharges",
  //       title: "Utilities Charges",
  //       details:
  //         "Charges for water, sewer, gas, electric, trash, cable, internet, pest control, etc., either billed directly or allocated via formulas; late fees apply for overdue bills.",
  //     },
  //   ],
  //   contract_lifecycle: {
  //     effective_date: "Specified in lease (e.g., '2024-07-10')",
  //     term_length: "Typically specified as months or 'month-to-month' renewal",
  //     is_auto_renewal: true,
  //     renewal_terms:
  //       "Automatically renews month-to-month unless either party provides at least 30 days' written notice of termination",
  //     termination_notice_period:
  //       "30 days (or specified in lease) prior to intended move-out date",
  //   },
  //   rights_and_obligations: {
  //     user_responsibilities: [
  //       "Pay rent and utilities timely.",
  //       "Maintain cleanliness and avoid damages.",
  //       "Allow access for inspections, repairs, and pest control.",
  //       "Comply with community rules and policies.",
  //       "Notify landlord of damages, leaks, or infestations.",
  //       "Remove personal property upon move-out.",
  //     ],
  //     provider_responsibilities: [
  //       "Maintain common areas and fixtures with reasonable diligence.",
  //       "Respond to repair requests within specified timeframes.",
  //       "Provide necessary notices for entry and community rules.",
  //       "Handle pest control, repairs, and community amenities.",
  //     ],
  //   },
  //   major_restrictions_on_user: [
  //     "No subletting or short-term rentals without prior written approval.",
  //     "No pets unless authorized; unauthorized animals may incur fees or eviction.",
  //     "No smoking inside buildings; designated outside areas only.",
  //     "No illegal activities or criminal conduct on premises.",
  //     "No alterations or repairs without landlord approval.",
  //     "No disruptive conduct or prohibited activities in common areas.",
  //     "No tampering with utilities or security devices.",
  //   ],
  //   data_and_privacy: {
  //     data_usage_policy:
  //       "Not explicitly mentioned; implied that personal data may be collected for lease administration, notices, and community management.",
  //   },
  //   dispute_resolution: {
  //     governing_law: "State of Arizona",
  //     dispute_method:
  //       "Binding arbitration under the Federal Arbitration Act; claims may also be filed in small claims court or through legal proceedings as permitted by law.",
  //   },
  //   potential_traps_and_risks: [
  //     {
  //       key: "auto_renewal",
  //       title: "Automatic Renewal and Notice Requirements",
  //       details:
  //         "Lease automatically renews month-to-month unless 30 days' written notice is given. Failure to provide proper notice may result in continued obligations or penalties.",
  //     },
  //     {
  //       key: "earlyTerminationFees",
  //       title: "Early Lease Termination Penalties",
  //       details:
  //         "Buy-out fees or repayment of concessions if lease is terminated early, potentially substantial and payable in certified funds, with strict conditions.",
  //     },
  //     {
  //       key: "utility_and_late_fees",
  //       title: "Late Payment and Utility Default Risks",
  //       details:
  //         "Late fees up to $50 or a percentage; utility bills overdue may lead to late charges, disconnection, or eviction proceedings.",
  //     },
  //     {
  //       key: "pet_and_animal_charges",
  //       title: "Unauthorized Animals and Animal-Related Fees",
  //       details:
  //         "Unauthorized animals may incur fees, damages, or eviction; support animals may be exempt from deposits but still subject to rules.",
  //     },
  //     {
  //       key: "dispute_resolution_clauses",
  //       title: "Mandatory Arbitration and Class Waiver",
  //       details:
  //         "Claims are subject to binding arbitration, waiving rights to class actions; may limit legal recourse and expose tenants to binding, non-judicial resolution.",
  //     },
  //     {
  //       key: "delays_and_default",
  //       title: "Delays in Occupancy and Default Remedies",
  //       details:
  //         "Delays due to construction or repairs may extend move-in dates; default remedies include eviction, acceleration of rent, and damages.",
  //     },
  //     {
  //       key: "damage_and_cleaning_charges",
  //       title: "Move-Out Charges and Damage Assessments",
  //       details:
  //         "Estimated charges for cleaning, repairs, and replacements (e.g., oven $15-$50, carpet $45+), which may exceed estimates depending on actual damages.",
  //     },
  //   ],
  // };

  // // This stored procedure saves the new analysis and increments the version.
  const [result]: any = await db.execute("CALL SaveAnalysis(?, ?)", [
    id,
    JSON.stringify(analysisJson),
  ]);

  const newAnalysis = result[0];
  // // The JSON is stored as a string, so parse it before returning.
  newAnalysis.analysis_json = JSON.parse(newAnalysis.analysis_json);

  
  return newAnalysis;
};

export const handleGetAllAnalysisForDocument = async (documentId: number) => {
  const [rows]: any = await db.query(
    "SELECT id, document_id, version, created_at FROM analysis WHERE document_id = ? ORDER BY version DESC",
    [documentId]
  );

  if (rows.length === 0) {
    return []; // Return an empty array if no analysis exist yet.
  }

  return rows;
};

/**
 * Retrieves a single, specific version of an analysis for a document.
 */
export const handleGetAnalysisByVersion = async (
  documentId: number,
  version: number
) => {
  const [[analysis]]: any = await db.query(
    "SELECT * FROM analysis WHERE document_id = ? AND version = ?",
    [documentId, version]
  );

  if (!analysis) {
    throw new Error(
      `Analysis version ${version} for document ${documentId} not found.`
    );
  }

  // The database stores the JSON as a string, so we need to parse it
  // before sending it back to the controller.
  analysis.analysis_json = JSON.parse(analysis.analysis_json);

  return analysis;
};

/**
 * Fetches two versions of an analysis and computes the difference between them.
 */
export const handleCompareAnalysis = async (
  documentId: number,
  baseVersion: number,
  compareVersion: number
) => {
  if (baseVersion === compareVersion) {
    throw new Error("Cannot compare a version with itself.");
  }

  console.log(
    `Comparing document ${documentId}: version ${baseVersion} vs ${compareVersion}`
  );

  // Reuse our existing function to get each version's data.
  const baseAnalysis = await handleGetAnalysisByVersion(
    documentId,
    baseVersion
  );
  const compareAnalysis = await handleGetAnalysisByVersion(
    documentId,
    compareVersion
  );

  // Use the json-diff library to find the differences.
  // The `true` flag returns a more detailed diff object.
  const differences = diff(
    baseAnalysis.analysis_json,
    compareAnalysis.analysis_json,
    { full: true }
  );

  return {
    base: {
      version: baseAnalysis.version,
      createdAt: baseAnalysis.created_at,
    },
    compare: {
      version: compareAnalysis.version,
      createdAt: compareAnalysis.created_at,
    },
    // The `differences` object will be undefined if there are no changes.
    differences: differences || "No differences found.",
  };
};
