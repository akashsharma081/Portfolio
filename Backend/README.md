# Portfolio Backend - FastAPI + SQLite

A robust, production-ready, and scalable REST API built with FastAPI, Pydantic (v2), and SQLAlchemy to support contact form submissions, secure password hashing, JWT authentication, and full administrative CRUD dashboard operations.

## Architecture Highlights
- **Clean Service-Model-Router Architecture**: Complete separation of concerns:
  - `models.py`: Defines database structures using SQLAlchemy.
  - `schemas.py`: Implements input validation & formatting using Pydantic.
  - `services/`: Encapsulates database transactions and business logic rules.
  - `routers/`: Mounts secure and public FastAPI endpoints.
  - `auth.py`: Direct high-security bcrypt password hashing & JWT token issuing.
- **Custom Error Validation Handler**: Converts default verbose Pydantic structural errors into flat, friendly key-value dictionaries.
- **CORS Config**: Safely bridges frontend development ports with the backend.

---

## 🛠️ Setup Instructions

### 1. Setup Virtual Environment
Navigate to the `Portfolio/Backend` directory and initialize a Python 3 virtual environment:

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS / Linux
python3 -m venv venv
source venv/bin/activate
```

### 2. Install Dependencies
Install all required libraries specified in `requirements.txt`:

```bash
pip install -r requirements.txt
```

### 3. Environment Variables Setup
Copy the template `.env.example` file to create your active `.env` file:

```bash
# Windows (PowerShell)
copy .env.example .env

# macOS / Linux / Bash
cp .env.example .env
```

Make sure the `.env` settings align with your requirements (e.g., custom secret keys or admin credentials):
```env
DATABASE_URL=sqlite:///./portfolio.db
SECRET_KEY=9aefb23184cd761f22e84ab4b6da978bf4c15371ad52b31f7c5e2ff71804b402
ACCESS_TOKEN_EXPIRE_MINUTES=60
ADMIN_EMAIL=admin@portfolio.com
ADMIN_PASSWORD=AdminSecure123!
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

---

## 🗄️ Database Setup & Migrations

The database tables are automatically managed via SQLAlchemy declarative base metadata.
- **Auto-Initialization**: When the FastAPI application starts, the `lifespan` event automatically verifies database file presence and constructs all necessary database tables (`users` and `submissions`) if they are absent. No complex migration setups are needed to get started!
- **Automatic Seed Verification**: On startup, the system checks if the default admin user exists in the `users` table. If not, it hashes the `ADMIN_PASSWORD` from your `.env` securely using bcrypt, and writes the default account record automatically.

---

## 🚀 Running the Servers

### Run the FastAPI Backend
Start the FastAPI hot-reloading development server on port `8000`:

```bash
uvicorn app.main:app --reload --port 8000
```

- **Swagger Documentation**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc Documentation**: [http://localhost:8000/redoc](http://localhost:8000/redoc)

### Run the React Frontend
Navigate to the `Portfolio/Frontend` folder and start the dev server:

```bash
npm run dev
```

---

## 🧪 Verification and Operations

### 🔑 Default Credentials
- **Username / Email**: `admin@portfolio.com`
- **Password**: `AdminSecure123!`

### API Routes
- `POST /api/submissions/`: Public form submission endpoint.
- `POST /api/auth/login`: Authentication panel. Returns access JWT bearer token.
- `GET /api/submissions/`: Admin-protected list of all forms (supports query filters).
- `PUT /api/submissions/{id}`: Admin-protected single submission update.
- `DELETE /api/submissions/{id}`: Admin-protected submission removal.
