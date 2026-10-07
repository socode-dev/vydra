import { useEffect, useMemo, useState } from "react";
import Input from "../ui/Input";

const formatDate = dateKey => new Intl.DateTimeFormat(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
}).format(new Date(`${dateKey}T00:00:00.000Z`));

const AdminDailyMetricCard = ({ daily, metricKey, label, description, icon: Icon }) => {
    const availableDates = useMemo(
        () => daily.map(day => day.dateKey).filter(Boolean),
        [daily],
    );
    const [selectedDate, setSelectedDate] = useState(availableDates.at(-1) || "");

    useEffect(() => {
        if (!availableDates.length) {
            setSelectedDate("");
            return;
        }

        setSelectedDate(currentDate => availableDates.includes(currentDate)
            ? currentDate
            : availableDates.at(-1));
    }, [availableDates]);

    const selectedDay = daily.find(day => day.dateKey === selectedDate);
    const value = selectedDay?.metrics?.[metricKey] || 0;

    return (
        <article className="min-w-0 rounded-xl border border-border border-t-2 border-t-success bg-card p-5 shadow-xs">
            <div className="flex items-start justify-between gap-3">
                <h2 className="text-xs font-semibold uppercase text-muted-foreground">{label}</h2>
                <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-success-soft text-success">
                    <Icon className="size-4" aria-hidden="true" />
                </span>
            </div>
            <p className="mt-5 font-display text-3xl font-semibold tabular-nums text-foreground">
                {value.toLocaleString()}
            </p>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                {selectedDate ? `${description} on ${formatDate(selectedDate)}.` : description}
            </p>
            <label className="mt-4 block text-xs font-medium text-muted-foreground">
                Select date
                <Input
                    type="date"
                    value={selectedDate}
                    min={availableDates[0]}
                    max={availableDates.at(-1)}
                    onChange={event => setSelectedDate(event.target.value)}
                    aria-label={`${label} date`}
                    className="mt-1.5 max-w-full appearance-none"
                    disabled={!availableDates.length}
                />
            </label>
        </article>
    );
};

export default AdminDailyMetricCard;
