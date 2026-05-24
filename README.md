# Traffic Data Dashboard

Web app for viewing traffic counts by country and vehicle type. React frontend, NestJS API, Postgres backend.

## Setup

Easiest way to run it:

```bash
docker compose up --build
```

Dashboard: http://localhost:3000  
API: http://localhost:3001/api  

The database seeds itself on first startup, so the charts should have data immediately.

### Without Docker

You'll need Node 20+ and Postgres.

```bash
cd backend
cp .env.example .env
npm install
npm run start:dev
```

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at http://localhost:5173 and proxies API calls to port 3001.

## Architecture

```
React + Recharts  →  NestJS  →  PostgreSQL
```

Countries and traffic records are in separate tables. Chart endpoints aggregate with `GROUP BY` via TypeORM QueryBuilder. The UI can add, edit, and delete records through the REST API.

## API

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/traffic/by-country` | Totals by country |
| GET | `/api/traffic/by-vehicle-type` | Totals by vehicle type |
| GET | `/api/traffic` | All records |
| POST | `/api/traffic` | Create |
| PUT | `/api/traffic/:id` | Update |
| DELETE | `/api/traffic/:id` | Delete |
| GET | `/api/countries` | Country list |
| GET | `/api/health` | Health check |

## Scalability

Current setup is one API instance and one Postgres database. Works for the scope of this project.

If load picked up to around 50 RPS, I'd run multiple API instances behind a load balancer, add PgBouncer for connection pooling, and cache the aggregation endpoints in Redis — those two GET routes get called constantly and the underlying data doesn't change that often. Frontend static files off a CDN.

At 500 RPS it gets more interesting: k8s autoscaling, partition `traffic_records` by month, materialized views for the chart queries, and probably a queue for writes if you're ingesting sensor data without blocking dashboard reads.

That's not built here, just the direction I'd take.

## Tests

```bash
cd backend && npm test
cd frontend && npm test
```
