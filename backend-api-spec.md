# Vestra FastAPI Backend — API Specification

## Project Setup

```
backend/
  app/
    main.py              # FastAPI app, CORS, routers
    core/
      config.py           # Settings (DB URL, JWT secret, etc.)
      database.py         # SQLAlchemy async engine + session
      security.py         # JWT encode/decode, password hashing
      deps.py             # Dependency injection (get_db, get_current_user)
    models/
      user.py
      property.py
      agent.py
      verification.py
      escrow.py
      message.py
      notification.py
      rental.py
      maintenance.py
      lead.py
      commission.py
    schemas/
      user.py
      property.py
      agent.py
      verification.py
      escrow.py
      message.py
      notification.py
      rental.py
      maintenance.py
      lead.py
      commission.py
    routers/
      auth.py
      properties.py
      agents.py
      verify.py
      escrow.py
      messages.py
      notifications.py
      dashboard.py
      rental.py
      maintenance.py
      blog.py
    services/            # Business logic (optional, or put it in routers)
  alembic/               # Database migrations
  requirements.txt
  .env
```

**requirements.txt**
```
fastapi==0.115.*
uvicorn[standard]
sqlalchemy[asyncio]
asyncpg
alembic
python-jose[cryptography]
passlib[bcrypt]
python-multipart
pydantic[email]
pydantic-settings
```

---

## Database Models (SQLAlchemy)

### User
| Column | Type | Notes |
|---|---|---|
| id | UUID | PK |
| email | String | unique, indexed |
| full_name | String | |
| phone | String | |
| hashed_password | String | |
| role | Enum | buyer, seller, agent, landlord, tenant, admin |
| is_active | Boolean | default True |
| is_verified | Boolean | default False |
| is_kyc_verified | Boolean | default False |
| avatar_url | String | nullable |
| location | String | nullable |
| bio | Text | nullable |
| created_at | DateTime | |
| updated_at | DateTime | |

### Property
| Column | Type | Notes |
|---|---|---|
| id | UUID | PK |
| owner_id | UUID | FK → users.id |
| agent_id | UUID | FK → users.id, nullable |
| title | String | |
| description | Text | |
| property_type | Enum | residential, commercial, land, industrial, agricultural, student_housing, short_stay |
| listing_type | Enum | sale, rent, lease |
| status | Enum | draft, pending_review, active, suspended, sold, rented |
| price | Numeric(15,2) | |
| currency | String | default KES |
| bedrooms | Integer | |
| bathrooms | Integer | |
| size_sqft | Numeric(10,0) | |
| year_built | Integer | |
| address | String | |
| city | String | indexed |
| county | String | indexed |
| country | String | default Kenya |
| lat | Float | |
| lng | Float | |
| amenities | JSON | array of strings |
| images | JSON | array of URLs |
| trust_score | Integer | 0–100, default 0 |
| is_verified | Boolean | default False |
| is_featured | Boolean | default False |
| views | Integer | default 0 |
| inquiries | Integer | default 0 |
| created_at | DateTime | |
| updated_at | DateTime | |

### AgentProfile
| Column | Type | Notes |
|---|---|---|
| id | UUID | PK |
| user_id | UUID | FK → users.id, unique |
| agency_name | String | |
| license_number | String | unique |
| badge_level | Enum | bronze, silver, gold, platinum |
| rating | Float | default 0 |
| review_count | Integer | default 0 |
| listing_count | Integer | default 0 |
| sold_count | Integer | default 0 |
| bio | Text | |
| specialties | JSON | array of strings |
| subscription_tier | Enum | free, basic, pro, premium |
| city | String | |
| county | String | |
| joined_at | DateTime | |

### Verification
| Column | Type | Notes |
|---|---|---|
| id | UUID | PK |
| property_id | UUID | FK → properties.id |
| user_id | UUID | FK → users.id |
| status | Enum | pending, in_progress, approved, flagged, rejected |
| fraud_risk_score | Integer | 0–100 |
| trust_score | Integer | 0–100 |
| price_reasonableness | Float | |
| ownership_confidence | Float | |
| ai_summary | Text | |
| document_flags | JSON | |
| created_at | DateTime | |
| completed_at | DateTime | nullable |

### EscrowTransaction
| Column | Type | Notes |
|---|---|---|
| id | UUID | PK |
| property_id | UUID | FK → properties.id |
| buyer_id | UUID | FK → users.id |
| seller_id | UUID | FK → users.id |
| amount | Numeric(15,2) | |
| currency | String | default KES |
| status | Enum | initiated, deposit_paid, balance_paid, completed, cancelled, refunded, disputed |
| created_at | DateTime | |
| updated_at | DateTime | |

### Message
| Column | Type | Notes |
|---|---|---|
| id | UUID | PK |
| sender_id | UUID | FK → users.id |
| receiver_id | UUID | FK → users.id |
| subject | String | |
| content | Text | |
| read | Boolean | default False |
| created_at | DateTime | |

### Notification
| Column | Type | Notes |
|---|---|---|
| id | UUID | PK |
| user_id | UUID | FK → users.id |
| title | String | |
| message | Text | |
| type | Enum | info, success, warning, error, payment, verification, message |
| read | Boolean | default False |
| created_at | DateTime | |

### RentalUnit
| Column | Type | Notes |
|---|---|---|
| id | UUID | PK |
| owner_id | UUID | FK → users.id |
| title | String | |
| address | String | |
| city | String | |
| bedrooms | Integer | |
| bathrooms | Integer | |
| rent_amount | Numeric(12,2) | |
| currency | String | default KES |
| status | Enum | vacant, occupied, maintenance |
| image | String | |
| created_at | DateTime | |

### Tenant
| Column | Type | Notes |
|---|---|---|
| id | UUID | PK |
| unit_id | UUID | FK → rental_units.id |
| user_id | UUID | FK → users.id, nullable |
| name | String | |
| email | String | |
| phone | String | |
| lease_start | Date | |
| lease_end | Date | |
| rent_amount | Numeric(12,2) | |
| status | Enum | active, notice, expired |
| created_at | DateTime | |

### MaintenanceRequest
| Column | Type | Notes |
|---|---|---|
| id | UUID | PK |
| unit_id | UUID | FK → rental_units.id |
| tenant_id | UUID | FK → users.id |
| title | String | |
| description | Text | |
| priority | Enum | low, medium, high, emergency |
| status | Enum | reported, assigned, in_progress, completed, cancelled |
| created_at | DateTime | |

### Lead
| Column | Type | Notes |
|---|---|---|
| id | UUID | PK |
| agent_id | UUID | FK → users.id |
| name | String | |
| email | String | |
| phone | String | |
| property_id | UUID | FK → properties.id, nullable |
| message | Text | |
| status | Enum | new, contacted, qualified, closed, lost |
| created_at | DateTime | |

### Commission
| Column | Type | Notes |
|---|---|---|
| id | UUID | PK |
| agent_id | UUID | FK → users.id |
| property_id | UUID | FK → properties.id |
| sale_price | Numeric(15,2) | |
| commission_rate | Float | e.g. 3.0 for 3% |
| commission_amount | Numeric(12,2) | |
| currency | String | default KES |
| status | Enum | pending, paid, cancelled |
| closed_at | Date | |

### RentReceipt
| Column | Type | Notes |
|---|---|---|
| id | UUID | PK |
| unit_id | UUID | FK → rental_units.id |
| tenant_id | UUID | FK → users.id |
| amount | Numeric(12,2) | |
| currency | String | default KES |
| period | String | e.g. "June 2026" |
| payment_method | String | mpesa, bank_transfer, cash |
| paid_at | DateTime | |

---

## API Endpoints

Base URL: `http://localhost:8000/api`

All endpoints return JSON. Protected endpoints require `Authorization: Bearer <token>` header.

---

### 1. Auth — `/api/auth`

| Method | Path | Auth | Request Body | Response | Notes |
|---|---|---|---|---|---|
| POST | `/register` | No | `{email, full_name, phone, password, role}` | `{user, access_token, refresh_token}` | Creates user + returns JWT |
| POST | `/login` | No | `{email, password}` | `{user, access_token, refresh_token}` | |
| POST | `/refresh` | No | `{refresh_token}` | `{access_token, refresh_token}` | Rotate refresh token |
| GET | `/me` | Yes | — | `User` | Get current user |
| PUT | `/me` | Yes | `{full_name?, phone?, location?, bio?, avatar_url?}` | `User` | Update profile |
| POST | `/change-password` | Yes | `{current_password, new_password}` | `{message}` | |
| POST | `/forgot-password` | No | `{email}` | `{message}` | Sends reset email (stub) |
| POST | `/reset-password` | No | `{token, new_password}` | `{message}` | |
| POST | `/logout` | Yes | — | `{message}` | Blacklist token (optional) |

---

### 2. Properties — `/api/properties`

| Method | Path | Auth | Query Params | Request Body | Response | Notes |
|---|---|---|---|---|---|---|
| GET | `/` | No | `q, property_type, listing_type, county, city, min_price, max_price, min_bedrooms, page, per_page` | — | `{items: Property[], total, page, pages}` | Public search with filters |
| GET | `/featured` | No | — | — | `Property[]` | Featured properties for homepage |
| GET | `/ai-search` | No | `query` | — | `Property[]` | Simple text search across title, description, city |
| GET | `/{id}` | No | — | — | `Property` (with owner + agent) | Single property detail |
| POST | `/` | Yes | — | `{title, description, ...}` | `Property` | Create listing (seller/agent only) |
| PUT | `/{id}` | Yes | — | `{title?, description?, ...}` | `Property` | Update own listing |
| DELETE | `/{id}` | Yes | — | — | `{message}` | Delete own listing |
| GET | `/my` | Yes | — | — | `Property[]` | Current user's listings |
| POST | `/{id}/inquiry` | Yes | — | `{message}` | `{message}` | Submit inquiry + increment counter |
| POST | `/{id}/favorite` | Yes | — | — | `{message}` | Toggle save/favorite |

---

### 3. Agents — `/api/agents`

| Method | Path | Auth | Query Params | Response | Notes |
|---|---|---|---|---|---|
| GET | `/` | No | `badge_level, city, county, page, per_page` | `{items: Agent[], total, page, pages}` | List agents |
| GET | `/{id}` | No | — | `Agent` (with listings) | Agent profile + their properties |
| GET | `/{id}/listings` | No | — | `Property[]` | Properties listed by this agent |
| GET | `/top` | No | `limit` (default 5) | `Agent[]` | Top-rated agents |
| POST | `/{id}/review` | Yes | `{rating, comment}` | `{message}` | Leave a review (updates agent rating) |

---

### 4. Verification — `/api/verify`

| Method | Path | Auth | Request Body | Response | Notes |
|---|---|---|---|---|---|
| POST | `/request` | Yes | `{property_id}` | `Verification` | Start verification |
| POST | `/upload` | Yes | `{verification_id, file}` (multipart) | `{message}` | Upload documents |
| GET | `/status/{id}` | Yes | — | `Verification` | Check verification status |
| GET | `/property/{property_id}` | Yes | — | `Verification[]` | All verifications for a property |
| GET | `/report/{id}` | Yes | — | `{verification, checks: [{label, passed}]}` | Full verification report |

---

### 5. Dashboard — `/api/dashboard`

| Method | Path | Auth | Role | Response | Notes |
|---|---|---|---|---|---|
| GET | `/stats` | Yes | any | `{stat_cards: [{title, value, change?, icon}]}` | Role-specific stats |
| GET | `/activity` | Yes | any | `[{action, subject, timestamp}]` | Recent activity feed |

### Buyer-specific
| GET | `/buyer/favorites` | Yes | buyer | `Property[]` | Saved properties |
| GET | `/buyer/escrows` | Yes | buyer | `EscrowTransaction[]` | My escrows |
| GET | `/buyer/recommendations` | Yes | buyer | `Property[]` | AI recommendations (simple: random from different listings) |

### Seller-specific
| GET | `/seller/listings` | Yes | seller | `Property[]` | My listings with stats |
| GET | `/seller/inquiries` | Yes | seller | `[{id, name, email, property_title, message, created_at}]` | Inquiries on my listings |
| GET | `/seller/analytics` | Yes | seller | `{total_views, total_inquiries, listing_count, est_value}` | Aggregate stats |

### Landlord-specific
| GET | `/landlord/units` | Yes | landlord | `RentalUnit[]` | My units |
| GET | `/landlord/tenants` | Yes | landlord | `Tenant[]` | My tenants |
| GET | `/landlord/maintenance` | Yes | landlord | `MaintenanceRequest[]` | Maintenance on my units |
| GET | `/landlord/collections` | Yes | landlord | `{monthly_income, collection_rate, ...}` | Rent collection summary |

### Tenant-specific
| GET | `/tenant/receipts` | Yes | tenant | `RentReceipt[]` | My rent receipts |
| GET | `/tenant/maintenance` | Yes | tenant | `MaintenanceRequest[]` | My maintenance requests |
| POST | `/tenant/maintenance` | Yes | tenant | `MaintenanceRequest` | Submit maintenance request |
| POST | `/tenant/pay-rent` | Yes | tenant | `{message, receipt}` | Pay rent (simulated) |

### Agent-specific
| GET | `/agent/leads` | Yes | agent | `Lead[]` | My leads |
| PUT | `/agent/leads/{id}` | Yes | agent | `Lead` | Update lead status |
| GET | `/agent/commissions` | Yes | agent | `Commission[]` | My commissions |

---

### 6. Messages — `/api/messages`

| Method | Path | Auth | Request Body | Response | Notes |
|---|---|---|---|---|---|
| GET | `/` | Yes | `?with_user_id` (optional) | `Message[]` | My conversations / thread |
| GET | `/conversations` | Yes | — | `[{user, last_message, unread_count}]` | List conversations |
| POST | `/` | Yes | `{receiver_id, subject, content}` | `Message` | Send message |
| PUT | `/{id}/read` | Yes | — | `{message}` | Mark as read |
| PUT | `/read-all` | Yes | — | `{message}` | Mark all as read |
| DELETE | `/{id}` | Yes | — | `{message}` | Delete message |

---

### 7. Notifications — `/api/notifications`

| Method | Path | Auth | Response | Notes |
|---|---|---|---|---|
| GET | `/` | Yes | `{items: Notification[], unread_count}` | My notifications (paginated) |
| PUT | `/{id}/read` | Yes | `{message}` | Mark one as read |
| PUT | `/read-all` | Yes | `{message}` | Mark all as read |

---

### 8. Escrow — `/api/escrow`

| Method | Path | Auth | Request Body | Response | Notes |
|---|---|---|---|---|---|
| POST | `/` | Yes | `{property_id, amount}` | `EscrowTransaction` | Create escrow |
| GET | `/my` | Yes | — | `EscrowTransaction[]` | My escrow transactions |
| GET | `/{id}` | Yes | — | `EscrowTransaction` | Get escrow detail |

---

### 9. Rental Units — `/api/rental`

| Method | Path | Auth | Request Body | Response | Notes |
|---|---|---|---|---|---|
| POST | `/units` | Yes | `{title, address, ...}` | `RentalUnit` | Add unit (landlord only) |
| PUT | `/units/{id}` | Yes | `{...}` | `RentalUnit` | Update unit |
| DELETE | `/units/{id}` | Yes | — | `{message}` | Remove unit |
| POST | `/tenants` | Yes | `{unit_id, name, email, ...}` | `Tenant` | Add tenant |
| PUT | `/tenants/{id}` | Yes | `{...}` | `Tenant` | Update tenant |

---

### 10. Maintenance — `/api/maintenance`

| Method | Path | Auth | Request Body | Response | Notes |
|---|---|---|---|---|---|
| POST | `/` | Yes | `{unit_id, title, description, priority}` | `MaintenanceRequest` | Submit request |
| GET | `/my` | Yes | — | `MaintenanceRequest[]` | My requests (tenant) |
| GET | `/unit/{unit_id}` | Yes | — | `MaintenanceRequest[]` | Requests for a unit (landlord) |
| PUT | `/{id}/status` | Yes | `{status}` | `MaintenanceRequest` | Update status |

---

### 11. Blog — `/api/blog`

| Method | Path | Auth | Response | Notes |
|---|---|---|---|---|
| GET | `/` | No | `BlogPost[]` | All posts |
| GET | `/{slug}` | No | `BlogPost` | Single post |

> Blog can stay as hardcoded dummy data in the backend, or be stored in a simple table.

---

## Authentication Flow

1. `POST /api/auth/register` or `POST /api/auth/login` returns:
```json
{
  "user": { "id": "...", "email": "...", "full_name": "...", "role": "buyer", ... },
  "access_token": "eyJ...",
  "refresh_token": "eyJ..."
}
```
2. Access token: short-lived (15 min), sent as `Authorization: Bearer <token>`
3. Refresh token: long-lived (7 days), used at `POST /api/auth/refresh`
4. `GET /api/auth/me` is called on app load to validate the stored token

### JWT Payload
```json
{
  "sub": "user-uuid",
  "email": "buyer@vestra.com",
  "role": "buyer",
  "exp": 1234567890
}
```

---

## Role-Based Access Control

Add a dependency in `core/deps.py`:

```python
from fastapi import Depends, HTTPException, status
from app.core.security import decode_token

async def get_current_user(token: str = Depends(oauth2_scheme), db = Depends(get_db)):
    payload = decode_token(token)
    user = await db.get(User, payload["sub"])
    if not user or not user.is_active:
        raise HTTPException(status_code=401)
    return user

def require_role(*roles: str):
    async def checker(user = Depends(get_current_user)):
        if user.role not in roles:
            raise HTTPException(status_code=403, detail="Insufficient permissions")
        return user
    return checker

# Usage in routers:
@router.post("/properties")
async def create_property(data: PropertyCreate, user = Depends(require_role("seller", "agent", "admin"))):
    ...
```

| Role | Permissions |
|---|---|
| buyer | Browse, save favorites, create escrows, send inquiries, view own dashboard |
| seller | CRUD own listings, view inquiries, view seller dashboard |
| landlord | CRUD units, manage tenants, view landlord dashboard |
| tenant | View receipts, pay rent, submit maintenance, view tenant dashboard |
| agent | CRUD listings, manage leads, view commissions, view agent dashboard |
| admin | Full access to all resources, user management |

---

## CORS Configuration

```python
# main.py
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5199"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## Seed Data

On first startup, run a seed script that creates:

- **6 demo users** (one per role, password: `password`)
- **3 demo agents** linked to agent users
- **12 demo properties** (matching the frontend dummy data)
- **Sample messages, notifications, escrows, rentals**

This way the frontend dummy data and backend seed data are consistent.

---

## Implementation Order

1. `core/config.py` — settings via pydantic-settings (`.env`)
2. `core/database.py` — async SQLAlchemy engine + session factory
3. `core/security.py` — JWT helpers + password hashing
4. All models in `models/`
5. All schemas in `schemas/`
6. `core/deps.py` — `get_db`, `get_current_user`, `require_role`
7. Routers in order: auth → properties → agents → dashboard → escrow → messages → notifications → rental → maintenance
8. `main.py` — mount all routers, CORS, startup event (create tables)
9. Seed script `scripts/seed.py`
10. `alembic init` + initial migration
