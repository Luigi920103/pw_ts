# 🚀 Playwright TS Automation Framework (POC)

This repository contains a professional **Proof of Concept (POC)** for an automated testing framework. It utilizes **Playwright** with **TypeScript (Pure TS)** to handle **End-to-End (E2E)** testing for both **UI and API layers**, including persistence and **database connectivity**.

---

## 📂 Project Structure

The project follows the **Page Object Model (POM)** and a resource-based architecture to ensure scalability and maintainability.

```text
pw_ts/
├── src/
│   ├── api_actions/          # High-level API business logic and flows
│   ├── fixtures/             # Custom Playwright 'test' extensions & dependency injection
│   ├── pages/                # UI Page Object Model (POM) classes
│   ├── resources/
│   │   ├── mocks/            # Mock data for API response interception
│   │   ├── schemas/          # Joi validation schemas for API testing
│   │   ├── services/         # Service-layer definitions
│   │   ├── temp/             # Cache storage (e.g., api_token_cache.json)
│   │   ├── visual_baselines/ # Reference snapshots from stable versions of the UI
│   │   └── utils/            # Core technical utilities
│   │       ├── apiClient.ts         # Custom API client wrapper
│   │       ├── apiSessionManager.ts # Auth state and session persistence
│   │       ├── commands.ts          # Global helper functions and file system utils
│   │       ├── constants.ts         # Static configuration and shared constants
│   │       ├── mongoClient.ts       # MongoDB connection and query handler
│   │       └── postgresClient.ts    # PostgreSQL connection and query handler
│   └── tests/
│       ├── api/            # API Test suites (.spec.ts)
│       └── ui/             # UI Test suites (.spec.ts)
├── .env                    # Global environment variables
├── .env.dev                # Environment-specific variables (dev)
├── playwright.config.ts    # Global Playwright configuration
└── package.json            # NPM scripts, dependencies, and metadata
```

# 🛠️ Installation & Setup

## Prerequisites

Node.js: Version 18.x or higher

Git: Required to clone the repository

## Setup

Clone the repository

- git clone

Navigate to the project folder

- cd pw_ts

Install dependencies

- npm install

Install Playwright browser binaries

- npx playwright install --with-deps

# ⚙️ Environment Management

The framework uses a dual-layer .env strategy to manage multiple environments.
Global Variables (.env)

```text
TEST_ENVIRONMENT=dev
PAUSE_APP_ON_DEBUG=true
AUTOMATION_UI_WIDTH=1366
AUTOMATION_UI_HEIGHT=768
API_DEBUG=true

#MONGO DB CONECCTION
 MONGODB_CONNECTION=user//password0@url/
 MONGODB_DB=database_name

#POSTGRES DB CONECCTION
POSTGRESSQL_HOST=
POSTGRESSQL_PORT=
POSTGRESSQL_DB=
POSTGRESSQL_USER=
POSTGRESSQL_PASSWORD=
POSTGRESSQL_SSL=

# Super admin
ADMIN_EMAIL=
ADMIN_PASSWORD=

# regular user
REGULAR_USER_EMAIL=
REGULAR_USER_PASSWORD=

```

## Environment-Specific (.env.dev)

Contains:

- Target URLs

# 🚀 Running Tests & Reporting

Available scripts defined in package.json:

Command Description

```text
npm run uiDebug	Runs UI tests with @uiDebug tag (2 workers) on Chrome
npm run apiDebug	Runs API tests with @api tag (2 workers)
npm run allure:clean	Removes previous Allure results and reports
npm run allure:serve	Generates and serves the Allure Report locally
```

## 🐳 Docker Integration

🐳 Dockerización
Para garantizar un entorno consistente, puedes ejecutar el framework en un contenedor:

Dockerfile:

```text
Dockerfile

FROM mcr.microsoft.com/playwright:v1.57.0-focal

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npx", "playwright", "test"]
```

### Comandos Docker:

Bash

- docker build -t playwright-poc .
- docker run --env-file .env playwright-poc

## ☸️ CI/CD: GitHub Actions & Kubernetes (K8s)

Pipeline de GitHub Actions (.github/workflows/main.yml)

```text
name: Playwright Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - name: Install dependencies
        run: npm install
      - name: Run Playwright tests
        run: npx playwright test
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

### Kubernetes Scalability

Sharding: Distribute .feature files across multiple pods using Playwright's native sharding.
Secrets: DB credentials from .env are injected via K8s Secrets.
Persistence: Shared session tokens allow multiple pods to bypass login steps.
