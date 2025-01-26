"use client";

import { FormEvent, useState } from "react";
import Dropdown from "@/components/Dropdown";
import { YEARS_RANGE } from "@/utils/Constants";
import FormInput from "@/components/FormInput";
import { useUIComponentsContext } from "@/contexts/UIComponentsContext";
import useFeedbackFetch from "@/hooks/FeedbackFetch";

export default function ExportPage() {
	const availableExportOptions = ["Hours", "People", "Shift Type"];
	const [selectedExportOption, setSelectedExportOption] = useState<string>(
		availableExportOptions[0]
	);
	const [selectedYear, setSelectedYear] = useState<number | null>(null);
	const { loading } = useUIComponentsContext();
	const feedbackFetch = useFeedbackFetch();

	const handleExport = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		feedbackFetch(
			"/api/export",
			{
				method: "POST",
				body: JSON.stringify({ selectedExportOption, selectedYear }),
				headers: {
					"Content-Type": "application/json"
				}
			},
			{
				callback: (data) => {
					if (data) {
						const blob = new Blob([data], { type: "text/csv;charset=utf-8;" });
						const url = URL.createObjectURL(blob);
						const link = document.createElement("a");
						const fileName =
							selectedExportOption === "Hours"
								? `${selectedYear} ${selectedExportOption} Data.csv`
								: `${selectedExportOption} Data.csv`;
						link.href = url;
						link.download = fileName;
						document.body.appendChild(link);
						link.click();
						document.body.removeChild(link);
						URL.revokeObjectURL(url);
					}
				}
			}
		);
	};

	return (
		<form className="ml-20 mt-44" onSubmit={handleExport}>
			<h3 className="mb-6">Export Logbook Data </h3>
			<div className="mb-20 flex gap-3">
				{availableExportOptions.map((label) => (
					<button
						key={label}
						type="button"
						className={`${selectedExportOption === label && "!bg-pedals-yellow"}`}
						onClick={() => setSelectedExportOption(label)}
					>
						{label}
					</button>
				))}
			</div>
			<div className="mb-20 flex h-32 flex-col justify-between">
				{(selectedExportOption === "Hours" ||
					selectedExportOption === "Hours") && (
						<div>
							<p className="mb-4">
								Export yearly hours by volunteer in CSV format.
							</p>
							<FormInput label="Select Year">
								<Dropdown
									className="w-48"
									options={YEARS_RANGE}
									currentOption={
										selectedYear && YEARS_RANGE.includes(selectedYear)
											? selectedYear
											: null
									}
									onClick={(e) => {
										e.preventDefault();
										setSelectedYear(
											Number((e.target as HTMLButtonElement).value) || null
										);
									}}
								/>
							</FormInput>
						</div>
					)}
				{selectedExportOption === "People" && (
					<p>Export the volunteer database in CSV format.</p>
				)}
				{selectedExportOption === "Shift Type" && (
					<p>
						Export the total hours volunteered for each shift category in CSV
						format.
					</p>
				)}
				{selectedExportOption === "Hours" && (
					<p>Export format according to cavan excel sheet</p>
				)}
			</div>
			<button
				type="submit"
				aria-disabled={
					loading || (selectedExportOption === "Hours" && !selectedYear)
				}
			>
				Export
			</button>
		</form>
	);
}
