# Frontend API Documentation

## סקירה כללית

מדריך זה מתאר כיצד לעבוד עם ה-API של ה-backend באפליקציית Shift Management. המערכת משתמשת ב-JSON Web Tokens (JWT) לאימות משתמשים.

**Base URL**: כל ה-endpoints מתחילים ב-`/api`

## מבנה התיקיות

```
Fronted/
├── src/
│   ├── api/           # קבצי תקשורת עם השרת
│   ├── components/    # רכיבי React
│   ├── hooks/         # Custom hooks
│   ├── utils/         # פונקציות עזר
│   └── services/      # שירותים (אימות, ניהול משמרות)
```

---

## 1. מערכת אימות

### הרשמה (Register)
**Endpoint**: `POST /api/register`

**בקשה**:
```javascript
const registerData = {
  email: "user@example.com",
  password: "password123"
};

fetch('/api/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(registerData)
})
.then(response => response.json())
.then(data => console.log(data));
```

**תגובה הצלחה (201)**:
```json
{
  "message": "User created successfully",
  "user": {
    "_id": "64a7b8c9d1e2f3g4h5i6j7k8",
    "email": "user@example.com",
    "createdAt": "2023-07-06T12:34:56.789Z"
  }
}
```

**תגובת שגיאה (409)**:
```json
{
  "message": "User already exists"
}
```

### התחברות (Login)
**Endpoint**: `POST /api/login`

**בקשה**:
```javascript
const loginData = {
  email: "user@example.com",
  password: "password123"
};

fetch('/api/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(loginData)
})
.then(response => response.json())
.then(data => {
  if (data.accessToken) {
    // שמור את ה-token לשימוש בבקשות עתידיות
    localStorage.setItem('accessToken', data.accessToken);
  }
});
```

**תגובה הצלחה (200)**:
```json
{
  "message": "Login successful",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**תגובת שגיאה (401)**:
```json
{
  "message": "Invalid credentials"
}
```

---

## 2. ניהול משמרות

### יצירת משמרת חדשה
**Endpoint**: `POST /api/home/newShift`
**דרוש אימות**: ✅

**בקשה**:
```javascript
const shiftData = {
  employeeName: "יוסי כהן",
  checkIn: "2023-07-06T08:00:00.000Z",
  checkOut: "2023-07-06T17:00:00.000Z",
  createdAt: "2023-07-06T07:55:00.000Z"
};

const token = localStorage.getItem('accessToken');

fetch('/api/home/newShift', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify(shiftData)
})
.then(response => response.json())
.then(data => console.log(data));
```

**תגובה הצלחה (201)**:
```json
{
  "message": "Shift created successfully",
  "shift": {
    "_id": "64a7b8c9d1e2f3g4h5i6j7k9",
    "employeeName": "יוסי כהן",
    "checkIn": "2023-07-06T08:00:00.000Z",
    "checkOut": "2023-07-06T17:00:00.000Z",
    "createdAt": "2023-07-06T07:55:00.000Z"
  }
}
```

**תגובת שגיאה (400)**:
```json
{
  "message": "All fields are required"
}
```

### בדיקת גישה לדף הבית
**Endpoint**: `GET /api/home`
**דרוש אימות**: ✅

**בקשה**:
```javascript
const token = localStorage.getItem('accessToken');

fetch('/api/home', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
.then(response => {
  if (response.ok) {
    return response.text();
  }
  throw new Error('Unauthorized');
})
.then(data => console.log(data)); // "Welcome Home"
```

---

## 3. מודלי נתונים

### מודל משתמש (User)
```javascript
{
  _id: "string",           // מזהה ייחודי
  email: "string",         // אימייל ייחודי
  password: "string",      // סיסמה
  refreshToken: "string",  // טוקן רענון
  createdAt: "Date"        // תאריך יצירה
}
```

### מודל משמרת (Shift)
```javascript
{
  _id: "string",           // מזהה ייחודי
  employeeName: "string",  // שם עובד
  checkIn: "string",       // זמן כניסה (ISO timestamp)
  checkOut: "string",      // זמן יציאה (ISO timestamp)
  createdAt: "string"      // זמן יצירת רשומה (ISO timestamp)
}
```

### מודל עובד (Employee)
```javascript
{
  _id: "string",           // מזהה ייחודי
  firstName: "string",     // שם פרטי
  lastName: "string",      // שם משפחה
  idNumber: "string",      // תעודת זהות ייחודית
  hoursWorked: "number",   // שעות עבודה מצטברות
  createdAt: "Date"        // תאריך יצירה
}
```

---

## 4. טיפול בשגיאות

### קודי שגיאה נפוצים
- **401 Unauthorized**: טוקן לא תקין או חסר
- **403 Forbidden**: טוקן פג תוקף
- **400 Bad Request**: שדות חסרים או פורמט לא נכון
- **409 Conflict**: משתמש קיים (בהרשמה)
- **500 Internal Server Error**: שגיאת שרת

### דוגמת טיפול בשגיאות
```javascript
async function apiCall(url, options = {}) {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });

    const data = await response.json();

    if (!response.ok) {
      // טיפול בשגיאות אימות
      if (response.status === 401 || response.status === 403) {
        // הפניה לדף התחברות או רענון טוקן
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
      }

      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}
```

---

## 5. דוגמת Hook לשימוש ב-API

```javascript
// hooks/useApi.js
import { useState, useEffect } from 'react';

export function useApi(url, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');

    fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers
      },
      ...options
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      setData(data);
      setLoading(false);
    })
    .catch(error => {
      setError(error);
      setLoading(false);
    });
  }, [url]);

  return { data, loading, error };
}
```

---

## 6. טיפים למימוש ב-Frontend

### אבטחה
1. **אל תשמור סיסמאות** ב-localStorage או בזיכרון הדפדפן
2. **השתמש ב-HTTPS** בסביבת ייצור
3. **נקה את ה-token** בהתנתקות
4. **הוסף timeout** לטוקנים בצד הלקוח

### שיפור חוויית משתמש
1. **הצג מצב טעינה** בזמן קריאות API
2. **טפל בשגיאות** בצורה ידידותית למשתמש
3. **הוסף ולידציה** בצד הלקוח לפני שליחה
4. **השתמש ב-try/catch** בכל קריאות ה-API

### דוגמת Service לניהול משמרות
```javascript
// services/shiftService.js
const API_BASE = '/api';

const shiftService = {
  // יצירת משמרת חדשה
  createShift: async (shiftData) => {
    const token = localStorage.getItem('accessToken');
    const response = await fetch(`${API_BASE}/home/newShift`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(shiftData)
    });
    return response.json();
  },

  // קבלת כל המשמרות (אם קיים endpoint)
  getAllShifts: async () => {
    const token = localStorage.getItem('accessToken');
    const response = await fetch(`${API_BASE}/shifts`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.json();
  }
};

export default shiftService;
```

---

## 7. פורמט תאריכים

כל התאריכים ב-API משתמשים בפורמט **ISO 8601**:

```javascript
// דוגמה ליצירת תאריך בפורמט הנכון
const now = new Date();
const isoString = now.toISOString(); // "2023-07-06T12:34:56.789Z"

// או לשימוש ב-moment.js
const formattedDate = moment().format(); // אותו פורמט ISO
```

---

## 8. Checklist לפני שליחה ל-API

- [ ] וודא שכל השדות הנדרשים קיימים
- [ ] המר תאריכים לפורמט ISO
- [ ] הוסף Authorization header עם Bearer token
- [ ] השתמש ב-Content-Type: application/json
- [ ] טפל במקרה של טוקן פג תוקף
- [ ] הצג הודעת שגיאה מתאימה למשתמש
- [ ] הוסף סטטוס טעינה בזמן המתנה לתגובה

---

**הערה**: המערכת כרגע מאחסנת סיסמאות כטקסט פליין. **לא מומלץ לסביבת ייצור** - יש להוסיף הצפנת סיסמאות (bcrypt).