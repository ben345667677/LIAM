# MongoDB Setup for LIAM Project

This directory contains a complete MongoDB setup configured to match your connection string:

```
MONGO_URI='mongodb://admin:password123@localhost:27018/LIAM?authSource=admin'
```

## Quick Start

1. **Start MongoDB**
   ```bash
   cd mongodb
   docker-compose up -d
   ```

2. **Check Health**
   ```bash
   # Using MongoDB CLI
   mongo mongodb://admin:password123@localhost:27018/LIAM?authSource=admin scripts/health-check.js

   # Or using Node.js
   cd scripts
   npm install mongodb
   node test-connection.js
   ```

3. **Access MongoDB Web UI**
   - URL: http://localhost:8081
   - Username: admin
   - Password: admin123

## Configuration Details

### Database Information
- **Database Name**: LIAM
- **Port**: 27018 (host) → 27017 (container)
- **Admin User**: admin
- **Admin Password**: password123
- **Auth Source**: admin

### Additional Users Created
- **App User**: liam_app / liam_password_2024 (read/write access)
- **Backup User**: liam_backup / liam_backup_2024 (read-only access)

### Collections
1. **users** - User accounts with validation
2. **sessions** - User session management
3. **audit_logs** - Activity logging

### Security Features
- Authentication enabled
- Schema validation on collections
- Proper indexing for performance
- Automatic session expiration

## Connection Strings

### Primary (Admin)
```
mongodb://admin:password123@localhost:27018/LIAM?authSource=admin
```

### Application User
```
mongodb://liam_app:liam_password_2024@localhost:27018/LIAM
```

### Backup User
```
mongodb://liam_backup:liam_backup_2024@localhost:27018/LIAM
```

## Commands

### Start MongoDB
```bash
docker-compose up -d
```

### Stop MongoDB
```bash
docker-compose down
```

### View Logs
```bash
docker-compose logs -f mongodb
```

### Enter MongoDB Shell
```bash
docker exec -it liam-mongodb mongosh -u admin -p password123 --authenticationDatabase admin LIAM
```

### Reset Everything
```bash
docker-compose down -v
docker-compose up -d
```

## Monitoring

### Health Check Script
```bash
mongo mongodb://admin:password123@localhost:27018/LIAM?authSource=admin scripts/health-check.js
```

### Connection Test (Node.js)
```bash
cd scripts
npm install mongodb
node test-connection.js
```

## Environment Variables

Add to your backend `.env`:

```env
MONGO_URI=mongodb://admin:password123@localhost:27018/LIAM?authSource=admin
MONGO_APP_URI=mongodb://liam_app:liam_password_2024@localhost:27018/LIAM
```

## Troubleshooting

### Port Issues
If port 27018 is taken, modify both:
1. `docker-compose.yml` - Change the host port
2. Your MONGO_URI - Update the port

### Connection Refused
1. Ensure Docker is running
2. Run `docker-compose ps` to check container status
3. Run `docker-compose logs mongodb` for error details

### Authentication Issues
1. Verify URI parameters
2. Check if database is fully initialized (wait ~30 seconds after startup)
3. Run health check script to validate

## Backup and Restore

### Create Backup
```bash
docker exec liam-mongodb mongodump --uri="mongodb://admin:password123@localhost:27017/LIAM?authSource=admin" --out=/backup
docker cp liam-mongodb:/backup ./backup
```

### Restore Backup
```bash
docker cp ./backup liam-mongodb:/restore
docker exec liam-mongodb mongorestore --uri="mongodb://admin:password123@localhost:27017/LIAM?authSource=admin" /restore/LIAM
```

## Security Notes

- Change default passwords in production
- Use stronger authentication mechanisms in production
- Enable SSL/TLS for production deployments
- Regularly update MongoDB version
- Implement proper network isolation