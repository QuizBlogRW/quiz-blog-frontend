# Quiz Blog Client-Backend Integration

## 🚀 Quick Start Guide

This guide helps you run the React client with the microservices backend locally.

### Prerequisites
- Node.js 18+
- Docker and Docker Compose
- Ports available: 3000, 5000, 5001, 5002, 5003, 5000, 6379, 27017

### Option 1: Automated Setup (Recommended)

```bash
# Start everything with one command
npm run start:integration
```

This script will:
- ✅ Check port availability
- ✅ Start MongoDB and Redis
- ✅ Start API Gateway and core microservices
- ✅ Start React client with hot reload
- ✅ Wait for all services to be ready

### Option 2: Manual Setup

#### Step 1: Start Backend Services
```bash
# Start backend infrastructure
npm run backend:start

# Wait for services to be ready (about 30 seconds)
npm run backend:logs
```

#### Step 2: Start React Client
```bash
# In a new terminal
npm start
```

### Option 3: Docker Development Setup

```bash
# Use the integrated docker-compose
docker-compose -f docker-compose.dev.yml up --build
```

## 🔧 Configuration

### Environment Variables

The client automatically uses environment-specific configuration:

**Development (.env.development):**
- API Gateway: `http://localhost:5000`
- Socket.io: `http://localhost:5000`
- Debug mode: Enabled

**Production (.env.production):**
- API Gateway: `https://qb-api-gateway-faaa805537e5.herokuapp.com`
- Socket.io: `https://qb-contacts-service-156b2230ac4f.herokuapp.com`
- Debug mode: Disabled

### Service URLs
- **React Client**: http://localhost:3000
- **API Gateway**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health
- **Users Service**: http://localhost:5001
- **Quizzing Service**: http://localhost:5002
- **Posts Service**: http://localhost:5003
- **Contacts Service** (Socket.io): http://localhost:5000

## 🛠️ Development Features

### API Request Debugging
Set `VITE_DEBUG=true` in `.env.development` to see all API requests in the browser console.

### Hot Reloading
- **Frontend**: Vite provides instant hot module replacement
- **Backend**: Docker services restart automatically on code changes

### Cache Management
The API Gateway includes Redis caching for better performance.

## 🐳 Backend Services

### Core Services (Always needed)
- **MongoDB**: Database storage
- **Redis**: Caching layer
- **API Gateway**: Central routing and caching
- **Users Service**: Authentication and user management
- **Contacts Service**: Socket.io real-time features

### Optional Services
- **Quizzing Service**: Quiz functionality
- **Posts Service**: Blog posts and content
- **Schools Service**: School management
- **Courses Service**: Course content
- **Scores Service**: Quiz scoring
- **Downloads Service**: File management
- **Feedbacks Service**: User feedback
- **Comments Service**: Comments system
- **Statistics Service**: Analytics

## 📊 Monitoring

### Health Checks
```bash
# Check API Gateway health
curl http://localhost:5000/api/health

# Check service status
curl http://localhost:5000/api/services/status
```

### Logs
```bash
# View all backend logs
npm run backend:logs

# View specific service logs
docker logs qb-api-gateway
docker logs qb-users-service
```

## 🔧 Troubleshooting

### Common Issues

1. **Port Conflicts**
   ```bash
   # Check what's using a port
   lsof -i :5000
   
   # Kill process using port
   kill -9 $(lsof -t -i:5000)
   ```

2. **MongoDB Connection Issues**
   ```bash
   # Restart MongoDB
   docker restart qb-mongodb
   
   # Check MongoDB logs
   docker logs qb-mongodb
   ```

3. **API Gateway Not Responding**
   ```bash
   # Restart API Gateway
   docker restart qb-api-gateway
   
   # Check API Gateway logs
   docker logs qb-api-gateway
   ```

4. **Client Build Issues**
   ```bash
   # Clear node_modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

### Debug Mode
Enable debugging by setting `VITE_DEBUG=true` in your environment file to see:
- 🚀 Outgoing API requests
- ✅ Successful API responses  
- ❌ API errors with details
- 🔌 Socket.io connection status

## 🛑 Stopping Services

### Stop Everything
```bash
npm run backend:stop
# Then stop React client with Ctrl+C
```

### Stop Individual Services
```bash
# Stop specific service
docker stop qb-api-gateway

# Restart specific service  
docker restart qb-users-service
```

## 📋 Development Workflow

1. **Make Backend Changes**: Services auto-restart in Docker
2. **Make Frontend Changes**: Vite hot-reloads automatically  
3. **Add New Environment Variables**: Restart both client and backend
4. **Database Changes**: Use MongoDB Compass or CLI tools

## 🚀 Production Deployment

For production deployment, use the production environment variables and build the client:

```bash
npm run build
npm run serve
```

The built files will be in the `build/` directory, ready for deployment to any static hosting service.
