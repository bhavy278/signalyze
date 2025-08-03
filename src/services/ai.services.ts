// File: services/openai.services.ts

import OpenAI from "openai";

// Initialize the OpenAI client. It will automatically read the
// OPENAI_API_KEY from your .env file.
const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_KEY,
});

/**
 * Constructs the detailed prompt for the AI model to analyze a legal/contractual document.
 * @param documentText The full text content of the document.
 * @returns The fully constructed prompt string.
 */
const getAnalysisPrompt = (documentText: string): string => {
  return `
    Your task is to act as an expert legal analyst. Meticulously analyze the following document text, which could be a lease, a contract, or a terms of service agreement. Your goal is to extract all critical information and present it in a structured format.

    Your response MUST be a single, valid JSON object. Do not include any introductory text, explanations, or markdown formatting like \`\`\`json before or after the JSON object.

    The JSON object must strictly adhere to the structure and data types defined below. If information for a specific field is not found in the document, use a default value such as "Not Mentioned" for strings, false for booleans, or an empty array [] for lists.

    Here is the required JSON structure and detailed instructions for each field:
    ---
    {
      "document_summary": {
        "title": "A concise, neutral title for the document (e.g., 'Residential Lease Agreement', 'Software Terms of Service').",
        "parties_involved": "Identify the primary parties (e.g., 'Landlord and Tenant', 'Service Provider and User').",
        "main_purpose": "A brief, one-paragraph summary of the document's core purpose."
      },
      "key_financials": [
        {
          "key": "string (camelCase identifier, e.g., 'monthlyRent')",
          "title": "string (Human-readable title, e.g., 'Monthly Rent')",
          "details": "string (The extracted value and any relevant context, e.g., '$2,200 USD due on the 1st of each month')"
        }
      ],
      "contract_lifecycle": {
        "effective_date": "string (e.g., '2025-09-01' or 'Upon signing')",
        "term_length": "string (e.g., '12 months', 'Month-to-month')",
        "is_auto_renewal": "boolean (true if the contract auto-renews, false otherwise)",
        "renewal_terms": "string (Quote or summarize the auto-renewal clause, or state 'No auto-renewal clause found.')",
        "termination_notice_period": "string (The amount of advance notice required to terminate, e.g., '30 days written notice')"
      },
      "rights_and_obligations": {
        "user_responsibilities": [
          "string (A list of the user's/tenant's primary duties, e.g., 'Responsible for all utility payments.')"
        ],
        "provider_responsibilities": [
          "string (A list of the provider's/landlord's primary duties, e.g., 'Responsible for structural repairs and appliance maintenance.')"
        ]
      },
      "major_restrictions_on_user": [
        "string (A list of things the user is explicitly prohibited from doing, e.g., 'No pets are allowed on the premises.', 'Subletting is forbidden without written consent.')"
      ],
      "data_and_privacy": {
        "data_usage_policy": "string (Summarize how the user's data is collected, used, and shared. State 'Not mentioned' if not applicable.)"
      },
      "dispute_resolution": {
        "governing_law": "string (The state or country whose laws govern the contract, e.g., 'State of California, USA')",
        "dispute_method": "string (The required method for resolving disputes, e.g., 'Binding Arbitration in Tempe, Arizona', 'Litigation in the appropriate court')"
      },
      "potential_traps_and_risks": [
        {
          "key": "string (camelCase identifier, e.g., 'earlyTerminationPenalty')",
          "title": "string (A clear title for the risk, e.g., 'Early Termination Penalty')",
          "details": "string (Explain the clause and why it's a potential risk for the user. Focus on ambiguous language, hidden fees, or strict penalties.)"
        }
      ]
    }
    ---

    Here is the document text to analyze:
    ---
    ${documentText}
    ---
  `;
};
/**
 * Analyzes document text using the gpt-4.1-nano model.
 * @param documentText The plain text extracted from the user's document.
 * @returns A promise that resolves to the parsed JSON object from the AI.
 */
export const analyzeDocumentWithOpenAI = async (documentText: string) => {
  console.log("Sending request to OpenAI with gpt-4.1-nano...");

  try {
    const prompt = getAnalysisPrompt(documentText);

    const response = await openai.chat.completions.create({
      model: "gpt-4.1-nano",
      messages: [{ role: "user", content: prompt }],
      // Use a low temperature for factual, deterministic output
      temperature: 0.2,
      // This is a crucial feature that forces the model to return valid JSON
      response_format: { type: "json_object" },
    });

    const resultText = response.choices[0].message.content;

    if (!resultText) {
      throw new Error("OpenAI returned an empty response.");
    }

    // The response should be a valid JSON string, so we parse it.
    return JSON.parse(resultText);

  } catch (error: any) {
    console.error("Error calling OpenAI API:", error);
    // Re-throw the error so the controller can handle it
    throw new Error("Failed to get analysis from OpenAI.");
  }
};