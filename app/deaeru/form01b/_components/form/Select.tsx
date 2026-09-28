import {
  forwardRef,
  type FocusEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

import { cn } from "@/lib/utils";
import { Inner } from "@/components/common";
import { Label } from "@/app/deaeru/form01b/_components/form";

interface Props {
  label: string;
  name: string;
  onBlur: (event: FocusEvent<HTMLSelectElement>) => void;
  optionData: string[];
  helperText?: ReactNode;
  customDropdown?: boolean;
  multiple?: boolean;
  required?: boolean;
  value?: string | string[];
  size?: number;
}

export const Select = forwardRef<HTMLDivElement, Props>(function Select(
  {
    label,
    name,
    onBlur,
    optionData,
    helperText,
    customDropdown = false,
    multiple = false,
    required = false,
    size = 1,
    value,
  },
  ref
) {
  const [isOpen, setIsOpen] = useState(false);
  const hiddenSelectRef = useRef<HTMLSelectElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedSingleValue = typeof value === "string" ? value : "";
  const selectedValues = Array.isArray(value) ? value : [];

  useEffect(() => {
    if (!hiddenSelectRef.current || !multiple) return;
    const options = hiddenSelectRef.current.options;
    for (let i = 0; i < options.length; i++) {
      options[i].selected = value?.includes(options[i].value) || false;
    }
  }, [value, multiple]);

  useEffect(() => {
    if (!isOpen) return;
    function handleOutsideClick(e: MouseEvent | TouchEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
    };
  }, [isOpen]);

  const handleToggleOption = (option: string) => {
    if (!hiddenSelectRef.current) return;
    const options = hiddenSelectRef.current.options;
    for (let i = 0; i < options.length; i++) {
      if (options[i].value === option) {
        options[i].selected = !options[i].selected;
        break;
      }
    }
    onBlur({
      target: hiddenSelectRef.current,
      currentTarget: hiddenSelectRef.current,
    } as unknown as FocusEvent<HTMLSelectElement>);
  };

  const handleSelectSingleOption = (option: string) => {
    if (!hiddenSelectRef.current) return;
    const options = hiddenSelectRef.current.options;
    for (let i = 0; i < options.length; i++) {
      options[i].selected = options[i].value === option;
    }
    onBlur({
      target: hiddenSelectRef.current,
      currentTarget: hiddenSelectRef.current,
    } as unknown as FocusEvent<HTMLSelectElement>);
    setIsOpen(false);
  };

  if (multiple) {
    return (
      <div className="relative" data-field ref={ref}>
        <Inner className="bg-white">
          <Label className="mb-2" label={label} required={required} />
          <div className="relative" ref={containerRef}>
            <select
              className="sr-only"
              multiple
              name={name}
              ref={hiddenSelectRef}
              required={required}
              tabIndex={-1}
              aria-hidden="true"
              defaultValue={value || []}
            >
              {optionData.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            <button
              type="button"
              className={cn(
                "w-full rounded-lg border-2 bg-white p-3.5 text-left text-base font-medium transition-colors",
                isOpen ? "border-green-500" : "border-gray-200",
                selectedValues.length > 0 ? "text-gray-900" : "text-gray-400"
              )}
              onClick={() => setIsOpen(!isOpen)}
            >
              <div className="flex items-center justify-between">
                <span className="truncate pr-2">
                  {selectedValues.length > 0 ? selectedValues.join(", ") : "選択してください"}
                </span>
                <svg className={cn("size-5 flex-shrink-0 text-gray-400 transition-transform", isOpen && "rotate-180")} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>
            {isOpen && (
              <div className="absolute left-0 right-0 top-full z-30 mt-1 max-h-60 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
                {optionData.map((option) => {
                  const isSelected = selectedValues.includes(option);
                  return (
                    <label key={option} className={cn("flex cursor-pointer items-center gap-3 border-b border-gray-100 px-3.5 py-3 text-base last:border-b-0 active:bg-gray-100", isSelected ? "bg-green-50 text-green-800" : "text-gray-700")}>
                      <input type="checkbox" className="size-4 rounded border-gray-300 accent-green-500" checked={isSelected} onChange={() => handleToggleOption(option)} />
                      <span className="font-medium">{option}</span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>
          {helperText && <p className="px-1 pt-4 text-xs leading-relaxed text-gray-600">{helperText}</p>}
        </Inner>
      </div>
    );
  }

  if (customDropdown) {
    return (
      <div className="relative" data-field ref={ref}>
        <Inner className="bg-white">
          <Label className="mb-2" label={label} required={required} />
          <div className="relative" ref={containerRef}>
            <select className="sr-only" name={name} ref={hiddenSelectRef} required={required} tabIndex={-1} aria-hidden="true" value={selectedSingleValue} onChange={() => {}}>
              <option disabled value="">選択してください</option>
              {optionData.map((option) => (<option key={option} value={option}>{option}</option>))}
            </select>
            <button type="button" className={cn("w-full rounded-lg border-2 bg-white p-3.5 text-left text-base font-medium transition-colors", isOpen ? "border-green-500" : "border-gray-200", selectedSingleValue !== "" ? "text-gray-900" : "text-gray-400")} onClick={() => setIsOpen(!isOpen)}>
              <div className="flex items-center justify-between">
                <span className="truncate pr-2">{selectedSingleValue !== "" ? `${selectedSingleValue}歳` : "選択してください"}</span>
                <svg className={cn("size-5 flex-shrink-0 text-gray-400 transition-transform", isOpen && "rotate-180")} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>
            {isOpen && (
              <div className="absolute left-0 right-0 top-full z-30 mt-1 max-h-60 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
                {optionData.map((option) => {
                  const isSelected = selectedSingleValue === option;
                  return (
                    <button type="button" key={option} className={cn("flex w-full items-center justify-between border-b border-gray-100 px-3.5 py-3 text-left text-base font-medium last:border-b-0 active:bg-gray-100", isSelected ? "bg-green-50 text-green-800" : "text-gray-700")} onClick={() => handleSelectSingleOption(option)}>
                      <span>{option}歳</span>
                      {isSelected && <svg className="size-5 text-green-600" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
          {helperText && <p className="px-1 pt-4 text-xs leading-relaxed text-gray-600">{helperText}</p>}
        </Inner>
      </div>
    );
  }

  return (
    <div className="relative" data-field ref={ref}>
      <Inner className="bg-white">
        <Label className="mb-2" label={label} required={required} />
        <div className="relative overflow-hidden rounded-lg border-2 border-gray-200 bg-white focus-within:border-green-500 transition-colors">
          <select className="block w-full appearance-none bg-transparent p-3.5 text-base font-medium text-gray-900" name={name} onBlur={onBlur} required={required} size={size}>
            <option disabled value="">選択してください</option>
            {optionData.map((option) => (<option key={option} value={option}>{option}</option>))}
          </select>
          <svg className="pointer-events-none absolute inset-y-1/2 right-3 flex size-5 -translate-y-1/2 items-center text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        {helperText && <p className="px-1 pt-4 text-xs leading-relaxed text-gray-600">{helperText}</p>}
      </Inner>
    </div>
  );
});
