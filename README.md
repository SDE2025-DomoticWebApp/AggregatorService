# Aggregator Service

## Overview

Protected gateway providing authenticated users access to dashboard and sensor data. Acts as a facade layer aggregating data from Internal Data Adapter. All endpoints require JWT authentication.

**Port:** 3004 | **Auth Required:** Yes (JWT)

## Architecture Position

```
Home Health Report Service / Web GUI
              ↓
    AggregatorService (THIS SERVICE)
              ↓
      Internal Data Adapter
```

## Configuration

**.env**
```env
PORT=3004
JWT_SECRET=super-secret-key
DATA_ADAPTER_URL=http://localhost:3001
```

⚠️ **JWT_SECRET must match AuthService**

## API Endpoints

### Dashboard
**GET /dashboard**
```http
Authorization: Bearer <JWT_TOKEN>
```

**Response:**
```json
{
  "user": {
    "email": "user@example.com",
    "name": "John",
    "surname": "Doe"
  },
  "sensors": [
    {
      "id": 1,
      "user_email": "user@example.com",
      "type": "temperature",
      "name": "Living Room Sensor",
      "url": "living-room-temp"
    }
  ]
}
```

**Response Codes:**
- `200` - Success
- `401` - Missing/invalid/expired token
- `500` - Server error

### Health
**GET /health** - Service health check (no auth required)

## Authentication

**Required Header:**
```http
Authorization: Bearer <JWT_TOKEN>
```

**Authentication Errors:**
- Missing Authorization header → `401`
- Invalid format (not "Bearer <token>") → `401`
- Invalid/expired token → `401`

## Authentication Middleware

Global middleware that:
1. Extracts JWT from Authorization header
2. Verifies token with JWT_SECRET
3. Attaches user info to `req.user`
4. Rejects invalid/missing tokens

## Quick Start

```bash
npm install
npm run dev  # Development mode (port 3004)
```

## Tech Stack

Node.js, Express.js, JWT (jsonwebtoken), axios

## Service Dependencies

**Consumed by:** Home Health Report Service, Web GUI

**Depends on:** Internal Data Adapter, AuthService (for JWT tokens)

## Complete Flow Example

```bash
# 1. Login to get token
TOKEN=$(curl -s -X POST http://localhost:3002/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"pass123"}' \
  | jq -r '.token')

# 2. Access dashboard
curl -X GET http://localhost:3004/dashboard \
  -H "Authorization: Bearer $TOKEN"
```

## Security Features

- JWT verification on all protected endpoints
- User identity from token (prevents unauthorized access)
- Token expiration handling
- Signature verification with shared secret

## Future Endpoints (Planned)

- `GET /sensors/:sensorId/measures` - Get sensor measurements
- `GET /sensors/:sensorId/latest` - Latest measurement
- `POST /sensors` - Create sensor
- `DELETE /sensors/:sensorId` - Delete sensor
- `GET /analytics/summary` - Aggregated statistics

## Testing

```bash
# Test without token (should fail)
curl -X GET http://localhost:3004/dashboard

# Test with token
curl -X GET http://localhost:3004/dashboard \
  -H "Authorization: Bearer YOUR_TOKEN"
```
