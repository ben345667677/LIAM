# Shift Management Frontend

פרונטאנד React למערכת ניהול משמרות.

## תכונות

- הרשמה והתחברות מאובטחות עם JWT
- יצירת משמרות חדשות
- צפייה ברשימת משמרות
- ממשק רספונסיבי בעברית
- ניהול טעינת נתונים ושגיאות

## תנאים מקדימים

- Node.js גרסה 14 ומעלה
- Backend server פעיל ב-port 3001

## התקנה

1. התקן את התלות:
```bash
npm install
```

2. הפעל את השרת:
```bash
npm start
```

האפליקציה תפתח ב- http://localhost:3000

## מבנה הפרויקט

```
src/
├── api/           # שירותי API עם axios
├── components/    # רכיבי React
├── context/       # React Context (ניהול מצב)
├── services/      # שירותי לוגיקה
├── hooks/         # Custom hooks
└── utils/         # פונקציות עזר
```

## רכיבים

### Auth Components
- **Login**: דף התחברות
- **Register**: דף הרשמה
- **ProtectedRoute**: קומפוננטה להגנת נתיבים

### Shift Components
- **ShiftForm**: טופס יצירת משמרת
- **ShiftList**: הצגת רשימת משמרות
- **Home**: דף הבית המוגן

## שימוש ב-API

האפליקציה מתחברת ל-backend API ב-port 3001.

### Endpoints:
- `POST /api/register` - הרשמת משתמש חדש
- `POST /api/login` - התחברות משתמש
- `POST /api/home/newShift` - יצירת משמרת חדשה (דורש אימות)
- `GET /api/home` - בדיקת גישה לדף הבית (דורש אימות)

## סגנונות

האפליקציה משתמשת ב-CSS מודולרי עם:
- עיצוב רספונסיבי
- גרדיאנטים וצבעים מודרניים
- תמיכה מלאה בשפה העברית (RTL)
- אנימציות וטרנזיציות חלקות

## פיתוח

- TypeScript לטיפוסים חזקים
- React Router לניווט
- Axios לתקשורת עם השרת
- React Context לניהול מצב גלובלי

## Build

יצירת גרסת production:
```bash
npm run build
```

## בדיקות

הרץ את הבדיקות:
```bash
npm test
```
