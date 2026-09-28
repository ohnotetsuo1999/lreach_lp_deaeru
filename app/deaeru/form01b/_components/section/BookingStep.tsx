"use client";

import { type RefObject, useCallback, useEffect, useMemo, useState } from "react";

import { Container, MaxWidth } from "@/components/common";
import { StepTitle } from "@/app/deaeru/form01b/_components/ui";
import { MIN_LEAD_MINUTES } from "@/lib/booking-lead-time";

interface TimeSlot {
  start: string;
  end: string;
}

interface Props {
  bookingMethodRef: RefObject<HTMLDivElement | null>;
  onBookingChange: (data: {
    booking_method: string;
    booking_date: string;
    booking_start_time: string;
    booking_end_time: string;
  }) => void;
  maxDaysFromNow?: number;
  // 日付選択に表示する日数（当日を含む）。指定すると、その日数を超える日付はカレンダーから非表示になる。
  // 例: 3 を指定すると「当日・翌日・翌々日」の3日間のみ表示。未指定なら全日表示（従来通り）。
  visibleDays?: number;
}

const DURATION_MINUTES = 15;
const BUSINESS_START_HOUR = 10;
const BUSINESS_END_HOUR = 24;
const DAYS_TO_DISPLAY = 14;
/**
 * 自動枠数（auto_slot_capacity＝その時間に稼働可能なIS数）を持たないスロットで使う上限。
 * 8日以降・過去日は稼働IS数で判定できないため、この固定値で受ける。
 * 4件で頭打ちになり遠い日程の予約を取りこぼしていたため 10 に引き上げた（2026-08-06）。
 * DBトリガー enforce_interview_booking_slot_capacity の FALLBACK_MAX と必ず揃えること。
 */
const DEFAULT_MAX_BOOKINGS_PER_SLOT = 10;
// プレ面談の予約リードタイム。値と経緯は @/lib/booking-lead-time に集約している。
// サーバー側(/api/lp-booking, /api/interview-bookings/check-slot)も同じ定数を参照する。

const toSlotKey = (isoString: string): string => {
  const d = new Date(isoString);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}T${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
};

function generateTimeSlots(): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const now = new Date();

  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  let startDate = new Date(now);

  if (startDate < tomorrow) {
    if (now.getHours() >= BUSINESS_START_HOUR) {
      // 今からリードタイム分だけ先の枠のみ予約可（次の30分刻みへ切り上げる）
      startDate = new Date(now.getTime() + MIN_LEAD_MINUTES * 60 * 1000);
    } else {
      startDate.setHours(BUSINESS_START_HOUR, 0, 0, 0);
    }
  }

  startDate.setMinutes(Math.ceil(startDate.getMinutes() / 30) * 30);
  startDate.setSeconds(0, 0);

  const currentDate = new Date(now);
  currentDate.setHours(0, 0, 0, 0);

  for (let i = 0; i < DAYS_TO_DISPLAY; i++) {
    const checkDate = new Date(currentDate);
    checkDate.setDate(currentDate.getDate() + i);

    for (let hour = BUSINESS_START_HOUR; hour < BUSINESS_END_HOUR; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const slotStart = new Date(checkDate);
        slotStart.setHours(hour, minute, 0, 0);
        const slotEnd = new Date(slotStart.getTime() + DURATION_MINUTES * 60000);

        if (slotStart.getTime() <= now.getTime()) continue;
        if (slotStart.getTime() < startDate.getTime()) continue;

        slots.push({
          start: slotStart.toISOString(),
          end: slotEnd.toISOString(),
        });
      }
    }
  }

  return slots;
}

function formatDateLabel(dateStr: string): { day: number; month: number; weekday: string; isToday: boolean } {
  const d = new Date(dateStr);
  const today = new Date();
  const isToday = d.toDateString() === today.toDateString();
  const weekday = d.toLocaleDateString("ja-JP", { weekday: "short" });
  return { day: d.getDate(), month: d.getMonth() + 1, weekday, isToday };
}

export function BookingStep({ bookingMethodRef, onBookingChange, maxDaysFromNow, visibleDays }: Props) {
  const [method, setMethod] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [fullSlotKeys, setFullSlotKeys] = useState<Set<string>>(new Set());
  const [blockedSlots, setBlockedSlots] = useState<{ date: string; start: string; end: string }[]>([]);
  // 管理画面で設定された枠上限（受付停止＝上限0 の枠を判定するために使用）
  const [maxPerSlot, setMaxPerSlot] = useState<number>(DEFAULT_MAX_BOOKINGS_PER_SLOT);
  const [dailyMaxBookings, setDailyMaxBookings] = useState<Record<string, number>>({});
  const [slotMaxOverrides, setSlotMaxOverrides] = useState<Record<string, number>>({});
  // 空き枠管理（稼働IS連動 案2）: 自動枠数・手動オフセット・朝夜クローズ
  const [autoSlotCapacity, setAutoSlotCapacity] = useState<Record<string, number>>({});
  const [slotCapacityOffsets, setSlotCapacityOffsets] = useState<Record<string, number>>({});
  const [closeAfterHour, setCloseAfterHour] = useState<number | null>(null);
  const [closeBeforeHour, setCloseBeforeHour] = useState<number | null>(null);

  const allSlots = useMemo(() => generateTimeSlots(), []);

  useEffect(() => {
    const fetchSlotCounts = async () => {
      try {
        const from = new Date();
        from.setHours(0, 0, 0, 0);
        const to = new Date();
        to.setDate(to.getDate() + DAYS_TO_DISPLAY);
        to.setHours(23, 59, 59, 999);

        const res = await fetch(
          `/api/interview-bookings/slot-counts?from=${encodeURIComponent(from.toISOString())}&to=${encodeURIComponent(to.toISOString())}`
        );
        if (res.ok) {
          const data = await res.json();
          if (data.fullSlots) {
            const keys = new Set<string>();
            for (const s of data.fullSlots as string[]) {
              keys.add(toSlotKey(s));
            }
            setFullSlotKeys(keys);
          }
          if (data.blockedSlots) {
            setBlockedSlots(data.blockedSlots as { date: string; start: string; end: string }[]);
          }
          if (typeof data.maxPerSlot === "number") {
            setMaxPerSlot(data.maxPerSlot);
          }
          if (data.dailyMaxBookings) {
            setDailyMaxBookings(data.dailyMaxBookings as Record<string, number>);
          }
          if (data.slotMaxOverrides) {
            setSlotMaxOverrides(data.slotMaxOverrides as Record<string, number>);
          }
          if (data.autoSlotCapacity) {
            setAutoSlotCapacity(data.autoSlotCapacity as Record<string, number>);
          }
          if (data.slotCapacityOffsets) {
            setSlotCapacityOffsets(data.slotCapacityOffsets as Record<string, number>);
          }
          setCloseAfterHour(
            typeof data.closeAfterHour === "number" ? data.closeAfterHour : null
          );
          setCloseBeforeHour(
            typeof data.closeBeforeHour === "number" ? data.closeBeforeHour : null
          );
        }
      } catch (err) {
        console.error("[BookingStep] スロット件数取得エラー:", err);
      }
    };
    fetchSlotCounts();
  }, []);

  // その枠の残り受付可能数を返す（空き枠管理・稼働IS連動 案2）。
  // 解決順: 0クローズ > 朝クローズ > 夜クローズ > 自動(auto)+オフセット > 日別 > 全体。
  // ※ slot_max_overrides の 0 以外の固定値は使わず、自動＋オフセットに明け渡す。
  // ※ LIFF予約(lreach_interview_booking)の maxBookingsForSlotKey と同一ロジックにすること。
  const maxBookingsForSlot = useCallback(
    (slot: TimeSlot): number => {
      const slotKey = toSlotKey(slot.start);
      const dateKey = slotKey.split("T")[0] ?? slotKey;
      const hour = Number(slotKey.split("T")[1]?.split(":")[0]);

      // 1. クローズ
      if (slotMaxOverrides[slotKey] === 0) return 0;
      if (closeBeforeHour !== null && Number.isFinite(hour) && hour < closeBeforeHour) return 0;
      if (closeAfterHour !== null && Number.isFinite(hour) && hour >= closeAfterHour) return 0;

      // 2. 自動＋オフセット
      const auto = autoSlotCapacity[slotKey];
      const offset = slotCapacityOffsets[slotKey];
      if (
        (auto !== undefined && auto !== null) ||
        (offset !== undefined && offset !== null)
      ) {
        const base = auto ?? maxPerSlot;
        return Math.max(0, base + (offset ?? 0));
      }

      // 3. 日別 → 全体
      const dailyMax = dailyMaxBookings[dateKey];
      if (dailyMax !== undefined && dailyMax !== null) return dailyMax;
      return maxPerSlot;
    },
    [slotMaxOverrides, dailyMaxBookings, maxPerSlot, autoSlotCapacity, slotCapacityOffsets, closeAfterHour, closeBeforeHour]
  );

  const isSlotBlockedByAdmin = useCallback(
    (slot: TimeSlot): boolean => {
      if (blockedSlots.length === 0) return false;
      const d = new Date(slot.start);
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      const timeStr = `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
      return blockedSlots.some(
        (b) => b.date === dateStr && timeStr >= b.start && timeStr < b.end
      );
    },
    [blockedSlots]
  );

  const isSlotFull = useCallback(
    (slot: TimeSlot): boolean =>
      // 上限0（受付停止）の枠は満枠扱い（LIFF予約の isSlotCapacityClosed と同じ）。
      // これがないと 23:00/23:30 等の閉鎖枠が LP のカレンダーで選べてしまう。
      maxBookingsForSlot(slot) <= 0 ||
      fullSlotKeys.has(toSlotKey(slot.start)) ||
      isSlotBlockedByAdmin(slot),
    [fullSlotKeys, isSlotBlockedByAdmin, maxBookingsForSlot]
  );

  const disabledDates = useMemo(() => {
    if (maxDaysFromNow === undefined) return new Set<string>();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const cutoff = new Date(today);
    cutoff.setDate(today.getDate() + maxDaysFromNow);
    const set = new Set<string>();
    for (const slot of allSlots) {
      const slotDay = new Date(slot.start);
      slotDay.setHours(0, 0, 0, 0);
      if (slotDay >= cutoff) {
        set.add(slotDay.toLocaleDateString("ja-JP"));
      }
    }
    return set;
  }, [allSlots, maxDaysFromNow]);

  const dates = useMemo(() => {
    const dateSet = new Set<string>();
    for (const slot of allSlots) {
      dateSet.add(new Date(slot.start).toLocaleDateString("ja-JP"));
    }
    const all = Array.from(dateSet);
    // visibleDays が指定されている場合は、当日を含む先頭 visibleDays 日のみ表示（それ以降は非表示）
    if (visibleDays !== undefined && visibleDays > 0) {
      return all.slice(0, visibleDays);
    }
    return all;
  }, [allSlots, visibleDays]);

  const slotsForDate = useMemo(() => {
    if (!selectedDate) return [];
    return allSlots.filter(
      (s) => new Date(s.start).toLocaleDateString("ja-JP") === selectedDate
    );
  }, [allSlots, selectedDate]);

  const isSelectedDateDisabled = disabledDates.has(selectedDate);

  const handleMethodSelect = (m: string) => {
    setMethod(m);
    setSelectedDate("");
    setSelectedSlot(null);
    onBookingChange({
      booking_method: m,
      booking_date: "",
      booking_start_time: "",
      booking_end_time: "",
    });
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedSlot(null);
    const firstSlot = allSlots.find(
      (s) => new Date(s.start).toLocaleDateString("ja-JP") === date
    );
    onBookingChange({
      booking_method: method,
      booking_date: firstSlot ? firstSlot.start.split("T")[0] : "",
      booking_start_time: "",
      booking_end_time: "",
    });
  };

  const handleSlotSelect = (slot: TimeSlot) => {
    setSelectedSlot(slot);
    onBookingChange({
      booking_method: method,
      booking_date: slot.start.split("T")[0],
      booking_start_time: slot.start,
      booking_end_time: slot.end,
    });
  };

  const periods = [
    { label: "午前", range: [10, 12] as const },
    { label: "午後", range: [12, 18] as const },
    { label: "夜", range: [18, 24] as const },
  ];

  return (
    <section className="relative grow bg-gray-50">
      <div className="absolute inset-y-0 w-full overflow-y-scroll overscroll-y-contain">
        <MaxWidth>
          <Container width="90">
            <div className="flex flex-col gap-y-5 pb-6">
              <StepTitle step={3} title="面談の予約" />

              <div ref={bookingMethodRef} className="rounded-xl bg-white p-4 shadow-sm">
                <p className="mb-3 text-sm font-bold text-gray-800">
                  ご案内方法を選択してください
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: "online", label: "オンライン面談" },
                    { value: "phone", label: "電話" },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleMethodSelect(opt.value)}
                      className={`rounded-xl border-2 px-4 py-3.5 text-sm font-bold transition-all ${
                        method === opt.value
                          ? "border-green-500 bg-green-50 text-green-700"
                          : "border-gray-200 bg-white text-gray-700 hover:border-green-300"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {method && (
                <div className="rounded-xl bg-white p-4 shadow-sm">
                  <p className="mb-3 text-sm font-bold text-gray-800">
                    日付を選択
                  </p>
                  <div
                    className={`flex gap-2 pb-3 ${
                      visibleDays !== undefined ? "" : "overflow-x-auto"
                    }`}
                  >
                    {dates.map((date) => {
                      const firstSlot = allSlots.find(
                        (s) => new Date(s.start).toLocaleDateString("ja-JP") === date
                      );
                      if (!firstSlot) return null;
                      const info = formatDateLabel(firstSlot.start);
                      const isSelected = selectedDate === date;
                      const isSunday = new Date(firstSlot.start).getDay() === 0;
                      const isSaturday = new Date(firstSlot.start).getDay() === 6;
                      const allSlotsForThisDate = allSlots.filter(
                        (s) => new Date(s.start).toLocaleDateString("ja-JP") === date
                      );
                      const hasAvailableSlots = allSlotsForThisDate.some((s) => !isSlotFull(s));
                      const isFullyBooked = disabledDates.has(date) || !hasAvailableSlots;

                      return (
                        <button
                          key={date}
                          type="button"
                          onClick={() => handleDateSelect(date)}
                          disabled={isFullyBooked && !isSelected}
                          className={`relative flex flex-col items-center justify-center h-[88px] rounded-2xl border-2 transition-all ${
                            visibleDays !== undefined
                              ? "flex-1 min-w-0"
                              : "shrink-0 w-[72px]"
                          } ${
                            isSelected
                              ? "border-green-500 bg-green-500 text-white shadow-lg"
                              : isFullyBooked
                                ? "border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed"
                                : `border-gray-200 bg-white hover:border-green-300 hover:shadow-md ${
                                    isSunday ? "text-red-500" : isSaturday ? "text-blue-500" : "text-gray-800"
                                  }`
                          }`}
                        >
                          <span className={`text-[11px] font-medium ${isSelected ? "text-white/80" : ""}`}>
                            {info.isToday ? "今日" : info.weekday}
                          </span>
                          <span className="text-[22px] font-bold leading-tight">
                            {info.day}
                          </span>
                          <span className={`text-[10px] ${isSelected ? "text-white/70" : "text-gray-400"}`}>
                            {info.month}月
                          </span>
                          {isFullyBooked && (
                            <span className="absolute top-1.5 right-1.5 rounded-full bg-red-500 px-1 py-0.5 text-[9px] font-bold text-white leading-none">
                              満席
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {selectedDate && (
                <div className="rounded-xl bg-white p-4 shadow-sm">
                  {isSelectedDateDisabled ? (
                    <p className="mb-3 text-sm font-bold text-gray-400">
                      この日は満席です
                    </p>
                  ) : (
                    <p className="mb-3 text-sm font-bold text-gray-800">
                      時間を選択
                    </p>
                  )}
                  {periods.map(({ label, range }) => {
                    const periodSlots = slotsForDate.filter((s) => {
                      const hour = new Date(s.start).getHours();
                      return hour >= range[0] && hour < range[1];
                    });
                    if (periodSlots.length === 0) return null;

                    return (
                      <div key={label} className="mb-4">
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                          {label}
                        </p>
                        <div className="grid grid-cols-4 gap-2">
                          {periodSlots.map((slot) => {
                            const d = new Date(slot.start);
                            const timeStr = `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
                            const isSlotSelected = selectedSlot?.start === slot.start;
                            const isFull = isSlotFull(slot);

                            if (isSelectedDateDisabled || isFull) {
                              return (
                                <div
                                  key={slot.start}
                                  className="relative rounded-xl py-3 text-sm font-bold text-center border-2 border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed select-none"
                                >
                                  {timeStr}〜
                                  {isFull && !isSelectedDateDisabled && (
                                    <span className="absolute -top-1.5 -right-1.5 bg-gray-400 text-white text-[8px] px-1.5 py-0.5 rounded-full font-bold">
                                      満枠
                                    </span>
                                  )}
                                </div>
                              );
                            }

                            return (
                              <button
                                key={slot.start}
                                type="button"
                                onClick={() => handleSlotSelect(slot)}
                                className={`rounded-xl py-3 text-sm font-bold transition-all ${
                                  isSlotSelected
                                    ? "bg-green-500 text-white shadow-lg scale-[1.03]"
                                    : "border-2 border-gray-200 bg-white text-gray-800 hover:border-green-500 hover:shadow-md"
                                }`}
                              >
                                {timeStr}〜
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </Container>
        </MaxWidth>
      </div>
    </section>
  );
}
