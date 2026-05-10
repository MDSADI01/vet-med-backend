# Vet Clinic Backend API

A production-ready backend for a veterinary clinic management system built with Node.js, Express, TypeScript, PostgreSQL, and Prisma ORM.

## Features

- **Authentication**: Session-based authentication with HttpOnly cookies (no JWT)
- **Role-Based Access Control**: USER, DOCTOR, and ADMIN roles
- **Animal Management**: CRUD operations for patient animals
- **Doctor Profiles**: Doctor profiles with availability scheduling
- **Appointment Booking**: Conflict prevention, status flow (PENDING → CONFIRMED → COMPLETED/CANCELLED)
- **Medical Records**: Post-appointment medical record creation
- **Input Validation**: Zod schemas for all inputs
- **Global Error Handling**: Comprehensive error handling including Prisma errors
- **Pagination**: Paginated list endpoints

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Validation**: Zod
- **Authentication**: Session-based with bcrypt

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd vet-med-backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your database credentials:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/vet_clinic_db?schema=public"
PORT=8000
NODE_ENV=development
FRONTEND_URL="http://localhost:3000"
```

4. Generate Prisma client:
```bash
npx prisma generate
```

5. Run database migrations:
```bash
npx prisma migrate dev --name init
```

6. Start the development server:
```bash
npm run dev
```

The server will start on `http://localhost:8000`

## API Endpoints

### Authentication (`/api/auth`)

- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Users (`/api/users`) - Admin only

- `GET /api/users` - List all users (paginated)
- `GET /api/users/:id` - Get user by ID
- `PATCH /api/users/:id/role` - Update user role

### Animals (`/api/animals`) - Authenticated

- `GET /api/animals` - List user's animals (paginated)
- `GET /api/animals/:id` - Get animal by ID
- `POST /api/animals` - Create new animal
- `PUT /api/animals/:id` - Update animal
- `DELETE /api/animals/:id` - Delete animal

### Doctors (`/api/doctors`)

- `GET /api/doctors` - List all doctors (paginated)
- `GET /api/doctors/:id` - Get doctor profile by ID
- `GET /api/doctors/my/profile` - Get own doctor profile (Doctor only)
- `POST /api/doctors/my/profile` - Create doctor profile (Doctor only)
- `PUT /api/doctors/my/profile/:id` - Update doctor profile (Doctor only)
- `POST /api/doctors/:doctorId/availability` - Add availability (Doctor/Admin)
- `PUT /api/doctors/:doctorId/availability/:id` - Update availability (Doctor/Admin)
- `DELETE /api/doctors/:doctorId/availability/:id` - Delete availability (Doctor/Admin)

### Appointments (`/api/appointments`) - Authenticated

- `GET /api/appointments` - List appointments (filtered by role, paginated)
- `GET /api/appointments/:id` - Get appointment by ID
- `POST /api/appointments` - Create appointment (User/Admin)
- `PUT /api/appointments/:id` - Update appointment
- `PATCH /api/appointments/:id/cancel` - Cancel appointment

### Medical Records (`/api/medical-records`) - Authenticated

- `GET /api/medical-records` - List medical records (filtered by role, paginated)
- `GET /api/medical-records/:id` - Get medical record by ID
- `POST /api/medical-records` - Create medical record (Doctor/Admin)
- `PUT /api/medical-records/:id` - Update medical record

## Database Schema

### Models

- **User**: User accounts with roles (USER, DOCTOR, ADMIN)
- **Session**: Session storage for authentication
- **Animal**: Patient animals owned by users
- **DoctorProfile**: Doctor profiles with specialty and credentials
- **DoctorAvailability**: Doctor availability schedule
- **Appointment**: Appointment bookings with status flow
- **MedicalRecord**: Medical records linked to appointments

## Error Handling

The API includes comprehensive error handling for:

- Application errors (404, 409, 400, etc.)
- Prisma database errors (P2002, P2025, etc.)
- Validation errors (Zod)
- Unexpected errors (500)

Error responses include:
```json
{
  "error": "Error message",
  "prismaCode": "P2002",  // In development for Prisma errors
  "meta": { ... }          // In development
}
```

## Appointment Conflict Prevention

The system prevents overlapping appointments by:
1. Checking doctor availability schedule
2. Validating against existing appointments
3. Ensuring no time slot conflicts

## Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm start` - Start production server
- `npx prisma generate` - Regenerate Prisma client
- `npx prisma migrate dev` - Create and run migrations
- `npx prisma studio` - Open Prisma Studio

### Project Structure

```
src/
├── app/
│   └── app.ts              # Express app setup
├── generated/
│   └── prisma/             # Generated Prisma client
├── lib/
│   └── prisma.ts           # Prisma client instance
├── middleware/
│   ├── auth.middleware.ts  # Authentication & authorization
│   ├── error.middleware.ts # Global error handler
│   └── validation.middleware.ts # Input validation
├── modules/
│   ├── auth/               # Authentication module
│   ├── users/              # Users module
│   ├── animals/            # Animals module
│   ├── doctors/            # Doctors module
│   ├── appointments/       # Appointments module
│   └── medical-records/    # Medical records module
├── server/
│   └── server.ts           # Server entry point
├── types/
│   └── express.d.ts        # TypeScript type definitions
└── utils/
    ├── errors.ts           # Custom error classes
    └── validation.ts       # Zod validation schemas
```

## Security Features

- Password hashing with bcrypt (10 rounds)
- HttpOnly session cookies
- CORS configuration
- Role-based access control
- Input validation with Zod
- SQL injection prevention (Prisma ORM)

## Production Deployment

1. Set `NODE_ENV=production` in environment
2. Use a production PostgreSQL database
3. Set strong `SESSION_SECRET`
4. Configure `FRONTEND_URL` to your production domain
5. Run `npm run build` if using TypeScript compilation
6. Use a process manager like PM2

## License

ISC
