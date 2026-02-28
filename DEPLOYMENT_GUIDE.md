# 🚀 NURTURE MINDS - PRODUCTION DEPLOYMENT GUIDE

## **📋 DEPLOYMENT CHECKLIST**

### **✅ Pre-Deployment Setup**
- [ ] Environment variables configured
- [ ] Database connections tested
- [ ] AI models loaded and tested
- [ ] Frontend build successful
- [ ] Security headers configured
- [ ] SSL certificates ready
- [ ] Domain DNS configured

---

## **🐳 DOCKER DEPLOYMENT (RECOMMENDED)**

### **1. Backend Docker Configuration**

Create `backend/Dockerfile`:
```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    libgomp1 \
    libgtk-3-0 \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for better caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Run application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "4"]
```

### **2. Frontend Docker Configuration**

Create `frontend/Dockerfile`:
```dockerfile
# Multi-stage build for optimization
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=deps --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --chown=nextjs:nodejs package*.json ./

USER nextjs

EXPOSE 3000
ENV PORT 3000

CMD ["npm", "start"]
```

### **3. Docker Compose Configuration**

Create `docker-compose.yml`:
```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:6.0
    container_name: nurture_mongodb
    restart: unless-stopped
    environment:
      MONGO_INITDB_ROOT_USERNAME: ${MONGO_ROOT_USERNAME}
      MONGO_INITDB_ROOT_PASSWORD: ${MONGO_ROOT_PASSWORD}
      MONGO_INITDB_DATABASE: ${MONGO_DATABASE}
    volumes:
      - mongodb_data:/data/db
      - ./backend/init-mongo.js:/docker-entrypoint-initdb.d/init-mongo.js:ro
    networks:
      - nurture_network
    healthcheck:
      test: ["CMD", "mongosh", "--eval", "db.adminCommand('ping')"]
      interval: 30s
      timeout: 10s
      retries: 5

  backend:
    build: ./backend
    container_name: nurture_backend
    restart: unless-stopped
    environment:
      - DATABASE_URL=mongodb://mongodb:27017/${MONGO_DATABASE}
      - JWT_SECRET=${JWT_SECRET}
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - ENVIRONMENT=production
    ports:
      - "8000:8000"
    depends_on:
      mongodb:
        condition: service_healthy
    networks:
      - nurture_network
    volumes:
      - ./uploads:/app/uploads
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 30s
      timeout: 10s
      retries: 5

  frontend:
    build: ./frontend
    container_name: nurture_frontend
    restart: unless-stopped
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:8000
      - NODE_ENV=production
    ports:
      - "3000:3000"
    depends_on:
      backend:
        condition: service_healthy
    networks:
      - nurture_network

  nginx:
    image: nginx:alpine
    container_name: nurture_nginx
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - frontend
      - backend
    networks:
      - nurture_network

networks:
  nurture_network:
    driver: bridge

volumes:
  mongodb_data:
```

---

## **🌐 NGINX CONFIGURATION**

Create `nginx.conf`:
```nginx
events {
    worker_connections 1024;
}

http {
    upstream frontend {
        server frontend:3000;
    }
    
    upstream backend {
        server backend:8000;
    }

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=general:10m rate=50r/s;

    server {
        listen 80;
        server_name your-domain.com www.your-domain.com;
        
        # Redirect HTTP to HTTPS
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name your-domain.com www.your-domain.com;

        # SSL Configuration
        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;
        ssl_session_timeout 1d;
        ssl_session_cache shared:SSL:50m;
        ssl_session_tickets off;

        # Security headers
        add_header X-Frame-Options DENY;
        add_header X-Content-Type-Options nosniff;
        add_header X-XSS-Protection "1; mode=block";
        add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload";

        # API routes
        location /api/ {
            limit_req zone=api burst=20 nodelay;
            proxy_pass http://backend/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            
            # WebSocket support
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
        }

        # Frontend routes
        location / {
            limit_req zone=general burst=100 nodelay;
            proxy_pass http://frontend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # File uploads
        location /uploads/ {
            client_max_body_size 100M;
            proxy_pass http://backend/uploads/;
        }
    }
}
```

---

## **⚙️ ENVIRONMENT CONFIGURATION**

Create `.env.production`:
```env
# Database
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=your_secure_password_here
MONGO_DATABASE=nurture_minds

# JWT
JWT_SECRET=your_jwt_secret_here_minimum_32_characters
JWT_ALGORITHM=HS256
JWT_EXPIRE_HOURS=24

# AI/ML
OPENAI_API_KEY=your_openai_api_key_here

# Application
ENVIRONMENT=production
DEBUG=false
API_URL=https://your-domain.com/api
FRONTEND_URL=https://your-domain.com

# Security
CORS_ORIGINS=https://your-domain.com,https://www.your-domain.com
ALLOWED_HOSTS=your-domain.com,www.your-domain.com

# File Storage
MAX_UPLOAD_SIZE=100000000  # 100MB
ALLOWED_EXTENSIONS=mp4,avi,mov,wmv,jpg,jpeg,png

# Email (optional)
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your_email@domain.com
SMTP_PASSWORD=your_email_password
```

---

## **🚀 DEPLOYMENT COMMANDS**

### **1. Quick Deployment**
```bash
# Clone repository
git clone https://github.com/yourusername/nurture-minds.git
cd nurture-minds

# Set environment variables
cp .env.example .env.production
# Edit .env.production with your values

# Deploy with Docker Compose
docker-compose -f docker-compose.yml --env-file .env.production up -d

# Check status
docker-compose ps
docker-compose logs -f
```

### **2. Manual Setup (Alternative)**

**Backend Setup**:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

**Frontend Setup**:
```bash
cd frontend
npm install
npm run build
npm start
```

**Database Setup**:
```bash
# MongoDB installation and setup
docker run -d --name mongodb \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password \
  mongo:6.0
```

---

## **☁️ CLOUD DEPLOYMENT OPTIONS**

### **1. AWS Deployment**
- **ECS Fargate**: Containerized deployment
- **RDS MongoDB**: Managed database
- **CloudFront**: CDN for frontend
- **Route 53**: DNS management
- **Certificate Manager**: SSL certificates

### **2. Google Cloud Platform**
- **Cloud Run**: Serverless containers
- **Cloud MongoDB Atlas**: Managed database
- **Cloud CDN**: Content delivery
- **Cloud DNS**: DNS management
- **Cloud Load Balancing**: Traffic distribution

### **3. Heroku (Quick Start)**
```bash
# Install Heroku CLI
heroku create nurture-minds-backend
heroku create nurture-minds-frontend

# Backend deployment
cd backend
git init
heroku git:remote -a nurture-minds-backend
git add .
git commit -m "Deploy backend"
git push heroku main

# Frontend deployment
cd ../frontend
git init
heroku git:remote -a nurture-minds-frontend
git add .
git commit -m "Deploy frontend"
git push heroku main
```

---

## **🔧 MONITORING & MAINTENANCE**

### **Health Checks**
```bash
# Backend health
curl https://your-domain.com/api/health

# Frontend health
curl https://your-domain.com

# Database health
docker-compose exec mongodb mongosh --eval "db.adminCommand('ping')"
```

### **Log Monitoring**
```bash
# Real-time logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongodb

# System metrics
docker stats
```

### **Backup Strategy**
```bash
# Database backup
docker-compose exec mongodb mongodump --out /backup
docker cp nurture_mongodb:/backup ./backup

# Automated daily backups
0 2 * * * /path/to/backup-script.sh
```

---

## **🛡️ SECURITY CHECKLIST**

- [ ] **SSL/TLS certificates** installed and configured
- [ ] **Environment variables** secured (not in code)
- [ ] **Database credentials** rotated regularly
- [ ] **API rate limiting** configured
- [ ] **CORS origins** restricted to production domains
- [ ] **Security headers** implemented
- [ ] **File upload restrictions** enforced
- [ ] **User authentication** with JWT tokens
- [ ] **Data encryption** at rest and in transit
- [ ] **Regular security updates** scheduled

---

## **📊 PERFORMANCE OPTIMIZATION**

### **Frontend Optimization**
- **Static generation** for marketing pages
- **Image optimization** with Next.js
- **Code splitting** for faster loading
- **CDN deployment** for global reach

### **Backend Optimization**
- **Database indexing** for query performance
- **Caching strategies** with Redis
- **Connection pooling** for database
- **API response compression**

### **Infrastructure Scaling**
- **Horizontal scaling** with load balancers
- **Auto-scaling** based on CPU/memory
- **Database read replicas** for performance
- **CDN caching** for static assets

---

## **🎯 GO-LIVE CHECKLIST**

### **Final Steps**
1. [ ] **Domain configured** and DNS propagated
2. [ ] **SSL certificates** installed and verified
3. [ ] **Environment variables** set correctly
4. [ ] **Database migrations** completed
5. [ ] **Health checks** passing
6. [ ] **Monitoring** systems active
7. [ ] **Backup systems** tested
8. [ ] **Performance testing** completed
9. [ ] **Security scanning** passed
10. [ ] **Documentation** updated

### **Launch Commands**
```bash
# Final deployment
docker-compose -f docker-compose.yml --env-file .env.production up -d

# Verify all services
docker-compose ps
curl -f https://your-domain.com/api/health
curl -f https://your-domain.com

# Monitor launch
docker-compose logs -f
```

**🚀 YOUR HACKATHON-WINNING PLATFORM IS NOW LIVE! 🏆**

Access your deployed application at: **https://your-domain.com**

---

## **📞 SUPPORT & TROUBLESHOOTING**

### **Common Issues**
- **Database connection errors**: Check MongoDB credentials
- **CORS errors**: Verify allowed origins in environment
- **File upload failures**: Check permissions and size limits
- **SSL certificate errors**: Verify certificate installation

### **Useful Commands**
```bash
# Restart services
docker-compose restart

# View logs
docker-compose logs backend
docker-compose logs frontend

# Database shell access
docker-compose exec mongodb mongosh

# Container shell access
docker-compose exec backend bash
docker-compose exec frontend sh
```

**Ready to change the world of neurodivergent support! 🌟**