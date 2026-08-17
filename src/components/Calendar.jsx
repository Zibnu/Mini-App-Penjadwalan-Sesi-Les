import { formatDateKey, isSameDay, stripTime } from "../utils/date"

const DAY_LABELS = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"]
const MONTH_LABELS = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus",
    "September", "Oktober", "November", "Desember"
]

function Calendar({ year, month, selectedDate, onSelectedDate, minDate, maxDate, markedDateKeys, today }) {
    const firstDayOfMonth = new Date(year, month, 1)
    const totalDays = new Date(year, month + 1, 0).getDate()
    const leadingEmpty = firstDayOfMonth.getDay()

    const cells = []
    for (let i = 0; i < leadingEmpty; i++) cells.push(null)
    for (let day = 1; day <= totalDays; day++) cells.push(new Date(year, month, day))

    return (
        <div>
            <p className="text-center font-bold text-[#242829] text-base mb-4">
                {MONTH_LABELS[month]} {year}
            </p>

            <div className="grid grid-cols-7 gap-1 sm:gap-1.5 mb-1.5">
                {DAY_LABELS.map((label, idx) => (
                    <div 
                        key={label}
                        className={`text-center text-xs font-semibold py-1 select-none ${
                            idx === 0 ? "text-red-500" : "text-[#242829]/60"
                        }`}
                    >
                        {label}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
                {cells.map((date, idx) => {
                    if (!date) return <div key={`empty${idx}`} className="aspect-square" />

                    const dateStripped = stripTime(date)
                    const isDisabled = (minDate && dateStripped < minDate) || (maxDate && dateStripped > maxDate)
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
                                relative aspect-square rounded-xl text-xs sm:text-sm font-medium flex items-center
                                justify-center transition select-none
                                ${isDisabled 
                                    ? "text-gray-300 bg-gray-50/40 cursor-not-allowed" 
                                    : "text-[#242829] hover:bg-[#026C7A]/10 hover:text-[#026C7A] cursor-pointer active:scale-95"
                                }
                                ${isSelected 
                                    ? "!bg-[#026C7A] !text-white font-bold shadow-sm" 
                                    : ""
                                }
                                ${isToday && !isSelected 
                                    ? "ring-2 ring-[#026C7A] font-bold text-[#026C7A]" 
                                    : ""
                                }
                            `}
                        >
                            <span>{date.getDate()}</span>
                            {isMarked && (
                                <span className={`absolute bottom-1 w-1.5 h-1.5 rounded-full ${
                                    isSelected ? "bg-[#FBC84F]" : "bg-[#026C7A]"
                                }`} />
                            )}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}

export default Calendar