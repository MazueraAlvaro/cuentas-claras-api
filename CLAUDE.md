# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
npm run start:dev        # Watch mode
npm run start:debug      # Debug + watch mode

# Build & Production
npm run build            # Compile TypeScript
npm run start:prod       # Run compiled output

# Code quality
npm run lint             # ESLint with auto-fix
npm run format           # Prettier

# Tests
npm run test             # Unit tests (Jest)
npm run test:watch       # Watch mode
npm run test:cov         # Coverage report
npm run test:e2e         # End-to-end tests

# Database migrations
npm run migration:generate -- --name=MigrationName  # Auto-generate from entity changes
npm run migration:create -- --name=MigrationName    # Create empty migration
npm run migration:run    # Run pending migrations
npm run migration:revert # Rollback last migration
npm run db:seed          # Run seeders
```

## Architecture

Personal finance tracking API (Cuentas Claras = Clear Accounts). Uses NestJS v11, TypeORM with MySQL/MariaDB, and RabbitMQ for async transaction processing.

### Module Structure

```
src/
├── app.module.ts           # Root module
├── main.ts                 # HTTP server + RabbitMQ microservice bootstrap
├── database/
│   ├── data-source.ts      # TypeORM config (used by CLI and app)
│   ├── entities/           # 10 entities
│   └── migrations/         # Migration files
├── expenses/               # Expense CRUD + types
├── incomes/                # Income CRUD + types
├── months/                 # Monthly summaries and reconciliation
├── transactions/           # Credit card transactions + RabbitMQ consumer
├── accumulated/            # Historical cumulative data
├── events/                 # RabbitMQ event definitions
├── enums/                  # Shared enums (TransactionType, etc.)
└── utils/                  # Utility functions
```

### Key Architectural Decisions

**Dual bootstrap** (`main.ts`): The app runs as both an HTTP server and a RabbitMQ microservice simultaneously. The microservice listens on `RABBITMQ_TX_PARSED_QUEUE` for `TX_PARSED_EVENT` ("tx.parsed") to process bank transactions asynchronously.

**Cross-module dependencies**: `ExpensesService` and `IncomesService` are exported and imported by `MonthsModule` and `AccumulatedModule` for aggregation queries.

**Migrations run automatically** (`migrationsRun: true` in data-source). No `synchronize` — all schema changes must go through migrations.

**No auth**: No authentication or authorization guards are implemented.

**Global `ValidationPipe`** is applied with class-validator DTOs on all endpoints. API prefix is `/api`.

### Environment Variables

See `.env.example`:
```
PORT=3000
DB_HOST=database
DB_USERNAME=root
DB_PASSWORD=password
DB_DATABASE=cuentas_claras
DB_PORT=3306
```

### Docker

`docker-compose.yml` runs three containers: MariaDB, the NestJS API, and RabbitMQ (with management plugin). RabbitMQ exchange/queue definitions are in `rabbitmq/definitions.json`.
