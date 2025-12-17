// Initialize LIAM database
db = db.getSiblingDB('LIAM');

// Create collections with validators
db.createCollection('users', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["email", "createdAt"],
      properties: {
        email: {
          bsonType: "string",
          pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
        },
        username: {
          bsonType: "string",
          minLength: 3,
          maxLength: 30
        },
        password: {
          bsonType: "string",
          minLength: 6
        },
        firstName: {
          bsonType: "string"
        },
        lastName: {
          bsonType: "string"
        },
        role: {
          enum: ["user", "admin", "moderator"],
          default: "user"
        },
        isActive: {
          bsonType: "bool",
          default: true
        },
        createdAt: {
          bsonType: "date"
        },
        updatedAt: {
          bsonType: "date"
        }
      }
    }
  }
});

db.createCollection('sessions', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["userId", "token", "createdAt"],
      properties: {
        userId: {
          bsonType: "objectId"
        },
        token: {
          bsonType: "string"
        },
        expiresAt: {
          bsonType: "date"
        },
        createdAt: {
          bsonType: "date"
        }
      }
    }
  }
});

db.createCollection('audit_logs', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["userId", "action", "timestamp"],
      properties: {
        userId: {
          bsonType: "objectId"
        },
        action: {
          bsonType: "string"
        },
        resource: {
          bsonType: "string"
        },
        details: {
          bsonType: "object"
        },
        ipAddress: {
          bsonType: "string"
        },
        userAgent: {
          bsonType: "string"
        },
        timestamp: {
          bsonType: "date"
        }
      }
    }
  }
});

// Create indexes
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "username": 1 }, { unique: true, sparse: true });
db.sessions.createIndex({ "token": 1 }, { unique: true });
db.sessions.createIndex({ "expiresAt": 1 }, { expireAfterSeconds: 0 });
db.audit_logs.createIndex({ "userId": 1 });
db.audit_logs.createIndex({ "timestamp": -1 });

print('LIAM database initialized successfully');