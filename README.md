# Test Generator — AI-Powered Test Creation and Checking Service
This project was developed by Oleksandr Bazhyn, a 3rd-year student of group TTP-31, Department of Programming Theory and Technologies, Faculty of Computer Science and Cybernetics, Taras Shevchenko National University of Kyiv, as a coursework project.

## Overview
**Test Generator** is a modern full-stack web application that allows you to:
- Automatically generate unique multiple-choice tests on any topic using OpenAI GPT.
- Take and check tests directly in your browser.
- Review mistakes and receive automatic grading (percentage, 5- and 12-point scales).
- Export tests and your answers to PDF (with Cyrillic support).
- Find and review past tests by ID.

The project includes a **React (Vite) frontend** and a **TypeScript/Express backend** with a PostgreSQL database. It supports both local development and Docker deployment.

 ---

 ## Features
- **AI Test Generation:** Create tests on any subject and topic in seconds.
- **PDF Export:** Download tests with your answers for offline use or printing.
- **Grading:** Automatic checking with support for multiple grading systems.
- **User-Friendly Interface:** Clean, responsive UI (React + CSS).
- **Swagger API Documentation:** Accessible at `/api-docs` on the backend.
- **Docker Support:** One-command deployment using `docker-compose`.
- **Cyrillic and Unicode Support:** Full support in PDF export and interface.
- **Demo mode:** No authentication, no personal data collection.

---

## Quick Start
### 1. **Clone the Repository**
```bash
git clone https://github.com/OleksandrBazhyn/test-generator.git
cd test-generator
```

---

### 2. **Local Development (without Docker)**
### Backend (Node.js + PostgreSQL)
#### 1. Install dependencies:
```bash
git clone https://github.com/OleksandrBazhyn/test-generator.git
cd test-generator
```

#### 2. Configure environment:
- Copy `.env.example` to `.env` and set variables (including your OpenAI API key, DB connection).
- Start your local PostgreSQL server and create a database (e.g., `testgen`).

#### 3. Apply migrations and seed:
```bash
npm run migrate
npm run seed
```

#### 4. Start the backend:
```bash
npm run dev
```
- Server will run on http://localhost:5000

#### 5. Swagger API docs:
Visit `http://localhost:5000/api-docs`

### Frontend (React)
#### 1. Install dependencies:
```bash
cd ../client
npm install
```

#### 2. Configure environment:
- Copy `.env.example` to `.env`
- Set `VITE_API_URL=http://localhost:5000/api`

#### 3. Run frontend:
```bash
npm run dev
```
- App will be available at `http://localhost:5173`

---

### 3. **Run with Docker Compose (Recommended)**
*Requires Docker and docker-compose.*

```bash
docker-compose up --build
```
- The backend (Express) will be available at `http://localhost:5000`
- The frontend (React) will be available at `http://localhost:4173`
- The database will persist data in a Docker volume (`db-data`).

#### Environment variables
- Set your OpenAI API key and DB credentials in `server/.env.docker` and `client/.env.docker`.

#### First Launch
- On first run, migrations and seed scripts will create all tables and sample data automatically.

---

## Usage
- **Generate tests**: Specify subject, topic, (optional) description and difficulty.
- **Take test**: Select answers, check results, and get your grade.
- **Export to PDF**: Download printable version (supports Cyrillic).
- **Check test by ID**: Review any test result by its unique identifier.
- **API docs**: Explore backend API at `/api-docs`.

## Project Structure
```graphql
test-generator/
  ├── client/      # React (Vite) frontend
  ├── server/      # Express + TypeScript backend
  │     ├── db/            # Migrations & seeds
  │     ├── src/           # App source (controllers, routes, services, types)
  │     └── fonts/         # Fonts for PDFKit (e.g. DejaVuSans.ttf for Cyrillic)
  ├── docker-compose.yml
  ├── README.md
  └── ...
```

## License
This project is licensed under the [MIT License](./LICENSE).
You are free to use, modify, and distribute it for any purpose, including commercial and educational, with attribution.

## Author & Contacts
Developed by **Oleksandr Bazhyn**
- GitHub: [OleksandrBazhyn](https://github.com/OleksandrBazhyn)
- Email: [olexandrbazhyn@gmail.com](mailto:olexandrbazhyn@gmail.com)
- Instagram: [@dgwjew_](https://www.instagram.com/dgwjew_/)
