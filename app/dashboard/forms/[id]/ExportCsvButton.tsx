"use client"
import { RiDownloadCloud2Line } from "@remixicon/react"

interface ExportCsvButtonProps {
    filename: string;
    headers: string[];
    rows: (string | number)[][];
    disabled?: boolean;
}

export default function ExportCsvButton({ filename, headers, rows, disabled }: ExportCsvButtonProps) {
    const handleExport = () => {
        if (disabled || rows.length === 0) return;

        // Escape helper to prevent broken columns from user inputs containing commas
        const escapeCell = (cell: string | number) => {
            const strCell = String(cell);
            if (strCell.includes(",") || strCell.includes("\"") || strCell.includes("\n")) {
                return `"${strCell.replace(/"/g, '""')}"`;
            }
            return strCell;
        };

        const csvContent = [
            headers.map(escapeCell).join(","),
            ...rows.map(row => row.map(escapeCell).join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.setAttribute("download", `${filename.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_responses.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <button 
            onClick={handleExport} 
            disabled={disabled}
            className={`h-9 px-4 rounded-md text-[13px] font-medium transition-colors flex items-center gap-1.5 border ${disabled ? 'bg-gray-100 text-gray-400 dark:bg-[#18181b] dark:text-[#52525b] cursor-not-allowed border-transparent' : 'bg-white hover:bg-gray-50 border-gray-200 text-black dark:bg-[#27272a] dark:hover:bg-[#3f3f46] dark:text-white dark:border-[#3f3f46]'}`}
        >
            <RiDownloadCloud2Line className="w-[16px] h-[16px]" /> Export CSV
        </button>
    )
}
