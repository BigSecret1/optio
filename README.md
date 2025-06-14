# Optio
Optio is a project management tool built to help everyone, no matter which industry they belong to, with a simple and easy-to-navigate UI. Thanks for checking!g out !

Optio is yet to release ...

---

## Development Setup

Note that below steps are tested with linux system. Please change commands
accordingly for windows based system.

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18.19.x)
- [Python 3.12+](https://www.python.org/)
- [PostgreSQL](https://www.postgresql.org/)
- [Docker & Docker Compose](https://docs.docker.com/)[Optional: Needed only for docker 
  based deployment] 
- [Elasticsearch 8.18.x](https://www.elastic.co/guide/en/elasticsearch/reference/current/index.html)

---

### 1. Backend Setup (`./optio`)

#### Create `.env` file

Create a `.env` file inside `./optio/optioconf/`:

```env
DB_NAME=YOUR_DB_NAME
DB_USER=YOUR_DB_USER
DB_PASSWORD=YOUR_DB_PASSWORD
DB_HOST=localhost
DB_PORT=5432

CORS_ALLOWED_ORIGINS=http://localhost:3000
ELASTICSEARCH_HOST=http://localhost:9200
```

#### Set Python path (important if code is not at root)

Set the `PYTHONPATH` environment variable so Django knows where to find the code:

```bash
# Replace with your actual path
export PYTHONPATH=/home/your-username/path-to-project-root/optio
```

#### Create & activate a virtual environment

```bash
cd ./optio
python -m venv opvenv
source opvenv/bin/activate  # Windows: opvenv\Scripts\activate
```

#### Install Python dependencies

```bash
pip install -r requirements.txt
```

#### Run Django migrations

```bash
python manage.py migrate
```

#### Build Elasticsearch index

```bash
python manage.py search_index --rebuild
```

> Ensure Elasticsearch is running on `http://localhost:9200`

---

### 2. Frontend Setup (`./optio-web`)

#### Create `.env` file

Create a `.env` file in `./optio-web/`:

```env
REACT_APP_SERVER_HOST=http://localhost:8000
```

#### Install Node dependencies

```bash
cd ./optio-web
npm install
```

#### ▶Start the React development server

```bash
npm start
```

---

### 3. PostgreSQL Setup (Optional if not using Docker)

If setting up manually:

```sql
CREATE DATABASE db_name;
CREATE USER username WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE db_name TO username;
```

---

### 4. Run Elasticsearch using Docker (optional)

If not installed locally, run Elasticsearch with Docker:

```bash
docker run -d \
  --name optio-elasticsearch \
  -p 9200:9200 \
  -e "discovery.type=single-node" \
  -e "xpack.security.enabled=false" \
  docker.elastic.co/elasticsearch/elasticsearch:8.18.1
```

---

### 5. Running the Django backend

```bash
cd ./optio
source opvenv/bin/activate
python manage.py runserver 8000
```

---

### You're All Set!

| Service       | URL                       |
|---------------|---------------------------|
| Frontend      | http://localhost:3000     |
| Backend API   | http://localhost:8000     |
| Elasticsearch | http://localhost:9200     |






## Docker Deployment Guide

This guide walks you through deploying the **Optio** project using Docker and Docker Compose. You can customize ports and configure Nginx for production as needed.

---

### Project Structure

```
optio/
├── docker-compose.yml
├── .env                     # Environment variables (required)
├── optio/                   # Backend (Django)
├── optio-web/               # Frontend (React)
```

---

### Step 1: Create a `.env` File in the Root

Create a file named `.env` in the **root** directory with the following content:

```env
DEBUG=True
ALLOWED_HOSTS=localhost

DB_NAME=optio
DB_USER=postgres
DB_PASSWORD=optio
DB_HOST=db
DB_PORT=5432

CORS_ALLOWED_ORIGINS=http://localhost:3001

ELASTICSEARCH_HOST=http://elasticsearch:9200

REACT_APP_SERVER_HOST=http://localhost:8001
```

> You can change any value (such as ports or hostnames) to match your environment.

---

### Step 2: Build and Start the Containers

From the root directory, run:

```bash
docker-compose build
docker-compose up -d
```

---

### Step 3: Access the Services

| Service       | URL / Port            |
|---------------|------------------------|
| Frontend      | http://localhost:3001  |
| Backend API   | http://localhost:8001  |
| PostgreSQL    | localhost:5432         |
| Elasticsearch | http://localhost:9200  |

---

### Step 4: Backend Setup (Migrations & Elasticsearch)

Access the backend container:

```bash
docker-compose exec backend bash
```

Then run:

```bash
# Run Django migrations
python manage.py migrate

# Create groups and assign permissions [RBAC]
python manage.py setup_groups

# Rebuild Elasticsearch index
python manage.py search_index --rebuild
```

