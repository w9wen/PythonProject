# PiWebApp - Sample Project

A full-stack application with Python FastAPI backend and React (Vite) frontend that can be deployed to both Raspberry Pi and web servers.

## Features

- **Python FastAPI Backend**: Modern, fast web framework for building APIs
- **React (Vite) Frontend**: Blazing fast frontend tooling
- **PostgreSQL Database**: Robust relational database with SQLAlchemy ORM
- **WebSocket Support**: Real-time communication (SignalR-like functionality)
- **AI Integration**: OpenAI and LangChain integration
- **Flutter API Support**: API endpoints for Flutter mobile clients
- **Authentication**: JWT-based authentication system
- **Entity Framework-like ORM**: SQLAlchemy with clean models and schemas

## Running the Project

### Prerequisites

- Python 3.9+
- Node.js 16+
- PostgreSQL

### Backend Setup

1. Create a virtual environment and activate it:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```
   cd backend
   pip install -r requirements.txt
   ```

3. Create a `.env` file in the backend directory with:
   ```
   POSTGRES_SERVER=localhost
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=postgres
   POSTGRES_DB=app_db
   POSTGRES_PORT=5432
   SECRET_KEY=your-secret-key
   OPENAI_API_KEY=your-openai-api-key  # Optional
   ```

4. Run the backend:
   ```
   cd backend
   uvicorn main:app --reload
   ```

### Frontend Setup

1. Install dependencies:
   ```
   cd frontend
   npm install
   ```

2. Run the frontend:
   ```
   npm run dev
   ```

## Project Structure

```
├── backend/
│   ├── app/
│   │   ├── ai/
│   │   ├── api/
│   │   │   ├── endpoints/
│   │   │   ├── api.py
│   │   │   └── websocket.py
│   │   ├── core/
│   │   ├── db/
│   │   ├── models/
│   │   └── schemas/
│   ├── main.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── README.md
```

## Deployment Options

### Raspberry Pi Deployment

For Raspberry Pi deployment, follow the setup instructions and set up a systemd service:

```
[Unit]
Description=My Web App
After=network.target

[Service]
User=pi
WorkingDirectory=/path/to/app/backend
ExecStart=/path/to/app/venv/bin/uvicorn main:app --host 0.0.0.0 --port 8000
Restart=always

[Install]
WantedBy=multi-user.target
```

### CI/CD Options

#### GitHub Actions for Raspberry Pi

```yaml
name: Deploy to Raspberry Pi

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.10'
          
      - name: Install dependencies
        run: |
          python -m pip install --upgrade pip
          if [ -f requirements.txt ]; then pip install -r requirements.txt; fi
          
      - name: Deploy to Raspberry Pi
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.RPI_HOST }}
          username: ${{ secrets.RPI_USERNAME }}
          key: ${{ secrets.RPI_SSH_KEY }}
          script: |
            cd /path/to/project
            git pull
            source venv/bin/activate
            pip install -r requirements.txt
            systemctl restart myapp
```

#### Azure DevOps for Web Deployment

```yaml
# azure-pipelines.yml
trigger:
- main

pool:
  vmImage: 'ubuntu-latest'

stages:
- stage: Build
  jobs:
  - job: BuildBackend
    steps:
    - task: UsePythonVersion@0
      inputs:
        versionSpec: '3.10'
    - script: |
        python -m pip install --upgrade pip
        pip install -r backend/requirements.txt
      displayName: 'Install backend dependencies'

  - job: BuildFrontend
    steps:
    - task: NodeTool@0
      inputs:
        versionSpec: '16.x'
    - script: |
        cd frontend
        npm install
        npm run build
      displayName: 'Build frontend'

- stage: Deploy
  jobs:
  - job: DeployApp
    steps:
    - task: AzureWebApp@1
      inputs:
        azureSubscription: '$(AZURE_SUBSCRIPTION)'
        appName: '$(WEB_APP_NAME)'
        package: '$(System.DefaultWorkingDirectory)'
```

## License

This project is licensed under the MIT License.
