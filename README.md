# Retail Business Management — Billing Software

A full-stack billing and inventory management system for retail businesses.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | Spring Boot 3, Java 21 |
| Frontend | React + Vite |
| Database | PostgreSQL on NeonDB |
| Payments | Razorpay |
| Image Upload | Cloudinary |
| Auth | JWT |
| Containerization | Docker |

---

## Project Structure

```
billingSoftware/
├── billingSoftwareBackend/     # Spring Boot API
├── reactFrontend/
│   └── billingSoftwareFrontend/  # React app
└── ver1.0/                     # Local backup (not committed)
```

---

## Getting Started

### Prerequisites
- Java 21+
- Node.js 18+
- Maven (or use `./mvnw`)

### 1. Clone the repo

```bash
git clone https://github.com/vkp000/retailBusinessManagement.git
cd retailBusinessManagement
```

### 2. Setup backend config

```bash
cd billingSoftwareBackend/src/main/resources
cp application.properties.example application.properties
# Fill in your actual credentials in application.properties
```

### 3. Run backend

```bash
cd billingSoftwareBackend
./mvnw spring-boot:run
# Runs on http://localhost:8080/api/v1.0
```

### 4. Run frontend

```bash
cd reactFrontend/billingSoftwareFrontend
npm install
npm run dev
# Runs on http://localhost:5173
```

---

## Environment Variables (application.properties)

| Key | Description |
|-----|-------------|
| `spring.datasource.url` | NeonDB PostgreSQL connection URL |
| `spring.datasource.username` | NeonDB username |
| `spring.datasource.password` | NeonDB password |
| `jwt.secret.key` | JWT signing secret (min 64 chars) |
| `razorpay.key.id` | Razorpay Key ID |
| `razorpay.key.secret` | Razorpay Key Secret |
| `cloudinary.cloud.name` | Cloudinary cloud name |
| `cloudinary.api.key` | Cloudinary API key |
| `cloudinary.api.secret` | Cloudinary API secret |

> Copy `application.properties.example` → `application.properties` and fill in your values. Never commit `application.properties`.

---

## Docker

```bash
cd billingSoftwareBackend
docker build -f docker -t billing-backend .
docker run -p 8080:8080 \
  -e SPRING_DATASOURCE_URL=your_url \
  -e SPRING_DATASOURCE_PASSWORD=your_pass \
  billing-backend
```

---

## Git Workflow

```
main       — stable, production-ready
dev        — integration branch
feature/*  — individual features
fix/*      — bug fixes
```

Commit format: `type(scope): description`
Examples: `feat(auth): add JWT refresh`, `fix(payment): handle webhook timeout`