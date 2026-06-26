# FounderOS AI

**Your AI Co-Founder that turns startup ideas into execution-ready businesses.**

FounderOS AI is a production-grade SaaS platform that transforms a single-sentence startup idea into a complete business blueprint. It combines multiple specialized AI modules to generate market research, business strategy, technical architecture, marketing plans, development roadmaps, and investor pitch decks — all in minutes.

---

## Table of Contents

1. [Product Overview](#product-overview)
2. [Architecture](#architecture)
3. [Technology Stack](#technology-stack)
4. [Features](#features)
5. [User Flow](#user-flow)
6. [Project Structure](#project-structure)
7. [Getting Started](#getting-started)
8. [Environment Variables](#environment-variables)
9. [Database Schema](#database-schema)
10. [AI System](#ai-system)
11. [Billing & Subscriptions](#billing--subscriptions)
12. [Deployment](#deployment)
13. [Contributing](#contributing)

---

## Product Overview

### The Problem

Starting a company requires weeks of research, planning, and documentation across multiple disciplines: market analysis, business modeling, technical design, marketing strategy, and investor preparation. Most founders lack expertise in all these areas simultaneously.

### The Solution

FounderOS AI acts as an AI operating system for startup founders. A user submits one sentence describing their idea, and the platform orchestrates multiple AI agents to produce a comprehensive startup blueprint — structured, editable, and ready for execution.

### Who Is This For

- Startup founders validating ideas
- Indie hackers building SaaS products
- College entrepreneurs in hackathons
- Freelance developers creating products
- Small teams planning their next venture

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client (Browser)                         │
├─────────────────────────────────────────────────────────────────┤
│                    Next.js 14 (App Router)                       │
│              Server Components + Client Components               │
├──────────┬──────────────┬──────────────┬────────────────────────┤
│  Clerk   │  API Routes  │  AI Service  │   Razorpay Billing     │
│  Auth    │  (REST+SSE)  │  (NVIDIA)    │   (Subscriptions)      │
├──────────┴──────────────┴──────────────┴────────────────────────┤
│                     Prisma ORM                                   │
├─────────────────────────────────────────────────────────────────┤
│               PostgreSQL (Supabase)                              │
└─────────────────────────────────────────────────────────────────┘
```

### Request Flow: Blueprint Generation

```
User clicks "Generate Blueprint"
        │
        ▼
POST /api/workspaces/[id]/generate
        │
        ▼
AI Orchestrator (sequential, section-by-section)
        │
        ├── Prompt Engine selects template for section type
        ├── Context Builder assembles startup idea + prior sections
        ├── NVIDIA API generates content (streaming)
        ├── Content saved to `sections` table
        ├── Status update sent via SSE to client
        │
        ▼ (repeats for all 9 sections)
        │
        ▼
Client displays progress in real-time
```

---

## Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Framework | Next.js 14 (App Router) | Full-stack React with server components |
| Language | TypeScript | Type safety across the entire codebase |
| Styling | Tailwind CSS | Utility-first styling with design tokens |
| Components | shadcn/ui + custom | Accessible, composable UI primitives |
| Animation | Framer Motion | Page transitions, hover effects, streaming |
| Authentication | Clerk | OAuth (Google, GitHub, Email), session management |
| Database | PostgreSQL via Supabase | Managed database with connection pooling |
| ORM | Prisma | Type-safe queries, migrations, schema management |
| AI Provider | NVIDIA NIM (stepfun-ai/step-3.5-flash) | LLM for content generation and chat |
| Payments | Razorpay | Subscription billing (INR) |
| Monorepo | Turborepo + pnpm | Build orchestration, workspace management |
| Deployment | Vercel | Edge network, preview deploys, serverless |

---

## Features

### 1. AI Blueprint Generation

Submit a startup idea and receive 9 independently-generated sections:

| Section | What It Produces |
|---------|-----------------|
| Overview | Product description, problem statement, value proposition, assumptions |
| Product Analysis | User personas, feature priorities, competitive positioning |
| Market Research | TAM/SAM/SOM, competitors, SWOT analysis, trends |
| Business Model | Business Model Canvas (9 blocks), revenue streams, pricing |
| Technical Architecture | Tech stack recommendations, system design, database schema |
| UI/UX | User flows, wireframes, landing page copy, design system |
| Marketing | Channels, SEO keywords, launch checklist, social strategy |
| Roadmap | 3-phase plan with milestones, timelines, feature prioritization |
| Pitch Deck | 9 slides with content and speaker notes |

Each section is generated independently, saved immediately, and survives interruptions.

### 2. AI Co-Founder (Chat)

A standalone conversational AI assistant that:

- Maintains independent conversation history (not tied to a single workspace)
- Optionally attaches workspace context for startup-specific advice
- Streams responses in real-time with markdown rendering
- Supports conversation management (create, rename, delete)
- Groups conversations by date (Today, Yesterday, Last 7 Days, Older)

### 3. Workspace Management

- Create unlimited workspaces (plan-dependent)
- Rename, archive, soft-delete with confirmation
- Progress tracking (X/9 blueprint sections completed)
- Industry and startup stage classification
- Auto-generated slugs

### 4. Subscription Billing (Razorpay)

| Plan | Price | Credits/Month | Key Features |
|------|-------|---------------|--------------|
| Free | ₹0 | 10 | 1 workspace, basic blueprint |
| Pro | ₹99 | 250 | Unlimited workspaces, full AI chat, export |
| Scale | ₹299 | 800 | Faster generation, premium templates |
| Team | ₹699 | 2500 | Collaboration, shared workspaces, analytics |

- Server-side payment verification (HMAC-SHA256 signature validation)
- Atomic credit deduction with transaction logging
- Monthly credit reset on billing anniversary

### 5. Export

- Markdown export of complete blueprint
- Download via signed URL (24-hour expiry)
- Includes workspace name and timestamp header

---

## User Flow

```
Landing Page
    │
    ├── Sign Up (Clerk: Email / Google / GitHub)
    │
    ▼
Dashboard (Founder Command Center)
    │
    ├── Create Startup (name, idea, industry, stage)
    │         │
    │         ▼
    │   Workspace Created (9 sections initialized as "pending")
    │         │
    │         ▼
    │   Click "Generate Blueprint"
    │         │
    │         ▼
    │   AI generates sections sequentially (SSE streaming)
    │         │
    │         ▼
    │   View generated content (Markdown rendered)
    │
    ├── AI Co-Founder (/dashboard/ai)
    │         │
    │         ▼
    │   Create conversation, ask questions, get startup advice
    │
    ├── Billing (/dashboard/billing)
    │         │
    │         ▼
    │   View plan, credits, upgrade via Razorpay
    │
    └── Export (download workspace as .md file)
```

---

## Project Structure

```
founderos-ai/
├── apps/
│   └── web/                          # Next.js application
│       ├── prisma/
│       │   └── schema.prisma         # Database schema
│       ├── public/
│       │   └── logo.png              # Brand logo
│       ├── src/
│       │   ├── app/
│       │   │   ├── (auth)/           # Sign-in, Sign-up pages
│       │   │   ├── (dashboard)/      # Authenticated pages
│       │   │   │   ├── dashboard/    # Home, Billing, AI, Settings
│       │   │   │   └── workspace/    # Workspace [id] / [section]
│       │   │   ├── api/              # API route handlers
│       │   │   │   ├── billing/      # create-order, verify-payment
│       │   │   │   ├── conversations/# CRUD + messages (SSE)
│       │   │   │   └── workspaces/   # CRUD + generate + export
│       │   │   ├── layout.tsx        # Root layout (Clerk + Theme)
│       │   │   └── page.tsx          # Landing page
│       │   ├── components/
│       │   │   ├── ai/              # AI Co-Founder chat layout
│       │   │   ├── billing/         # Pricing cards
│       │   │   ├── dashboard/       # Sidebar, quick actions
│       │   │   ├── landing/         # Hero, features, pricing, footer
│       │   │   ├── shared/          # Theme toggle, markdown renderer
│       │   │   ├── ui/              # Button, Card, Input, Badge, etc.
│       │   │   └── workspace/       # Shell, cards, create dialog
│       │   ├── lib/
│       │   │   ├── ai/             # Gemini client, prompts, orchestrator
│       │   │   ├── billing/        # Razorpay, subscription service
│       │   │   ├── constants/      # Plans, section types
│       │   │   ├── db/             # Prisma client singleton
│       │   │   ├── services/       # Workspace, conversation services
│       │   │   └── validators/     # Zod schemas
│       │   └── styles/
│       │       └── globals.css     # Tailwind + design tokens
│       ├── .env.local              # Environment variables (not committed)
│       └── package.json
├── packages/
│   └── config/                     # Shared ESLint, Prettier, TS configs
├── docker-compose.yml              # Local PostgreSQL + Redis
├── turbo.json                      # Turborepo pipeline
└── package.json                    # Root workspace
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 9+
- A Supabase project (free tier works)
- A Clerk account (free tier works)
- An NVIDIA NIM API key (free tier available)
- A Razorpay account (test mode for development)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/founderos-ai.git
cd founderos-ai

# Install dependencies
pnpm install

# Set up environment variables
cp apps/web/.env.example apps/web/.env.local
# Fill in all required values (see Environment Variables section)

# Generate Prisma client
cd apps/web && npx prisma generate

# Push schema to database
npx prisma db push

# Start development server
cd ../..
pnpm dev
```

The application will be available at `http://localhost:3000`.

---

## Environment Variables

Create `apps/web/.env.local` with the following:

```bash
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Database (Supabase PostgreSQL)
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# AI Provider (NVIDIA NIM)
NVIDIA_API_KEY=nvapi-...

# Razorpay Billing
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Database Schema

The application uses 7 core models:

```
User ─────────── Subscription
  │                    │
  └── Workspace ──── Conversation
        │                │
        └── Section     └── ChatMessage

Payment ── (linked to User)
CreditTransaction ── (linked to User)
```

| Model | Purpose |
|-------|---------|
| Workspace | A startup project container with idea, industry, stage |
| Section | One of 9 blueprint sections (independently generated/versioned) |
| Conversation | An AI Co-Founder chat session (optionally linked to a workspace) |
| ChatMessage | Individual messages within a conversation |
| Subscription | User's current plan, credits, renewal date |
| Payment | Razorpay payment records |
| CreditTransaction | Audit trail of credit usage |

---

## AI System

### Provider Abstraction

The AI layer is designed for provider swapping. Currently using NVIDIA NIM (`stepfun-ai/step-3.5-flash`), but the interface supports any OpenAI-compatible API:

```typescript
// lib/ai/gemini.ts (provider-agnostic despite the filename)
const client = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY,
  baseURL: "https://integrate.api.nvidia.com/v1",
});
```

To switch providers, change `baseURL` and `apiKey`. No business logic changes needed.

### Prompt Templates

Each blueprint section has a dedicated prompt template (`lib/ai/prompts.ts`) that:

1. Injects startup context (name, idea, industry, stage)
2. Provides section-specific system instructions
3. Requests structured markdown output
4. Sets appropriate temperature (0.3-0.7 depending on section)

### Orchestrator

The orchestrator (`lib/ai/orchestrator.ts`) handles:

- Sequential section generation with error isolation
- Status tracking (pending → generating → completed/failed)
- Automatic content persistence after each section
- SSE streaming for real-time progress updates

---

## Billing & Subscriptions

### Payment Flow

```
User clicks "Upgrade"
        │
        ▼
POST /api/billing/create-order
  → Razorpay order created (amount in paise)
        │
        ▼
Razorpay Checkout opens (client-side)
  → User completes payment
        │
        ▼
POST /api/billing/verify-payment
  → HMAC-SHA256 signature verification
  → Subscription activated
  → Credits allocated
  → Payment recorded
        │
        ▼
Redirect to /dashboard/billing/success
```

### Credit System

- Each AI action costs credits (blueprint generation = 9, chat message = 1)
- Credits reset monthly on the billing anniversary
- Unused credits do not carry over
- Insufficient credits block generation (not deducted on failure)

---

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set the root directory to `apps/web`
3. Add all environment variables in the Vercel dashboard
4. Deploy

### Environment Requirements

- Node.js 18+
- PostgreSQL (Supabase recommended for managed hosting)
- No Docker required in production (serverless)

### CI/CD

The project includes GitHub Actions (`/.github/workflows/ci.yml`) for:

- Lint checking on every PR
- TypeScript type checking
- Automated on push to `main`

---

## Contributing

### Development Commands

```bash
pnpm dev          # Start dev server
pnpm build        # Production build
pnpm lint         # Run ESLint
pnpm type-check   # TypeScript verification
pnpm format       # Prettier formatting
```

### Code Style

- TypeScript strict mode
- Double quotes, semicolons
- 2-space indentation
- `cn()` utility for className merging
- Server Components by default, `"use client"` only where needed
- Prisma for all database operations (no raw SQL)

### Branch Strategy

- `main` — production-ready code
- Feature branches for new work
- PRs require passing CI checks

---

## License

This project is proprietary software. All rights reserved.

---

Built by [Sameer Walikar](https://linkedin.com/in/sameer-walikar/)
