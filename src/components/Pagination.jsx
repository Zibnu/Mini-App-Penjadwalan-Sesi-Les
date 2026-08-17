import { FaChevronLeft, FaChevronRight } from "react-icons/fa6"

function Pagination({
    currentPage = 1,
    totalPages = 1,
    onPageChange,
    totalItems = 0,
    itemsPerPage = 3,
    itemName = "item"
}) {
    if (totalPages <= 1 && totalItems <= itemsPerPage) {
        return null
    }

    const startIndex = Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)
    const endIndex = Math.min(currentPage * itemsPerPage, totalItems)

    // Generate page numbers with smart ellipsis for larger page counts
    const getPageNumbers = () => {
        const pages = []
        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i)
            }
        } else {
            if (currentPage <= 3) {
                pages.push(1, 2, 3, 4, "...", totalPages)
            } else if (currentPage >= totalPages - 2) {
                pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
            } else {
                pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages)
            }
        }
        return pages
    }

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 pb-2 mt-2 border-t border-gray-200">
            {/* Info Range Item */}
            <p className="text-xs text-[#242829]/70 order-2 sm:order-1 text-center sm:text-left">
                Menampilkan <span className="font-semibold text-[#242829]">{totalItems > 0 ? startIndex : 0}</span>-
                <span className="font-semibold text-[#242829]">{endIndex}</span> dari{" "}
                <span className="font-semibold text-[#242829]">{totalItems}</span> {itemName}
            </p>

            {/* Pagination Controls */}
            <div className="flex items-center gap-1.5 order-1 sm:order-2">
                {/* Prev Button */}
                <button
                    type="button"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                    aria-label="Halaman sebelumnya"
                    className="
                        min-w-[36px] h-9 px-2.5 flex items-center justify-center gap-1 rounded-lg text-xs font-medium
                        border border-gray-300 bg-white text-[#242829] transition cursor-pointer
                        hover:border-[#026C7A] hover:text-[#026C7A] hover:bg-[#026C7A]/5
                        disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-gray-300 disabled:hover:text-[#242829] disabled:hover:bg-white
                    "
                >
                    <FaChevronLeft size={10} />
                    <span className="hidden xs:inline sm:inline">Prev</span>
                </button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1">
                    {getPageNumbers().map((page, idx) => {
                        if (page === "...") {
                            return (
                                <span
                                    key={`ellipsis-${idx}`}
                                    className="w-7 h-9 flex items-center justify-center text-xs text-gray-400 select-none"
                                >
                                    …
                                </span>
                            )
                        }

                        const isActive = page === currentPage
                        return (
                            <button
                                key={`page-${page}`}
                                type="button"
                                onClick={() => onPageChange(page)}
                                aria-current={isActive ? "page" : undefined}
                                className={`
                                    min-w-[36px] h-9 px-2 rounded-lg text-xs font-semibold transition flex items-center justify-center cursor-pointer
                                    ${isActive
                                        ? "bg-[#026C7A] text-white shadow-sm border border-[#026C7A]"
                                        : "bg-white text-[#242829] border border-gray-300 hover:border-[#026C7A] hover:text-[#026C7A] hover:bg-[#026C7A]/5"
                                    }
                                `}
                            >
                                {page}
                            </button>
                        )
                    })}
                </div>

                {/* Next Button */}
                <button
                    type="button"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    aria-label="Halaman berikutnya"
                    className="
                        min-w-[36px] h-9 px-2.5 flex items-center justify-center gap-1 rounded-lg text-xs font-medium
                        border border-gray-300 bg-white text-[#242829] transition cursor-pointer
                        hover:border-[#026C7A] hover:text-[#026C7A] hover:bg-[#026C7A]/5
                        disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-gray-300 disabled:hover:text-[#242829] disabled:hover:bg-white
                    "
                >
                    <span className="hidden xs:inline sm:inline">Next</span>
                    <FaChevronRight size={10} />
                </button>
            </div>
        </div>
    )
}

export default Pagination
