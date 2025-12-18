import React, { useState, useEffect } from 'react';
import { shiftService, Shift } from '../services/shiftService';
import './ShiftList.css';

interface ShiftListProps {
  refreshTrigger?: number;
}

const ShiftList: React.FC<ShiftListProps> = ({ refreshTrigger }) => {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Mock data for now - replace with actual API call when endpoint is available
  useEffect(() => {
    const fetchShifts = async () => {
      try {
        setLoading(true);
        // TODO: Replace with actual API call when shifts endpoint is available
        // const response = await apiService.get('/shifts');

        // Mock data for demonstration
        const mockShifts: Shift[] = [
          {
            _id: '1',
            employeeName: 'יוסי כהן',
            checkIn: '2023-12-18T08:00:00.000Z',
            checkOut: '2023-12-18T17:00:00.000Z',
            createdAt: '2023-12-18T07:55:00.000Z',
          },
          {
            _id: '2',
            employeeName: 'שרה לוי',
            checkIn: '2023-12-17T09:00:00.000Z',
            checkOut: '2023-12-17T18:30:00.000Z',
            createdAt: '2023-12-17T08:45:00.000Z',
          },
        ];

        setTimeout(() => {
          setShifts(mockShifts);
          setLoading(false);
        }, 500);
      } catch (err: any) {
        setError('שגיאה בטעינת המשמרות');
        setLoading(false);
      }
    };

    fetchShifts();
  }, [refreshTrigger]);

  if (loading) {
    return <div className="loading">טוען משמרות...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (shifts.length === 0) {
    return <div className="no-shifts">אין משמרות להצגה</div>;
  }

  return (
    <div className="shift-list-container">
      <h3>רשימת משמרות</h3>
      <div className="shift-list">
        {shifts.map((shift) => (
          <div key={shift._id} className="shift-card">
            <h4>{shift.employeeName}</h4>
            <div className="shift-details">
              <p>
                <strong>כניסה:</strong>{' '}
                {shiftService.formatDateForDisplay(shift.checkIn)}
              </p>
              <p>
                <strong>יציאה:</strong>{' '}
                {shiftService.formatDateForDisplay(shift.checkOut)}
              </p>
              <p>
                <strong>משך:</strong>{' '}
                {shiftService.calculateShiftDuration(shift.checkIn, shift.checkOut)}
              </p>
              <p>
                <strong>נוצר ב:</strong>{' '}
                {shiftService.formatDateForDisplay(shift.createdAt)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShiftList;