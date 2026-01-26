# Aggregator Service

## Overview

The Aggregator Service is a protected gateway that provides authenticated users with access to their dashboard and sensor data. It acts as a facade layer, aggregating data from the Internal Data Adapter and presenting it in a user-friendly format. All endpoints require JWT authentication.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Authentication**: JSON Web Tokens (JWT)
- **HTTP Client**: axios
- **Type**: CommonJS

## Architecture

The service follows a layered architecture:
- **Middleware Layer**: JWT authentication verification
- **Routes Layer**: HTTP endpoint definitions
- **Service Layer**: Business logic for data aggregation
- **Client Layer**: Communication with Internal Data Adapter

## Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3004
JWT_SECRET=super-secret-key
DATA_ADAPTER_URL=http://localhost:3001
```

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| PORT | Port number for the service | 3004 | No |
| JWT_SECRET | Secret key for verifying JWT tokens (must match Auth Service) | - | Yes |
| DATA_ADAPTER_URL | Base URL of Internal Data Adapter | - | Yes |

**Important**: The `JWT_SECRET` must be **identical** to the one used by the Auth Service.

## Authentication

All endpoints (except `/health`) require JWT authentication.

### Authentication Header Format
```http
Authorization: Bearer <JWT_TOKEN>
```

### Example
```bash
curl -X GET http://localhost:3004/dashboard \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Authentication Errors

**Missing Authorization Header:**
```json
{
  "error": "Missing Authorization header"
}
```
Status: `401 Unauthorized`

**Invalid Authorization Format:**
```json
{
  "error": "Invalid Authorization format"
}
```
Status: `401 Unauthorized`

**Invalid or Expired Token:**
```json
{
  "error": "Invalid or expired token"
}
```
Status: `401 Unauthorized`

## API Endpoints

### Dashboard

#### Get User Dashboard
```http
GET /dashboard
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
    },
    {
      "id": 2,
      "user_email": "user@example.com",
      "type": "humidity",
      "name": "Bathroom Humidity",
      "url": "bathroom-humidity"
    }
  ]
}
```

**Status Codes:**
- `200 OK` - Dashboard data retrieved successfully
- `401 Unauthorized` - Missing, invalid, or expired JWT token
- `500 Internal Server Error` - Server error

**Description:**
Returns the authenticated user's profile information and all their registered sensors. The user information is extracted from the JWT token payload, while sensors are fetched from the Internal Data Adapter.

**Example Usage:**
```bash
# First, login to get a token
TOKEN=$(curl -s -X POST http://localhost:3002/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"mypassword"}' \
  | jq -r '.token')

# Then, get the dashboard
curl -X GET http://localhost:3004/dashboard \
  -H "Authorization: Bearer $TOKEN"
```

---

### Health Check

#### Check Service Health
```http
GET /health
```

**Response:**
```json
{
  "status": "ok"
}
```

**Status Codes:**
- `200 OK` - Service is running

**Note**: This endpoint does NOT require authentication.

## Authentication Middleware

The service uses a global authentication middleware that:
1. Extracts the JWT token from the `Authorization` header
2. Verifies the token signature using `JWT_SECRET`
3. Decodes the token payload
4. Attaches user information to `req.user` for use in route handlers
5. Rejects requests with invalid or missing tokens

### JWT Token Payload
The middleware expects tokens with this structure:
```json
{
  "email": "user@example.com",
  "name": "John",
  "surname": "Doe",
  "iat": 1640000000,
  "exp": 1640086400
}
```

After verification, this information is available in route handlers via `req.user`.

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm
- Internal Data Adapter must be running
- Auth Service must be running (to obtain JWT tokens)

### Install Dependencies
```bash
npm install
```

### Configure Environment
Create a `.env` file with the required variables (see Configuration section).

**Critical**: Ensure `JWT_SECRET` matches the Auth Service configuration.

### Run the Service

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The service will start on port 3004 (or the port specified in the PORT environment variable).

## Project Structure

```
AggregatorService/
├── src/
│   ├── clients/
│   │   └── dataAdapter.client.js   # HTTP client for Internal Data Adapter
│   ├── config/
│   │   └── config.js               # Configuration management
│   ├── middleware/
│   │   └── auth.middleware.js      # JWT authentication middleware
│   ├── routes/
│   │   ├── dashboard.routes.js     # Dashboard endpoints
│   │   └── sensors.routes.js       # Sensor endpoints (future)
│   ├── services/
│   │   ├── dashboard.service.js    # Dashboard business logic
│   │   └── sensors.service.js      # Sensor business logic (future)
│   └── app.js                      # Express application setup
├── .env                            # Environment variables (not in git)
├── .gitignore
├── package.json
└── README.md
```

## Dependencies

### Production Dependencies
- `axios` (v1.13.2): HTTP client for service communication
- `dotenv` (v17.2.3): Environment variable management
- `express` (v5.2.1): Web framework
- `jsonwebtoken` (v9.0.3): JWT token verification

### Development Dependencies
- `nodemon` (v3.1.11): Auto-reload during development

## Service Dependencies

This service depends on:
- **Auth Service** (port 3002): For JWT token issuance (indirectly)
- **Internal Data Adapter** (port 3001): For sensor and measurement data

This service is consumed by:
- Client applications (web, mobile) for accessing user-specific data

## Complete User Flow

### 1. User Registration
```bash
curl -X POST http://localhost:3003/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "name": "John",
    "surname": "Doe",
    "password": "securepass123"
  }'
```

### 2. User Login
```bash
TOKEN=$(curl -s -X POST http://localhost:3002/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"securepass123"}' \
  | jq -r '.token')
```

### 3. Access Dashboard
```bash
curl -X GET http://localhost:3004/dashboard \
  -H "Authorization: Bearer $TOKEN"
```

## Data Aggregation Logic

### Dashboard Service
The dashboard service performs the following operations:
1. Extracts user email from JWT payload (via `req.user`)
2. Queries Internal Data Adapter for all sensors owned by the user
3. Combines user information (from token) with sensor data (from database)
4. Returns formatted response

This aggregation reduces client complexity and centralizes data access logic.

## Security Considerations

### JWT Verification
- Tokens are verified on every request (except `/health`)
- Invalid tokens are immediately rejected
- Expired tokens are not accepted
- Token signature is verified using shared secret

### Data Access Control
- Users can only access their own data
- User identity is derived from JWT token, not request parameters
- This prevents unauthorized access to other users' data

### Best Practices
- Use HTTPS in production to prevent token interception
- Implement token refresh mechanism for long-lived sessions
- Add request logging for audit trails
- Consider implementing rate limiting
- Regularly rotate JWT_SECRET

## Error Handling

| Error Code | Message | Scenario |
|------------|---------|----------|
| 401 | Missing Authorization header | No Authorization header in request |
| 401 | Invalid Authorization format | Header is not "Bearer <token>" |
| 401 | Invalid or expired token | Token verification failed |
| 500 | Internal server error | Database or service error |

All error responses follow this format:
```json
{
  "error": "Error message description"
}
```

## Testing

### End-to-End Test Flow
```bash
# 1. Register a new user
curl -X POST http://localhost:3003/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test","surname":"User","password":"test123"}'

# 2. Login and get token
TOKEN=$(curl -s -X POST http://localhost:3002/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}' \
  | jq -r '.token')

# 3. Create a sensor (via Internal Data Adapter directly for testing)
curl -X POST http://localhost:3001/sensors \
  -H "Content-Type: application/json" \
  -d '{
    "userEmail": "test@example.com",
    "type": "temperature",
    "name": "Test Sensor",
    "url": "test-sensor"
  }'

# 4. Access dashboard
curl -X GET http://localhost:3004/dashboard \
  -H "Authorization: Bearer $TOKEN" | jq

# 5. Test without token (should fail)
curl -X GET http://localhost:3004/dashboard
```

## Future Enhancements

### Planned Endpoints
- `GET /sensors/:sensorId/measures` - Get measurements for a specific sensor
- `GET /sensors/:sensorId/latest` - Get latest measurement for a sensor
- `GET /sensors/:sensorId` - Get detailed sensor information
- `POST /sensors` - Create a new sensor
- `DELETE /sensors/:sensorId` - Delete a sensor
- `GET /analytics/summary` - Get aggregated statistics

### Additional Features
- Caching layer for frequently accessed data
- Real-time sensor updates via WebSockets
- Data export functionality
- Sensor sharing between users
- Alert/notification configuration
- Historical data analysis
- Sensor grouping and organization
- Custom dashboard layouts

### Performance Improvements
- Implement Redis caching
- Add database query optimization
- Implement pagination for large sensor lists
- Add compression for API responses

## Troubleshooting

### Common Issues

**Issue**: 401 Unauthorized on all requests
- **Solution**: Check if `JWT_SECRET` matches between Auth Service and Aggregator Service

**Issue**: Dashboard returns empty sensors array
- **Solution**: Verify sensors are associated with the correct user email in the database

**Issue**: 500 Internal Server Error
- **Solution**: Check if Internal Data Adapter is running and accessible

**Issue**: Token verification fails
- **Solution**: Ensure token is not expired; check token format in Authorization header

### Debug Tips
```bash
# Decode JWT token to inspect payload
echo "YOUR_TOKEN" | cut -d'.' -f2 | base64 -d | jq

# Check service connectivity
curl http://localhost:3001/health  # Data Adapter
curl http://localhost:3004/health  # Aggregator Service

# Test with verbose output
curl -v -X GET http://localhost:3004/dashboard \
  -H "Authorization: Bearer $TOKEN"
```

## Integration Architecture

```
Client Application
       ↓
   [Auth Flow]
       ↓
Auth Service (port 3002) ────→ Internal Data Adapter (port 3001)
       ↓                              ↑
   JWT Token                          │
       ↓                              │
Client Application                    │
       ↓                              │
Aggregator Service (port 3004) ──────┘
       ↓
Protected Data Response
```

## Monitoring and Logging

### Recommended Logging
- All authentication failures
- All successful authentications (with user email)
- All data access requests
- Performance metrics (response times)
- Error stack traces

### Health Monitoring
- Monitor `/health` endpoint for uptime
- Track response times for dashboard endpoint
- Monitor dependency service availability
- Set up alerts for authentication failures
