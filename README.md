# Uni Kade - Monorepo

This is a monorepo containing both frontend and backend applications.

## Project Structure

```
.
├── frontend/          # React + Vite frontend application
├── backend/           # Express.js backend server
├── .gitignore         # Git ignore patterns for entire repo
└── README.md          # This file
```

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd uni-kade
```

2. Install dependencies for both frontend and backend:
```bash
cd frontend && npm install && cd ..
cd backend && npm install && cd ..
```

### Running the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Backend will run on `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Frontend will run on `http://localhost:5173`

## Available Scripts

### Frontend
- `npm run dev` - Start Vite dev server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

### Backend
- `npm run dev` - Start with nodemon (auto-reload on file changes)
- `npm start` - Start production server

## Folder Structure

### Frontend (`/frontend`)
- Generated with Vite + React
- Uses Tailwind CSS for styling
- React Router for navigation
- Axios for API calls
- Socket.io-client for real-time communication

### Backend (`/backend`)
- Express.js server
- MongoDB integration (Mongoose)
- Authentication (JWT, bcryptjs)
- File uploads (Multer + Cloudinary)
- Real-time communication (Socket.io)
- Email notifications (Nodemailer)

## Git Workflow

This is a monorepo, so both frontend and backend are in the same repository:

1. Create feature branches for your work:
```bash
git checkout -b feature/your-feature-name
```

2. Make changes in either frontend or backend folders

3. Stage and commit your changes:
```bash
git add .
git commit -m "feat: describe your changes"
```

4. Push to remote:
```bash
git push origin feature/your-feature-name
```

## Contributing

1. Make sure code follows the linting standards
2. Test your changes before pushing
3. Create a pull request with a clear description

## License

MIT
