# YelpCamp 🏕️

YelpCamp is a full-stack web application that allows users to discover, share, and review the best camping spots from around the world. It features a modern design, interactive maps, and a seamless user experience.

## ✨ Features

- **Discover:** Browse a curated list of featured campgrounds.
- **Search:** Find specific campgrounds using the search bar.
- **Contribute:** Add your own campground suggestions with images and descriptions.
- **Review:** Share your experiences by leaving reviews and star ratings.
- **Manage:** Edit or delete your own campground submissions and reviews.
- **Maps:** View precise campground locations with integrated interactive maps.
- **Secure Auth:** User authentication powered by [Clerk](https://clerk.com/).

## 🛠️ Tech Stack

This project is built using the **[T3 Stack](https://create.t3.gg/)**:

- **Framework:** [Next.js](https://nextjs.org) (Pages Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **ORM:** [Prisma](https://prisma.io)
- **Styling:** [Tailwind CSS](https://tailwindcss.com)
- **API:** [tRPC](https://trpc.io)
- **Database:** MongoDB (via Prisma)
- **Auth:** [Clerk](https://clerk.com/)
- **Maps:** [Leaflet](https://leafletjs.org/)

## 🚀 Getting Started

### Prerequisites

- Node.js installed
- Pnpm or Npm
- A Clerk account for authentication
- A MongoDB database (e.g., MongoDB Atlas)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd t3-yelp-camp
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Set up environment variables:**
   Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
   Fill in your MongoDB connection string and Clerk API keys.

4. **Prepare the database:**
   ```bash
   npx prisma db push
   ```

5. **Start the development server:**
   ```bash
   pnpm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📄 License

This project is open-source and available under the MIT License.

