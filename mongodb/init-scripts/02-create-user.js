// Create application user for LIAM database
db = db.getSiblingDB('LIAM');

// Create a dedicated application user with read/write permissions
db.createUser({
  user: 'liam_app',
  pwd: 'liam_password_2024',
  roles: [
    {
      role: 'readWrite',
      db: 'LIAM'
    }
  ]
});

// Create a backup user with read-only permissions
db.createUser({
  user: 'liam_backup',
  pwd: 'liam_backup_2024',
  roles: [
    {
      role: 'read',
      db: 'LIAM'
    }
  ]
});

print('Application users created successfully');