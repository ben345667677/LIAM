import { apiService } from '../api/api';

export interface Shift {
  _id: string;
  employeeName: string;
  checkIn: string;
  checkOut: string;
  createdAt: string;
}

export interface CreateShiftData {
  employeeName: string;
  checkIn: string;
  checkOut: string;
  createdAt?: string;
}

class ShiftService {
  async createShift(shiftData: CreateShiftData): Promise<Shift> {
    try {
      // Create a new object with createdAt if not provided
      const dataToSend = {
        ...shiftData,
        createdAt: shiftData.createdAt || new Date().toISOString(),
      };

      const response = await apiService.createShift(dataToSend);
      return response.data.shift;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create shift');
    }
  }

  async checkHomeAccess(): Promise<boolean> {
    try {
      await apiService.checkHomeAccess();
      return true;
    } catch (error) {
      return false;
    }
  }

  // Helper function to format date for API
  formatDateForApi(date: Date): string {
    return date.toISOString();
  }

  // Helper function to format date for display
  formatDateForDisplay(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString('he-IL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  // Calculate shift duration
  calculateShiftDuration(checkIn: string, checkOut: string): string {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diff = end.getTime() - start.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}:${minutes.toString().padStart(2, '0')}`;
  }
}

export const shiftService = new ShiftService();
export default shiftService;