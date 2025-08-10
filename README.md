# Signalyze - AI-Powered Document Analysis 🚀

**Live Application:** [**https://signalyze.netlify.app**](https://signalyze.netlify.app)

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)

Signalyze is a full-stack web application designed to bring clarity and transparency to complex legal and contractual documents. Users can upload files like PDFs and DOCX, and our powerful AI backend analyzes the text to extract key information, identify potential risks, and summarize the content in an easy-to-understand format.

---
## Key Features

* **Secure User Authentication:** JWT-based authentication for user registration and login.
* **Document Upload & Management:** Upload PDF, DOCX, and image files. View all your documents in a clean dashboard.
* **AI-Powered Analysis:** Leverages Large Language Models (LLMs) to perform in-depth analysis of document text.
* **Structured Insights:** Extracts key financials, critical dates, user obligations, and potential risks into a structured, readable format.
* **Analysis Versioning:** Re-analyze documents and easily switch between different analysis versions.
* **Multi-Format Document Preview:** A dynamic viewer that can display PDFs and render DOCX files as readable HTML directly in the browser.

---
## Tech Stack

This project is built with a modern, scalable monorepo architecture, separating the frontend and backend for maintainability.

### **Frontend**
* **Framework:** Next.js 15+ (with App Router)
* **Language:** TypeScript
* **UI:** React 19, Tailwind CSS
* **State Management:** React Context
* **API Communication:** Axios

### **Backend**
* **Framework:** Express.js
* **Language:** TypeScript
* **Database:** MySQL (hosted on Aiven)
* **Authentication:** JSON Web Tokens (JWT)
* **File Handling:** Multer for uploads
* **AI Integration:** OpenAI API
* **Deployment:** Docker, AWS Elastic Beanstalk

---
## API Routes

All routes are prefixed with `/api/v1`. Routes marked as **Protected** require a valid JWT Bearer token in the `Authorization` header.

| Method | Route | Description | Protected |
| :--- | :--- | :--- | :--- |
| **Authentication** | | | |
| `POST` | `/auth/register` | Registers a new user. | No |
| `POST` | `/auth/login` | Logs in a user and returns a JWT. | No |
| **Documents** | | | |
| `POST` | `/documents/upload` | Uploads a new document. | Yes |
| `GET` | `/documents` | Gets a list of all documents for the logged-in user. | Yes |
| `GET` | `/documents/:documentId` | Gets details for a single document. | Yes |
| `DELETE`| `/documents/:documentId` | Deletes a document. | Yes |
| `GET` | `/documents/preview/:documentId`| Gets the raw file for previewing. | Yes |
| **Analysis** | | | |
| `POST` | `/analysis/documents/:id` | Triggers a new analysis for a document. | Yes |
| `GET` | `/analysis/documents/:id/versions` | Gets a list of all analysis versions for a document. | Yes |
| `GET` | `/analysis/documents/:id/versions/:version` | Gets the data for a specific analysis version. | Yes |

---
## Project Structure

The repository is a monorepo with two main packages:
* `/frontend`: Contains the Next.js client-side application.
* `/backend`: Contains the Express.js server-side API.

Each package has its own `package.json` and can be run independently.

---
## Local Setup and Installation

### **Prerequisites**
* Node.js (v18 or later)
* Docker Desktop (for running the backend)
* A local or cloud-based MySQL instance

### **Backend Setup**
1.  Navigate to the `backend` directory: `cd backend`
2.  Install dependencies: `npm install`
3.  Create a `.env` file and add your environment variables (database URI, JWT secret, OpenAI key, etc.).
4.  Start the development server: `npm run dev`

### **Frontend Setup**
1.  Navigate to the `frontend` directory: `cd frontend`
2.  Install dependencies: `npm install`
3.  Create a `.env.local` file and add the backend API URL:
    ```
    NEXT_PUBLIC_API_URL=http://localhost:5001/api/v1
    ```
4.  Start the development server: `npm run dev`

---
## Deployment

This application is designed for a professional split deployment:
* The **backend** is containerized with Docker (including LibreOffice for document conversion) and is deployed on **AWS Elastic Beanstalk**.
* The **frontend** is deployed on **Netlify** (or Vercel), which is optimized for Next.js applications.
* The **database** is a managed MySQL instance on **Aiven**.

---
## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue.

## License

This project is licensed under the MIT License.