import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

const MobileDatePicker = ({ onDateSelect, onClose, initialCheckIn, initialCheckOut, onDateChange }) => {
  const [selectedCheckIn, setSelectedCheckIn] = useState(initialCheckIn || '')
  const [selectedCheckOut, setSelectedCheckOut] = useState(initialCheckOut || '')
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectionMode, setSelectionMode] = useState('checkin') // 'checkin' or 'checkout'

  const today = new Date()
  const currentYear = today.getFullYear()
  const currentMonthNum = today.getMonth()

  // Generate calendar data for current month
  const generateCalendarData = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())

    const days = []
    const currentDate = new Date(startDate)

    for (let i = 0; i < 42; i++) {
      days.push(new Date(currentDate))
      currentDate.setDate(currentDate.getDate() + 1)
    }

    return days
  }

  const getMonthName = (date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  }

  const formatDate = (date) => {
    try {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    } catch (error) {
      console.error('Error formatting date:', error)
      return ''
    }
  }

  const isDateInPast = (date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date < today
  }

  const isDateSelected = (date) => {
    const dateStr = formatDate(date)
    return dateStr === selectedCheckIn || dateStr === selectedCheckOut
  }

  const isDateInRange = (date) => {
    if (!selectedCheckIn || !selectedCheckOut) return false
    const dateStr = formatDate(date)
    return dateStr > selectedCheckIn && dateStr < selectedCheckOut
  }

  const handleDateClick = (date) => {
    try {
      if (isDateInPast(date)) return

      const dateStr = formatDate(date)

      // Auto-detect selection mode based on current state
      if (!selectedCheckIn || (selectedCheckIn && selectedCheckOut)) {
        // Start new selection - select check-in
        setSelectedCheckIn(dateStr)
        setSelectedCheckOut('')
        setSelectionMode('checkout')
        if (onDateChange) {
          onDateChange(dateStr, '')
        }
      } else if (selectedCheckIn && !selectedCheckOut) {
        // Complete selection - select check-out
        if (dateStr > selectedCheckIn) {
          setSelectedCheckOut(dateStr)
          setSelectionMode('checkin')
          if (onDateChange) {
            onDateChange(selectedCheckIn, dateStr)
          }
        } else {
          // If selected date is before check-in, make it the new check-in
          setSelectedCheckIn(dateStr)
          setSelectedCheckOut('')
          setSelectionMode('checkout')
          if (onDateChange) {
            onDateChange(dateStr, '')
          }
        }
      }
    } catch (error) {
      console.error('Error in handleDateClick:', error)
    }
  }

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  }

  const handleConfirm = () => {
    if (selectedCheckIn && selectedCheckOut) {
      onDateSelect(selectedCheckIn, selectedCheckOut)
    }
  }

  const handleClear = () => {
    setSelectedCheckIn('')
    setSelectedCheckOut('')
  }

  const calendarData = generateCalendarData(currentMonth)

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Select Dates</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* Instructions */}
      <div className="px-4 py-3 bg-blue-50 border-b border-gray-200">
        <p className="text-sm text-blue-800">
          {!selectedCheckIn && !selectedCheckOut 
            ? "Tap a date to start your selection"
            : selectedCheckIn && !selectedCheckOut 
            ? "Tap a date after your check-in to complete your selection"
            : "Your dates are selected"
          }
        </p>
      </div>

      {/* Calendar Navigation */}
      <div className="flex items-center justify-between p-4">
        <button
          onClick={handlePrevMonth}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronLeft className="h-6 w-6 text-gray-600" />
        </button>
        
        <h4 className="text-lg font-semibold text-gray-900">{getMonthName(currentMonth)}</h4>
        
        <button
          onClick={handleNextMonth}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronRight className="h-6 w-6 text-gray-600" />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="px-4 pb-4">
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
            <div key={`header-${day}-${index}`} className="text-center text-sm font-medium text-gray-500 py-2">
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1">
          {calendarData.slice(0, 35).map((date, index) => {
            const isPast = isDateInPast(date)
            const isSelected = isDateSelected(date)
            const isInRange = isDateInRange(date)
            const isCheckIn = formatDate(date) === selectedCheckIn
            const isCheckOut = formatDate(date) === selectedCheckOut
            const isCurrentlySelecting = (selectionMode === 'checkin' && isCheckIn) || 
                                        (selectionMode === 'checkout' && isCheckOut)
            const isNextToSelect = (!selectedCheckIn && !selectedCheckOut) || 
                                 (selectedCheckIn && !selectedCheckOut && formatDate(date) > selectedCheckIn)

            return (
              <button
                key={`day-${index}-${formatDate(date)}`}
                onClick={() => handleDateClick(date)}
                disabled={isPast}
                className={`
                  w-12 h-12 text-sm rounded-full flex items-center justify-center transition-all duration-200
                  ${isPast ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-gray-100 cursor-pointer active:scale-95'}
                  ${isSelected ? 'bg-gray-900 text-white' : ''}
                  ${isInRange ? 'bg-gray-100' : ''}
                  ${isCheckIn ? 'bg-gray-900 text-white' : ''}
                  ${isCheckOut ? 'bg-gray-900 text-white' : ''}
                  ${isCurrentlySelecting ? 'ring-2 ring-blue-500' : ''}
                  ${isNextToSelect ? 'ring-1 ring-gray-300' : ''}
                `}
              >
                {date.getDate()}
              </button>
            )
          })}
        </div>
      </div>

      {/* Selected Dates Summary */}
      {(selectedCheckIn || selectedCheckOut) && (
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              {selectedCheckIn && (
                <div className="text-sm">
                  <span className="text-gray-500">Check-in:</span>
                  <span className="ml-2 font-medium text-gray-900">
                    {new Date(selectedCheckIn).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              )}
              {selectedCheckOut && (
                <div className="text-sm mt-1">
                  <span className="text-gray-500">Check-out:</span>
                  <span className="ml-2 font-medium text-gray-900">
                    {new Date(selectedCheckOut).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              )}
            </div>
            <button
              onClick={handleClear}
              className="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-between p-4 border-t border-gray-200">
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
        >
          Cancel
        </button>
        
        <button
          onClick={handleConfirm}
          disabled={!selectedCheckIn || !selectedCheckOut}
          className="px-6 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Confirm
        </button>
      </div>
    </div>
  )
}

export default MobileDatePicker
