# Aggregator Service

Authenticated gateway that exposes read-only user data by aggregating Internal Data Adapter responses.

**Port:** 3004  
**Auth:** JWT required for all routes except `/health`

## Configuration

`.env`
```
PORT=3004
JWT_SECRET=super-secret-key
DATA_ADAPTER_URL=http://localhost:3001
```

`JWT_SECRET` must match `AuthenticationService` (and any service that verifies tokens).

## API

### `GET /dashboard`
Returns user info from the JWT and the user's sensors.

### `GET /sensors/:id/measures`
Returns measures for a sensor owned by the authenticated user.

### `GET /health`
Service health check.

## Run

```
npm install
npm run dev
```

## Dependencies

- Internal Data Adapter
- AuthenticationService (shared JWT secret)
