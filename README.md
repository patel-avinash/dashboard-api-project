# Dashboard API Project

This project is a small full-stack dashboard application built with:

- `Django` + `Django REST Framework` for the backend API
- `React` + `Vite` for the frontend UI
- `Chart.js` via `react-chartjs-2` for data visualization

The dashboard fetches external data, transforms it on the backend, and renders:

- key metrics
- charts
- recent activity
- loading, empty, and error states

## Features

- Fetches user data from `dummyjson`
- Fetches product data from `fakestoreapi`
- Aggregates backend data into a frontend-friendly dashboard response
- Displays:
  - Total Users
  - Total Sales
  - User Growth
  - Sales Figures
  - Recent Activity
- Handles:
  - loading state
  - error state
  - empty state
  - retry flow on API failure

## Project Structure

```text
Dashboard_api/
|-- backend/
|   |-- core/
|   |   |-- settings.py
|   |   |-- urls.py
|   |
|   |-- dashboard/
|   |   |-- views.py
|   |   |-- urls.py
|   |
|   |-- manage.py
|
|-- frontend/
|   |-- src/
|   |   |-- components/
|   |   |   |-- Charts.jsx
|   |   |   |-- ErrorMessage.jsx
|   |   |   |-- Loader.jsx
|   |   |   |-- MetricsCards.jsx
|   |   |   |-- RecentActivity.jsx
|   |   |
|   |   |-- pages/
|   |   |   |-- Dashboard.jsx
|   |   |
|   |   |-- index.css
|   |   |-- App.jsx
|   |   |-- main.jsx
|   |
|   |-- package.json
|
|-- README.md
```

## Setup Instructions

### 1. Clone the project

```bash
git clone <your-repo-url>
cd Dashboard_api
```

### 2. Backend setup

Move into the backend directory:

```bash
cd backend
```

Create and activate a virtual environment:

```bash
python -m venv venv
venv\Scripts\activate
```

Install backend dependencies:

```bash
pip install django djangorestframework django-cors-headers requests
```

Run the backend server:

```bash
python manage.py runserver
```

Backend will run at:

```text
http://127.0.0.1:8000/
```

Dashboard API endpoint:

```text
http://127.0.0.1:8000/api/dashboard/
```

### 3. Frontend setup

Open a new terminal and move into the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Run the frontend:

```bash
npm run dev
```

Frontend will usually run at:

```text
http://127.0.0.1:5173/
```

### 4. Production build

To verify the frontend build:

```bash
npm run build
```

## API Response Shape

The backend exposes a single dashboard endpoint that returns aggregated data:

```json
{
  "success": true,
  "data": {
    "total_users": 0,
    "total_sales": 0,
    "user_growth": {
      "labels": [],
      "values": []
    },
    "sales_data": {
      "labels": [],
      "values": []
    },
    "recent_activity": []
  }
}
```

## Architecture Explanation

### Backend

The backend acts as an aggregation layer between the frontend and external APIs.

Responsibilities:

- fetch data from external services
- handle request failures
- transform raw API data into dashboard-ready structures
- return a single normalized response to the frontend

Current data sources:

- `https://dummyjson.com/users`
- `https://fakestoreapi.com/products`

Current backend flow in [views.py](/e:/Dashboard_api/backend/dashboard/views.py):

1. Fetch users data
2. Fetch products data
3. Compute:
   - total user count
   - total sales sum
   - transformed user growth dataset
   - transformed sales dataset
   - recent activity list
4. Return a single JSON response

Why this is useful:

- the frontend stays simpler
- chart data formatting is centralized
- API failures can be handled consistently

### Frontend

The frontend is component-based.

Main page:

- [Dashboard.jsx](/e:/Dashboard_api/frontend/src/pages/Dashboard.jsx)

Responsibilities:

- trigger async API fetch on mount
- manage `loading`, `error`, and `empty` states
- render dashboard content when data is available

UI components:

- [MetricsCards.jsx](/e:/Dashboard_api/frontend/src/components/MetricsCards.jsx)
  - displays total users and total sales
- [Charts.jsx](/e:/Dashboard_api/frontend/src/components/Charts.jsx)
  - renders user growth and sales charts
- [RecentActivity.jsx](/e:/Dashboard_api/frontend/src/components/RecentActivity.jsx)
  - renders the recent activity table
- [Loader.jsx](/e:/Dashboard_api/frontend/src/components/Loader.jsx)
  - renders the loading state
- [ErrorMessage.jsx](/e:/Dashboard_api/frontend/src/components/ErrorMessage.jsx)
  - renders a friendly error state with retry action

### State Management Approach

The frontend uses local React state with `useState` and `useEffect`.

Managed states:

- `loading`
- `error`
- `data`
- retry trigger

This is sufficient for the current dashboard because:

- the app has a single main data request
- state is localized to one page
- no global store is required

## Asynchronous State Handling

The dashboard explicitly handles three major async UI states:

### Loading state

Before data arrives:

- show a loader
- avoid rendering partial dashboard UI

### Error state

If the backend or external APIs fail:

- show a friendly error card
- avoid exposing raw low-level exceptions in the UI
- allow the user to retry

Example cases:

- internet is off
- external API DNS resolution fails
- external API times out

### Empty state

If the API succeeds but no usable dashboard data exists:

- show a clear empty state message
- avoid rendering broken or blank charts/tables

## Assumptions Made

### 1. External APIs are acceptable for dashboard data

The project requirement allows `mock or real API`, so the implementation uses public external APIs as data sources.

### 2. Backend should aggregate data

Instead of calling both external APIs directly from the frontend, the backend combines and transforms them into one response.

This assumption improves:

- separation of concerns
- reuse
- frontend simplicity
- consistent error handling

### 3. Sales figures are derived from product prices

`fakestoreapi` does not provide real transactional sales records, so total sales are approximated by summing product prices.

### 4. User growth is derived from available user data

The users source does not provide a true business signup history or guaranteed onboarding timeline.

Because of that, the `user_growth` chart is based on transformed user data rather than a real historical registration series.

If a true yearly growth chart is required, the backend should use a source that includes:

- `created_at`
- `joined_at`
- signup timestamp

### 5. Recent activity is represented by recent users

Since the users API does not expose a real event feed, the first few user records are used as a reasonable proxy for recent activity.

### 6. CORS is open for development

`CORS_ALLOW_ALL_ORIGINS = True` is used for local development convenience.

This should be restricted in production.

## Known Limitations

- The dashboard depends on third-party public APIs
- If internet access is unavailable, the backend cannot fetch external data
- Public APIs may change shape or availability
- The project currently uses simple local state instead of a data-fetching library like React Query
- The backend environment must include `django-cors-headers`

## Future Improvements

- add backend caching
- add unit tests for transformation logic
- add integration tests for the dashboard endpoint
- introduce typed API contracts
- use environment variables for API base URLs
- add fallback mock data when external APIs are unavailable

## Summary

This project demonstrates:

- component-based frontend structure
- backend aggregation of multiple APIs
- asynchronous state handling
- error, loading, and empty state UX
- chart rendering with transformed API data

It is a solid base for the problem statement and can be extended further with stronger data sources and tests.
