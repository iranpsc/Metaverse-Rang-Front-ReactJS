import { useState } from 'react';

const useDateFilter = () => {
  const [dateRange, setDateRange] = useState([null, null]);

  const filterByDate = (row, dateField = 'date') => {
    let dateMatch = true;
    if (dateRange[0] && dateRange[1]) {
      try {
        // تبدیل تاریخ سطر به اجزای آن
        const [rowYear, rowMonth, rowDay] = row[dateField].split('/').map(Number);
        
        // تبدیل تاریخ‌های محدوده به اجزای آن
        const [startYear, startMonth, startDay] = dateRange[0].split('/').map(num => {
          const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
          return parseInt(num.replace(/[۰-۹]/g, d => persianDigits.indexOf(d)));
        });
        
        const [endYear, endMonth, endDay] = dateRange[1].split('/').map(num => {
          const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
          return parseInt(num.replace(/[۰-۹]/g, d => persianDigits.indexOf(d)));
        });

        // مقایسه تاریخ‌ها
        const rowDate = rowYear * 10000 + rowMonth * 100 + rowDay;
        const startDate = startYear * 10000 + startMonth * 100 + startDay;
        const endDate = endYear * 10000 + endMonth * 100 + endDay;

        dateMatch = rowDate >= startDate && rowDate <= endDate;
      } catch (error) {
        console.error("خطا در مقایسه تاریخ:", error);
        dateMatch = true;
      }
    }
    return dateMatch;
  };

  return {
    dateRange,
    setDateRange,
    filterByDate
  };
};

export default useDateFilter;