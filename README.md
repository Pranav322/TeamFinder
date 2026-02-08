# TeamFinder

A modern, full-stack application designed to help developers and creators find the perfect teammates for their projects. Whether you're building a hackathon submission, a side project, or a startup, TeamFinder connects you with like-minded individuals.

## 🚀 Key Features

*   **Project Discovery:** Browse a curated list of projects looking for collaborators. Filter by tech stack and interests.
*   **Project Management:** Post your own projects with detailed descriptions, tech stacks, and roles needed.
*   **Real-time Collaboration:** Built-in chat functionality for seamless communication between project owners and applicants.
*   **Application System:** Request to join projects and manage incoming applications with an intuitive dashboard.
*   **User Profiles:** Showcase your skills, accepted projects, and contributions.
*   **Secure Authentication:** Robust user authentication powered by Firebase.
*   **Notifications:** Stay updated with real-time alerts for new applications and messages.

## 🛠️ Tech Stack

**Frontend:**
*   [Next.js 14](https://nextjs.org/) (App Router)
*   [React](https://react.dev/)
*   [Tailwind CSS](https://tailwindcss.com/)
*   [Framer Motion](https://www.framer.com/motion/) (Animations)
*   [Material UI](https://mui.com/) & [Lucide React](https://lucide.dev/) (Icons/Components)

**Backend:**
*   Next.js API Routes (Serverless functions)
*   [Prisma](https://www.prisma.io/) (ORM)
*   [PostgreSQL](https://www.postgresql.org/) (Database)

**Services:**
*   [Firebase Auth](https://firebase.google.com/docs/auth) (Authentication)
*   [Cloudinary](https://cloudinary.com/) (Image Storage)

## 📦 Getting Started

Follow these steps to set up the project locally.

### Prerequisites

*   Node.js 18+ installed
*   PostgreSQL database running locally or in the cloud (e.g., Supabase, Neon)
*   Firebase project set up
*   Cloudinary account

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/teamfinder.git
    cd teamfinder
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up Environment Variables:**
    Create a `.env` file in the root directory and add the following variables:

    ```env
    # Database (Prisma)
    DATABASE_URL="postgresql://user:password@localhost:5432/teamfinder?schema=public"

    # Firebase Authentication
    NEXT_PUBLIC_FIREBASE_API_KEY="your_api_key"
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your_project_id.firebaseapp.com"
    NEXT_PUBLIC_FIREBASE_PROJECT_ID="your_project_id"
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your_project_id.appspot.com"
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your_messaging_sender_id"
    NEXT_PUBLIC_FIREBASE_APP_ID="your_app_id"

    # Cloudinary (Image Uploads)
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your_cloud_name"
    NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET="your_upload_preset"
    ```

4.  **Database Migration:**
    Push the Prisma schema to your database:
    ```bash
    npx prisma migrate dev --name init
    ```

5.  **Run the development server:**
    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📂 Project Structure

```
├── app/                  # Next.js App Router pages and API routes
│   ├── api/              # Backend API endpoints (projects, chat, etc.)
│   ├── components/       # Reusable UI components
│   ├── contexts/         # React Contexts (AuthContext)
│   ├── chat/             # Chat interface pages
│   ├── profile/          # User profile pages
│   └── projects/         # Project listing and details pages
├── lib/                  # Utility functions and configurations (Firebase, Prisma, Cloudinary)
├── prisma/               # Database schema and migrations
└── public/               # Static assets
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the project
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

This project is licensed under the MIT License.
