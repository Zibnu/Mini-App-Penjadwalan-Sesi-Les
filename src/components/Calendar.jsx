import { formatDateKey, isSameDay, stripTime } from "../utils/date"

const DAY_LABELS = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"]
const MONTH_LABELS = [
    "Januari", "Februari", "Maret", "Mei", "Juni", "Juli", "Agustus",
    "September", "Oktober", "November", "December"
]

function Calendar({year, month, selectedDate, onSelectedDate, minDate, maxDate, markedDateKeys, today}) {
    const firstDayOfMonth = new Date(year, month, 1)
    const totalDays = new Date(year, month + 1, 0).getDate()
    const leadingEmpty = firstDayOfMonth.getDate()

    const cells = []
    for(let i = 0; i < leadingEmpty; i++) cells.push(null)
    for(let day = 1; day <= totalDays; day++) cells.push(new Date(year, month, day))

    return (
        <div>
            <p className="text-center font-semibold text-gray-900 mb-3">
                {MONTH_LABELS[month]} {year}
            </p>

            <div className="grid grid-cols-7 gap-1 mb-1">
                {DAY_LABELS.map((label) => (
                    <div 
                        key={label}
                        className="text-center text-xs font-medium text-gray-400 py-1"
                    >
                        {label}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
                {cells.map((date, idx) => {
                    if(!date) return <div key={`empty${idx}`}/>

                    const dateStripped = stripTime(date)
                    const isDisabled = dateStripped < minDate || dateStripped > maxDate
                    const isToday = isSameDay(date, today)
                    const isMarked = markedDateKeys.has(formatDateKey(date))
                    const isSelected = selectedDate && isSameDay(date, selectedDate)

                    return (
                        <button 
                            key={formatDateKey(date)}
                            type="button"
                            disabled={isDisabled}
                            onClick={() => onSelectedDate(date)}
                            className={`
                                relative aspect-square rounded-lg text-sm flex items-center
                                justify-center transition ${isDisabled ? "text-gray-300 cursor-not-allowed" :
                                "text-gray-700 hover:bg-indigo-50 cursor-pointer"}
                                ${isSelected ? "bg-indigo-600 text-white hover:bg-indigo-600" : ""}
                                ${isToday && !isSelected ? "ring-1 ringindigo-400" : ""}
                                `}
                        >
                                {date.getDate()}
                                {isMarked && !isSelected && (
                                    <span className="absolute bottom-1 w-1 h-1 rounded-full bg-indigo-500" />
                                )}
                            </button>
                    )
                })}
            </div>
        </div>
    )
}

export default Calendar