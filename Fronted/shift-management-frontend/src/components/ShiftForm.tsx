import React, { useState } from 'react';
import { shiftService } from '../services/shiftService';
import './ShiftForm.css';

interface ShiftFormProps {
  onShiftCreated?: () => void;
}

const ShiftForm: React.FC<ShiftFormProps> = ({ onShiftCreated }) => {
  const [employeeName, setEmployeeName] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Validate dates
      if (new Date(checkOut) <= new Date(checkIn)) {
        throw new Error('שעת יציאה חייבת להיות אחרי שעת כניסה');
      }

      const shiftData = {
        employeeName,
        checkIn: new Date(checkIn).toISOString(),
        checkOut: new Date(checkOut).toISOString(),
      };

      await shiftService.createShift(shiftData);
      setSuccess('המשמרת נוצרה בהצלחה!');

      // Reset form
      setEmployeeName('');
      setCheckIn('');
      setCheckOut('');

      // Notify parent component
      if (onShiftCreated) {
        onShiftCreated();
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Set default values for check-in and check-out times
  const setDefaultTimes = () => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];

    // Default check-in: today at 08:00
    const defaultCheckIn = `${today}T08:00`;
    // Default check-out: today at 17:00
    const defaultCheckOut = `${today}T17:00`;

    setCheckIn(defaultCheckIn);
    setCheckOut(defaultCheckOut);
  };

  React.useEffect(() => {
    setDefaultTimes();
  }, []);

  return (
    <div className="shift-form-container">
      <h3>צור משמרת חדשה</h3>
      <form onSubmit={handleSubmit} className="shift-form">
        <div className="form-group">
          <label htmlFor="employeeName">שם עובד</label>
          <input
            type="text"
            id="employeeName"
            value={employeeName}
            onChange={(e) => setEmployeeName(e.target.value)}
            required
            placeholder="הכנס שם עובד"
          />
        </div>
        <div className="form-group">
          <label htmlFor="checkIn">זמן כניסה</label>
          <input
            type="datetime-local"
            id="checkIn"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="checkOut">זמן יציאה</label>
          <input
            type="datetime-local"
            id="checkOut"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            required
          />
        </div>
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        <button type="submit" disabled={loading} className="submit-button">
          {loading ? 'יוצר משמרת...' : 'צור משמרת'}
        </button>
      </form>
    </div>
  );
};

export default ShiftForm;