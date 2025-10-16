import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

const BookingDatePicker = ({ 
    selectedDates, 
    onDateChange, 
    onClose 
}) => {
    const [currentMonth, setCurrentMonth] = useState(new Date())
    const [isSelecting, setIsSelecting] = useState(false)
    const [startDate, setStartDate] = useState(null)
    const [endDate, setEndDate] = useState(null)

    // Initialize with existing selected dates
    useEffect(() => {
        if (selectedDates.checkIn) {
            setStartDate(new Date(selectedDates.checkIn))
        }
        if (selectedDates.checkOut) {
            setEndDate(new Date(selectedDates.checkOut))
        }
    }, [selectedDates])

    const today = new Date()
    const currentYear = currentMonth.getFullYear()
    const currentMonthIndex = currentMonth.getMonth()

    // Get first day of month and number of days
    const firstDayOfMonth = new Date(currentYear, currentMonthIndex, 1)
    const lastDayOfMonth = new Date(currentYear, currentMonthIndex + 1, 0)
    const firstDayWeekday = firstDayOfMonth.getDay()
    const daysInMonth = lastDayOfMonth.getDate()

    // Generate calendar days
    const calendarDays = []
    
    // Previous month's trailing days
    const prevMonth = new Date(currentYear, currentMonthIndex - 1, 0)
    for (let i = firstDayWeekday - 1; i >= 0; i--) {
        calendarDays.push({
            date: new Date(currentYear, currentMonthIndex - 1, prevMonth.getDate() - i),
            isCurrentMonth: false,
            isToday: false
        })
    }

    // Current month's days
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(currentYear, currentMonthIndex, day)
        calendarDays.push({
            date,
            isCurrentMonth: true,
            isToday: date.toDateString() === today.toDateString()
        })
    }

    // Next month's leading days
    const remainingDays = 42 - calendarDays.length // 6 rows × 7 days
    for (let day = 1; day <= remainingDays; day++) {
        calendarDays.push({
            date: new Date(currentYear, currentMonthIndex + 1, day),
            isCurrentMonth: false,
            isToday: false
        })
    }

    const navigateMonth = (direction) => {
        setCurrentMonth(prev => {
            const newMonth = new Date(prev)
            newMonth.setMonth(prev.getMonth() + direction)
            return newMonth
        })
    }

    const handleDateClick = (date) => {
        // Don't allow selection of dates before today
        if (isDateDisabled(date)) {
            return
        }
        
        if (!isSelecting) {
            // Start selection
            setStartDate(date)
            setEndDate(null)
            setIsSelecting(true)
        } else {
            // Complete selection
            if (date < startDate) {
                // If clicked date is before start date, swap them
                setEndDate(startDate)
                setStartDate(date)
            } else {
                setEndDate(date)
            }
            setIsSelecting(false)
        }
    }

    const handleDateHover = (date) => {
        if (isSelecting && startDate && !endDate) {
            // Show preview of selection only if date is not disabled
            if (date >= startDate && !isDateDisabled(date)) {
                setEndDate(date)
            }
        }
    }

    const clearSelection = () => {
        setStartDate(null)
        setEndDate(null)
        setIsSelecting(false)
    }

    const confirmSelection = () => {
        if (startDate && endDate) {
            // Use timezone-safe date formatting to avoid UTC conversion issues
            const formatDate = (date) => {
                const year = date.getFullYear()
                const month = String(date.getMonth() + 1).padStart(2, '0')
                const day = String(date.getDate()).padStart(2, '0')
                return `${year}-${month}-${day}`
            }
            
            onDateChange({
                checkIn: formatDate(startDate),
                checkOut: formatDate(endDate)
            })
            onClose()
        }
    }

    const isDateInRange = (date) => {
        if (!startDate || !endDate) return false
        return date >= startDate && date <= endDate
    }

    const isDateStart = (date) => {
        return startDate && date.toDateString() === startDate.toDateString()
    }

    const isDateEnd = (date) => {
        return endDate && date.toDateString() === endDate.toDateString()
    }

    const isDateDisabled = (date) => {
        // Create a clean today date for comparison
        const todayClean = new Date()
        todayClean.setHours(0, 0, 0, 0)
        
        // Create a clean date for comparison
        const dateClean = new Date(date)
        dateClean.setHours(0, 0, 0, 0)
        
        return dateClean < todayClean
    }

    const formatMonthYear = (date) => {
        return date.toLocaleDateString('en-US', { 
            month: 'long', 
            year: 'numeric' 
        })
    }

    return (
        <div className="bg-white rounded-xl shadow-2xl border border-gray-200 p-3 w-64">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-semibold text-gray-900">Select dates</h3>
                <button
                    onClick={onClose}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <X className="h-4 w-4 text-gray-500" />
                </button>
            </div>

            {/* Date Restriction Notice */}
            <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs text-blue-700 text-center">
                    You can only select dates from today onwards
                </p>
            </div>

            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-3">
                <button
                    onClick={() => navigateMonth(-1)}
                    className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <ChevronLeft className="h-4 w-4 text-gray-600" />
                </button>
                <h4 className="text-sm font-medium text-gray-900">
                    {formatMonthYear(currentMonth)}
                </h4>
                <button
                    onClick={() => navigateMonth(1)}
                    className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <ChevronRight className="h-4 w-4 text-gray-600" />
                </button>
            </div>

            {/* Days of Week */}
            <div className="grid grid-cols-7 gap-1 mb-2">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                    <div key={index} className="text-center text-xs font-medium text-gray-500 py-1">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, index) => {
                    const isDisabled = isDateDisabled(day.date)
                    const isInRange = isDateInRange(day.date)
                    const isStart = isDateStart(day.date)
                    const isEnd = isDateEnd(day.date)
                    const isPreview = isSelecting && startDate && !endDate && day.date > startDate

                    return (
                        <button
                            key={index}
                            onClick={() => !isDisabled && handleDateClick(day.date)}
                            onMouseEnter={() => !isDisabled && handleDateHover(day.date)}
                            disabled={isDisabled}
                            className={`
                                h-7 w-7 text-xs rounded-full transition-all duration-200 flex items-center justify-center
                                ${isDisabled 
                                    ? 'text-gray-300 cursor-not-allowed bg-gray-50' 
                                    : 'hover:bg-gray-100 cursor-pointer'
                                }
                                ${day.isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}
                                ${day.isToday ? 'font-bold' : ''}
                                ${isStart || isEnd 
                                    ? 'bg-[#F68241] text-white font-semibold' 
                                    : ''
                                }
                                ${isInRange && !isStart && !isEnd 
                                    ? 'bg-[#F68241]/20 text-[#F68241]' 
                                    : ''
                                }
                                ${isPreview 
                                    ? 'bg-[#F68241]/10 text-[#F68241]' 
                                    : ''
                                }
                            `}
                        >
                            {day.date.getDate()}
                        </button>
                    )
                })}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 mt-4">
                <button
                    onClick={onClose}
                    className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    Cancel
                </button>
                <button
                    onClick={confirmSelection}
                    disabled={!startDate || !endDate}
                    className="flex-1 px-4 py-2 text-sm font-semibold bg-[#F68241] text-white rounded-lg hover:bg-[#E67332] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {startDate && endDate ? `Confirm (${Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))} nights)` : 'Select Dates'}
                </button>
            </div>
        </div>
    )
}

export default BookingDatePicker
