# Aggregator Service

Authenticated gateway that exposes read-only user data by aggregating Internal Data Adapter responses.

**Port:** 3004  
**Auth:** JWT required for all routes except `/health`

## Configuration

Create `.env` from `.env.example`:
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
Supports optional `from`/`to` query params for range filtering.

### `GET /health`
Service health check.


## JSON Examples

### `GET /dashboard`
```json
{
  "user": {
    "email": "user@example.com",
    "name": "John",
    "surname": "Doe"
  },
  "sensors": [
    {
      "id": 3,
      "user_email": "user@example.com",
      "type": "temperature",
      "name": "Living Room",
      "secret_hash": "<bcrypt-hash>"
    }
  ]
}
```

### `GET /sensors/:id/measures`
```json
[
  {
    "id": 10,
    "sensor_id": 3,
    "timestamp": "2026-02-18T12:00:00Z",
    "value": { "temperature": 21.4 }
  }
]
```

## Run

```
npm install
npm run dev
```

## Dependencies

- Internal Data Adapter
- AuthenticationService (shared JWT secret)
