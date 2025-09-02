# How to Run the Application

To run the application, you can use the VS Code tasks that have been set up:

1. Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac) to open the Command Palette
2. Type "Tasks: Run Task" and select it
3. Choose "Start Application" to run both backend and frontend simultaneously

Alternatively, you can run the backend and frontend separately:

## Backend

```bash
# Navigate to the backend directory
cd backend

# Create a virtual environment if not already created
python -m venv venv

# Activate the virtual environment
# On macOS/Linux
source venv/bin/activate
# On Windows
# venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the application
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## Frontend

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Run the development server
npm run dev
```

## Environment Variables

Before running the application, make sure to set up your environment variables:

1. Create a `.env` file in the backend directory with:
```
POSTGRES_SERVER=localhost
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=app_db
POSTGRES_PORT=5432
SECRET_KEY=your-secret-key
OPENAI_API_KEY=your-openai-api-key  # Optional
```

## Database Setup

This application requires PostgreSQL:

1. Install PostgreSQL if not already installed
2. Create a database named `app_db`
3. The application will create the necessary tables when it starts for the first time

## Accessing the Application

- Backend API: http://localhost:8000/api/v1
- Frontend: http://localhost:5173
- API Documentation: http://localhost:8000/docs

## Features Implemented

- User authentication (JWT)
- Real-time chat via WebSockets
- AI integration (OpenAI and LangChain)
- PostgreSQL database with SQLAlchemy ORM
- RESTful API for Flutter access
