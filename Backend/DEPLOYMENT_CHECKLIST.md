# Production Deployment Checklist

## Pre-Deployment

### 1. Environment Configuration
- [ ] Create production `.env` file
- [ ] Set `NODE_ENV=production`
- [ ] Generate strong JWT secrets (use: `openssl rand -base64 32`)
- [ ] Configure production database credentials
- [ ] Set production CORS origins
- [ ] Configure production port
- [ ] Verify all required environment variables are set

### 2. Database Setup
- [ ] Create production PostgreSQL database
- [ ] Run schema migration: `psql -d dbname -f src/database/schemas/schema.sql`
- [ ] Create database user with appropriate permissions
- [ ] Enable SSL/TLS for database connections
- [ ] Configure connection pooling
- [ ] Set up database backups (automated)
- [ ] Create initial admin user with hashed password

### 3. Security Hardening
- [ ] Change default JWT secrets
- [ ] Enable Helmet.js for security headers
- [ ] Configure rate limiting
- [ ] Set up HTTPS/SSL certificates
- [ ] Disable database synchronization (`DB_SYNC=false`)
- [ ] Enable CORS only for trusted origins
- [ ] Remove or protect development endpoints
- [ ] Enable request logging
- [ ] Set up intrusion detection

### 4. Code Quality
- [ ] Run linter: `npm run lint`
- [ ] Fix all linting errors
- [ ] Run tests: `npm run test`
- [ ] Ensure all tests pass
- [ ] Run build: `npm run build`
- [ ] Verify build succeeds
- [ ] Check for unused dependencies
- [ ] Review security vulnerabilities: `npm audit`

### 5. Performance Optimization
- [ ] Enable production mode
- [ ] Configure compression middleware
- [ ] Set up Redis for caching (optional)
- [ ] Enable query result caching
- [ ] Optimize database indexes
- [ ] Configure connection pooling
- [ ] Set up CDN for static assets (if any)

## Deployment

### 6. Server Setup
- [ ] Provision production server (AWS, DigitalOcean, etc.)
- [ ] Install Node.js (v18+)
- [ ] Install PostgreSQL (v14+)
- [ ] Install PM2 or similar process manager
- [ ] Configure firewall rules
- [ ] Set up reverse proxy (Nginx/Apache)
- [ ] Configure SSL certificates (Let's Encrypt)
- [ ] Set up monitoring agent

### 7. Application Deployment
- [ ] Clone repository or upload build
- [ ] Install dependencies: `npm ci --production`
- [ ] Build application: `npm run build`
- [ ] Set up PM2 ecosystem file
- [ ] Start application: `pm2 start ecosystem.config.js`
- [ ] Configure PM2 startup script: `pm2 startup`
- [ ] Save PM2 configuration: `pm2 save`

### 8. Reverse Proxy Configuration (Nginx Example)
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.yourdomain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 9. PM2 Ecosystem Configuration
Create `ecosystem.config.js`:
```javascript
module.exports = {
  apps: [{
    name: 'te-management-api',
    script: './dist/main.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
```

## Post-Deployment

### 10. Verification
- [ ] Test health endpoint
- [ ] Test authentication flow
- [ ] Verify database connectivity
- [ ] Check CORS headers
- [ ] Test API endpoints with production data
- [ ] Verify error handling
- [ ] Check response times
- [ ] Verify SSL/HTTPS working
- [ ] Test from frontend application

### 11. Monitoring Setup
- [ ] Configure application monitoring (New Relic, Datadog, etc.)
- [ ] Set up error tracking (Sentry, Rollbar)
- [ ] Configure log aggregation (ELK Stack, Papertrail)
- [ ] Set up uptime monitoring (UptimeRobot, Pingdom)
- [ ] Configure alerts for:
  - Application crashes
  - High CPU/memory usage
  - Database connection errors
  - High error rates
  - Slow response times

### 12. Backup Configuration
- [ ] Set up automated database backups
- [ ] Configure backup retention policy
- [ ] Test backup restoration process
- [ ] Set up code repository backups
- [ ] Document backup procedures

### 13. Documentation
- [ ] Document deployment process
- [ ] Create runbook for common issues
- [ ] Document rollback procedure
- [ ] Create API documentation (Swagger/OpenAPI)
- [ ] Document environment variables
- [ ] Create incident response plan

## Security Checklist

### 14. Security Audit
- [ ] Review all authentication endpoints
- [ ] Verify role-based access controls
- [ ] Check for SQL injection vulnerabilities
- [ ] Verify XSS protection
- [ ] Check CSRF protection
- [ ] Review sensitive data exposure
- [ ] Verify password hashing strength
- [ ] Check for hardcoded secrets
- [ ] Review third-party dependencies
- [ ] Run security scan: `npm audit`

### 15. Access Control
- [ ] Set up SSH key-based authentication
- [ ] Disable password authentication
- [ ] Configure firewall rules
- [ ] Limit database access to application only
- [ ] Set up VPN for database access (optional)
- [ ] Configure IP whitelisting if needed
- [ ] Set up 2FA for critical accounts

## Maintenance

### 16. Regular Maintenance Tasks
- [ ] Schedule regular security updates
- [ ] Plan dependency updates
- [ ] Configure automated testing
- [ ] Set up CI/CD pipeline
- [ ] Schedule database maintenance windows
- [ ] Plan capacity monitoring
- [ ] Schedule log rotation

### 17. Scaling Preparation
- [ ] Document scaling strategy
- [ ] Identify bottlenecks
- [ ] Plan horizontal scaling approach
- [ ] Configure load balancer (if needed)
- [ ] Set up auto-scaling rules
- [ ] Plan database replication strategy
- [ ] Configure caching strategy

## Rollback Plan

### 18. Rollback Procedure
1. [ ] Document current version
2. [ ] Keep previous version accessible
3. [ ] Create database backup before deployment
4. [ ] Document rollback steps:
   ```bash
   # Stop current application
   pm2 stop te-management-api

   # Restore previous version
   git checkout <previous-tag>
   npm ci --production
   npm run build

   # Restore database if needed
   # psql -d dbname -f backup.sql

   # Restart application
   pm2 restart te-management-api
   ```

## Environment Variables Template

```env
# Application
NODE_ENV=production
PORT=3000
API_PREFIX=api
APP_NAME=TE Management Software

# Database
DB_HOST=your-db-host
DB_PORT=5432
DB_USERNAME=your-db-user
DB_PASSWORD=your-secure-password
DB_DATABASE=te_management_prod
DB_SYNC=false
DB_LOGGING=false
DB_SSL=true

# JWT
JWT_SECRET=your-super-secure-random-string-min-32-chars
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=another-super-secure-random-string-min-32-chars
JWT_REFRESH_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=https://your-frontend-domain.com
CORS_CREDENTIALS=true

# Rate Limiting
RATE_LIMIT_TTL=60
RATE_LIMIT_MAX=100

# Logging
LOG_LEVEL=info

# Monitoring (optional)
NEW_RELIC_LICENSE_KEY=your-key
SENTRY_DSN=your-dsn
```

## Success Criteria

Deployment is successful when:
- [ ] Application starts without errors
- [ ] All API endpoints respond correctly
- [ ] Authentication flow works
- [ ] Database queries execute successfully
- [ ] Frontend can communicate with backend
- [ ] Monitoring shows healthy metrics
- [ ] No errors in logs
- [ ] SSL certificate is valid
- [ ] Response times are acceptable
- [ ] All tests pass in production environment

## Emergency Contacts

Document:
- [ ] DevOps team contacts
- [ ] Database administrator contacts
- [ ] Security team contacts
- [ ] Cloud provider support
- [ ] On-call rotation schedule

## Post-Deployment Review

Within 24-48 hours:
- [ ] Review application logs
- [ ] Check error rates
- [ ] Monitor performance metrics
- [ ] Verify backup completion
- [ ] Review security logs
- [ ] Gather user feedback
- [ ] Document any issues
- [ ] Plan improvements

---

**Note:** This checklist should be reviewed and customized for your specific infrastructure and requirements.
