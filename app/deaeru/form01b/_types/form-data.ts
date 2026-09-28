export interface FormData {
  birth_year: string;
  full_name: string;
  full_name_kana: string;
  gender: string;
  phone_number: string;
  preferred_work_location: string[];
  preferred_work_style: string;
  preferred_annual_income: string;
  preferred_job_category: string;
  job_change_timing: string;
  job_change_count: string;
  job_change_reason: string;
  booking_method?: string;
  booking_date?: string;
  booking_start_time?: string;
  booking_end_time?: string;
}
