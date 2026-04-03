# FeedPulse — AI-Powered Product Feedback Platform

FeedPulse is a professional internal tool designed to collect, analyze, and manage product feedback. By leveraging **Google Gemini AI**, FeedPulse automatically categorizes, prioritizes, and summarizes user feedback, providing product teams with instant clarity on what to build next.

---

## ✨ Core Features

### 📝 Smart Feedback Submission (Requirement 1)
- **Public Interface**: A clean, accessible page for users to submit feedback.
- **Real-time Validation**: Ensures quality input with a 20-character minimum description and a live character counter.
- **Categorization**: Users can tag feedback as *Bug*, *Feature Request*, *Improvement*, or *Other*.
- **Rate Limiting**: Backend security to prevent spam (max 5 submissions per hour per IP).

### 🤖 Gemini AI Analysis (Requirement 2)
- **Automated Processing**: Every submission is instantly analyzed by Gemini 1.5 Flash.
- **Sentiment & Priority**: AI detects user sentiment (Positive/Neutral/Negative) and assigns a priority score (1–10).
- **Core Summary**: AI generates a concise one-sentence wrap-up of the user's core need.
- **Smart Tagging**: Automatically extracts keywords (e.g., #UI, #Performance).

### 📊 Admin Dashboard (Requirement 3)
- **Protected Access**: Secure login for authorized admins.
- **Executive Overview**: A Stats Bar showing total feedback, open items, and average priority.
- **Management Tools**: Advanced **Search, Sort, and Filtering** (by Category and Status).
- **Status Workflow**: Tracks feedback through the lifecycle: *New* → *In Review* → *Resolved*.
- **Manual AI Re-trigger**: Ability to ask the AI to re-analyze any specific item.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | Next.js 15 (App Router), React, Tailwind CSS, Lucide Icons |
| **Backend** | Node.js, Express, TypeScript |
| **AI Engine** | Google Gemini 1.5 Flash (via Google AI Studio) |
| **Database** | MongoDB (via Mongoose) |
| **Authentication**| JWT (JSON Web Tokens) |

---

## ⚙️ Local Setup Instructions

### 1. Prerequisites
- **Node.js**: v18 or higher.
- **MongoDB**: A local instance running or a MongoDB Atlas URI.
- **Google AI Studio Key**: Generate a free API key at [aistudio.google.com](https://aistudio.google.com/).

### 2. Clone and Install
```bash
git clone https://github.com/YOUR_USERNAME/feed-pulse.git
cd feed-pulse
```

### 3. Backend Configuration
1. Navigate to `backend/`.
2. Install dependencies: `npm install`.
3. Create a `.env` file with the following:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/feedpulse
   JWT_SECRET=your_jwt_secret_here
   GEMINI_API_KEY=your_gemini_api_key_here
   ADMIN_EMAIL=admin@gmail.com
   ADMIN_PASSWORD=admin123
   ```
4. Start the server: `npm run dev`.

### 4. Frontend Configuration
1. Navigate to `frontend/`.
2. Install dependencies: `npm install`.
3. Start the dev server: `npm run dev` (it will run on [http://localhost:3001](http://localhost:3001)).

---

## 🐳 Docker Setup (Recommended)

The easiest way to run FeedPulse is using Docker Compose.

### 1. Prerequisites
- [Docker](https://docs.docker.com/get-docker/) installed.
- [Docker Compose](https://docs.docker.com/compose/install/) installed.

### 2. Run with One Command
1. From the project root, run:
   ```bash
   # Set your Gemini API Key first
   $env:GEMINI_API_KEY="your_key_here" # Windows PowerShell
   # Or for Linux/Mac: export GEMINI_API_KEY="your_key_here"

   docker-compose up --build
   ```
2. The application will be available at:
   - **Frontend**: [http://localhost:3000](http://localhost:3000)
   - **Backend API**: [http://localhost:4000/api](http://localhost:4000/api)

   Docker Compose runs all services (frontend, backend, and MongoDB) in isolated containers while exposing only the required ports.

---

## 📸 Screenshots

### 🌍 Landing Page
*Capture a screenshot of your landing page and place it in a `/screenshots` folder.*
![Landing Page](/screenshots/landing.png)



### 📊 Admin Dashboard
*Capture a screenshot of your dashboard showing stats and feedback cards.*
![Dashboard](/screenshots/dashboard.png)

---

## 🔮 What's Next? (Requirement 6.6)

Given more time, I would focus on the following engineering improvements:
1. **Automated Testing**: Implementing **Jest** unit tests for the core AI service and API endpoints.
3. **Enhanced Security**: Moving admin credentials from environment variables to a dedicated, encrypted **User collection** in the database.
4. **Data Visualization**: Adding interactive charts (e.g., Recharts) to track sentiment trends over time graphically.

---

## 📄 License
This project is part of a Software Engineer Intern Assignment. Licensed under the MIT License.
