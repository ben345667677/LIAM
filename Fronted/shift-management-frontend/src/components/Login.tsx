import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [detailedError, setDetailedError] = useState('');
  const [logsVisible, setLogsVisible] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const formRef = useRef<HTMLFormElement>(null);
  const initialValuesRef = useRef({ email: '', password: '' });
  const logsContainerRef = useRef<HTMLDivElement>(null);
  const isRestoringRef = useRef(false);

  // Custom console.log that persists
  const persistLog = useCallback((...args: any[]) => {
    const logMessage = args.map(arg =>
      typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
    ).join(' ');

    const timestamp = new Date().toLocaleTimeString();
    const formattedLog = `[${timestamp}] ${logMessage}`;

    console.log(formattedLog);

    // Add log to state
    setLogs(prevLogs => [...prevLogs, formattedLog]);
    setLogsVisible(true);

    // Scroll to bottom of logs
    setTimeout(() => {
      if (logsContainerRef.current) {
        logsContainerRef.current.scrollTop = logsContainerRef.current.scrollHeight;
      }
    }, 50);
  }, []);

  // Prevent form values from being cleared by unwanted re-renders
  useEffect(() => {
    if (!isRestoringRef.current && email === '' && initialValuesRef.current.email) {
      isRestoringRef.current = true;
      setEmail(initialValuesRef.current.email);
      setTimeout(() => {
        isRestoringRef.current = false;
      }, 0);
    }
    if (!isRestoringRef.current && password === '' && initialValuesRef.current.password) {
      isRestoringRef.current = true;
      setPassword(initialValuesRef.current.password);
      setTimeout(() => {
        isRestoringRef.current = false;
      }, 0);
    }
  }, [email, password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Store current form values
    initialValuesRef.current = { email, password };

    // Don't clear the form before we know the login is successful
    // Only clear errors
    setError('');
    setDetailedError('');

    try {
      persistLog('Attempting login with email:', email);
      await login(email, password);
      persistLog('Login successful');

      // Only clear form after successful login
      setEmail('');
      setPassword('');
      initialValuesRef.current = { email: '', password: '' };

      navigate('/home');
    } catch (err: any) {
      persistLog('Login error:', err);
      persistLog('Error response:', err.response);
      persistLog('Error data:', err.response?.data);
      persistLog('Error status:', err.response?.status);

      // Restore form values if they were changed
      setEmail(initialValuesRef.current.email);
      setPassword(initialValuesRef.current.password);

      // Set user-friendly error message
      setError(err.message || 'ההתחברות נכשלה');

      // Set detailed error for debugging
      if (err.response?.data?.message) {
        setDetailedError(`שגיאה מהשרת: ${err.response.data.message}`);
      } else if (err.response?.status === 401) {
        setDetailedError('שגיאת אימות: סיסמה או אימייל לא נכונים');
      } else if (err.response?.status === 403) {
        setDetailedError('גישה נדחתה: אין לך הרשאות מתאימות');
      } else if (err.response?.status === 500) {
        setDetailedError('שגיאת שרת פנימית, אנא נסה שוב מאוחר יותר');
      } else if (err.code === 'ECONNREFUSED' || err.code === 'ERR_NETWORK') {
        setDetailedError('לא ניתן להתחבר לשרת, בדוק את חיבור הרשת ושהשרת פעיל');
      } else {
        setDetailedError(`שגיאה: ${err.message || 'שגיאה לא ידועה'}`);
      }
    }
  };

  // Handle email change - don't clear logs automatically
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    // Store the value immediately to prevent it from being cleared
    initialValuesRef.current.email = e.target.value;
  };

  // Handle password change - don't clear logs automatically
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    // Store the value immediately to prevent it from being cleared
    initialValuesRef.current.password = e.target.value;
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>התחברות</h2>
        <form onSubmit={handleSubmit} ref={formRef}>
          <div className="form-group">
            <label htmlFor="email">אימייל</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={handleEmailChange}
              required
              autoComplete="email"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">סיסמה</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={handlePasswordChange}
              required
              autoComplete="current-password"
            />
          </div>
          {error && (
            <div className="error-message">
              {error}
              {detailedError && (
                <div style={{ fontSize: '0.85em', marginTop: '5px', opacity: 0.9 }}>
                  {detailedError}
                </div>
              )}
            </div>
          )}
          <button type="submit" disabled={loading} className="auth-button">
            {loading ? 'מתחבר...' : 'התחבר'}
          </button>
        </form>

        {/* Display persistent logs if they exist */}
        {logsVisible && logs.length > 0 && (
          <div
            ref={logsContainerRef}
            style={{
              marginTop: '20px',
              padding: '10px',
              backgroundColor: '#f5f5f5',
              border: '1px solid #ddd',
              borderRadius: '4px',
              maxHeight: '200px',
              overflowY: 'auto',
              fontSize: '12px',
              fontFamily: 'monospace',
              direction: 'ltr'
            }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '10px',
              paddingBottom: '5px',
              borderBottom: '1px solid #ccc'
            }}>
              <strong>Debug Logs ({logs.length}):</strong>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setLogs([]);
                  setLogsVisible(false);
                }}
                style={{
                  fontSize: '11px',
                  padding: '2px 6px',
                  backgroundColor: '#ddd',
                  border: 'none',
                  borderRadius: '3px',
                  cursor: 'pointer'
                }}
              >
                Clear
              </button>
            </div>
            {logs.map((log, index) => (
              <div key={index} style={{ marginBottom: '2px', wordBreak: 'break-all' }}>
                {log}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;