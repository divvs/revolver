import { useMemo, useRef, useState } from "react";
import { TimeScaleSelector } from "./TimeScaleSelector";
import { format, startOfDay, endOfDay, eachMinuteOfInterval } from "date-fns";

interface TimeRulerProps {
  timeScale: number;
  width: number;
  onTimeScaleChange: (minutes: number) => void;
  showMarkerLines?: boolean;
}

interface Marker {
  minute: number;
  isHour: boolean;
  label: string;
  key: string;
  hour: number;
  isEven: boolean;
}

const LINE_HEIGHTS = {
  HOUR: "h-6",
  EVEN_MINUTE: "h-3",
  ODD_MINUTE: "h-2",
  HIDDEN: "h-0",
} as const;

const LINE_COLORS = {
  HOUR: "bg-gray-300 dark:bg-gray-600",
  EVEN_MINUTE: "bg-gray-300 dark:bg-gray-600",
  ODD_MINUTE: "bg-gray-200 dark:bg-gray-500",
  HOVERED_HOUR: "bg-blue-600 dark:bg-blue-400",
  HOVERED_EVEN: "bg-blue-600 dark:bg-blue-400",
  HOVERED_ODD: "bg-blue-400 dark:bg-blue-300",
  HIDDEN: "bg-transparent",
} as const;

const TEXT_COLORS = {
  HOUR: "text-gray-600 dark:text-gray-100",
  HOUR_BOLD: "text-gray-600 dark:text-gray-100",
  HOUR_HOVERED: "text-blue-600 dark:text-blue-400",
  MINUTE: "text-gray-400 dark:text-gray-500",
  MINUTE_HOVERED: "text-blue-600 dark:text-blue-400",
} as const;

export const TimeRuler = ({
  timeScale,
  width,
  onTimeScaleChange,
  showMarkerLines = true,
}: TimeRulerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredMinute, setHoveredMinute] = useState<number | null>(null);

  const markers = useMemo(() => {
    const startDate = startOfDay(new Date());
    const endDate = endOfDay(startDate);

    return eachMinuteOfInterval(
      { start: startDate, end: endDate },
      { step: timeScale },
    ).map((date, index) => ({
      minute: date.getMinutes(),
      isHour: date.getMinutes() === 0,
      label: date.getMinutes() === 0 ? format(date, "H") : format(date, "m"),
      key: `${timeScale}-${date.getTime()}`,
      hour: Math.floor(date.getHours()),
      isEven: index % 2 === 0,
    }));
  }, [timeScale]);

  const getHourMarkerLabelStyle = (hour: number) => {
    if (hoveredMinute === null) {
      return showMarkerLines ? TEXT_COLORS.HOUR : TEXT_COLORS.HOUR_BOLD;
    }
    const hoveredHour = Math.floor(hoveredMinute / 60);
    return hoveredHour === hour
      ? TEXT_COLORS.HOUR_HOVERED
      : TEXT_COLORS.HOUR_BOLD;
  };

  const getMarkerLineStyle = (marker: Marker) => {
    if (hoveredMinute === null) {
      return marker.isHour
        ? `${showMarkerLines ? LINE_HEIGHTS.EVEN_MINUTE : LINE_HEIGHTS.HOUR} ${LINE_COLORS.HOUR}`
        : marker.isEven
          ? `${LINE_HEIGHTS.EVEN_MINUTE} ${LINE_COLORS.EVEN_MINUTE}`
          : `${LINE_HEIGHTS.ODD_MINUTE} ${LINE_COLORS.ODD_MINUTE}`;
    }

    const currentMinute = marker.minute + marker.hour * 60;
    const hoveredHour = Math.floor(hoveredMinute / 60);

    if (currentMinute === hoveredMinute) {
      return marker.isHour
        ? `${showMarkerLines ? LINE_HEIGHTS.EVEN_MINUTE : LINE_HEIGHTS.HOUR} ${LINE_COLORS.HOVERED_HOUR}`
        : marker.isEven
          ? `${LINE_HEIGHTS.EVEN_MINUTE} ${LINE_COLORS.HOVERED_EVEN}`
          : `${LINE_HEIGHTS.ODD_MINUTE} ${LINE_COLORS.HOVERED_ODD}`;
    }

    if (marker.isHour && marker.hour === hoveredHour) {
      return `${showMarkerLines ? LINE_HEIGHTS.EVEN_MINUTE : LINE_HEIGHTS.HOUR} ${LINE_COLORS.HOVERED_HOUR}`;
    }

    return marker.isHour
      ? `${showMarkerLines ? LINE_HEIGHTS.EVEN_MINUTE : LINE_HEIGHTS.HOUR} ${LINE_COLORS.HOUR}`
      : marker.isEven
        ? `${LINE_HEIGHTS.EVEN_MINUTE} ${LINE_COLORS.EVEN_MINUTE}`
        : `${LINE_HEIGHTS.ODD_MINUTE} ${LINE_COLORS.ODD_MINUTE}`;
  };

  const getMinuteLabelStyle = (marker: Marker) => {
    if (!showMarkerLines) {
      return hoveredMinute === marker.minute + marker.hour * 60
        ? TEXT_COLORS.MINUTE_HOVERED
        : TEXT_COLORS.MINUTE;
    }
    return `${TEXT_COLORS.MINUTE} group-hover:${TEXT_COLORS.MINUTE_HOVERED}`;
  };

  const getLabelPosition = (marker: Marker) => {
    if (showMarkerLines) {
      return "top-0";
    }
    return marker.isHour ? "top-6" : "top-3";
  };

  return (
    <div
      className="relative bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute left-0 top-0 bottom-0 z-10 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
        <TimeScaleSelector onChange={onTimeScaleChange} />
      </div>
      <div
        ref={containerRef}
        className="relative h-24 overflow-x-auto scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent select-none ml-[120px]"
        style={{
          scrollbarColor: isHovered
            ? "var(--scrollbar-thumb) var(--scrollbar-track)"
            : "transparent transparent",
        }}
      >
        <div className="relative h-full flex">
          {markers.map((marker) => (
            <div
              key={marker.key}
              className="relative w-[2ch] min-w-[2ch] h-full flex flex-col items-center group"
              onMouseEnter={() =>
                !marker.isHour &&
                setHoveredMinute(marker.minute + marker.hour * 60)
              }
              onMouseLeave={() => setHoveredMinute(null)}
            >
              <div
                className={`absolute top-0 transition-all duration-300 ease-in-out ${
                  showMarkerLines ? "left-0" : "left-1/2 -translate-x-1/2"
                }`}
              >
                <div
                  className={`w-[1px] transition-all duration-300 ease-in-out ${getMarkerLineStyle(marker)}`}
                />
              </div>
              <div
                className={`absolute left-1/2 -translate-x-1/2 w-[2ch] text-center transition-all duration-300 ease-in-out ${
                  marker.isHour
                    ? `${getLabelPosition(marker)} ${getHourMarkerLabelStyle(marker.hour)} text-[12px] font-medium`
                    : `${getLabelPosition(marker)} ${getMinuteLabelStyle(marker)} text-[10px]`
                }`}
              >
                {marker.label}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="h-1 bg-gray-100 dark:bg-gray-800" />{" "}
      {/* Scrollbar track */}
    </div>
  );
};
