export type InterviewScheduleKey = keyof Pick<
  OptionalFormData,
  | "interview_schedule_monday"
  | "interview_schedule_tuesday"
  | "interview_schedule_wednesday"
  | "interview_schedule_thursday"
  | "interview_schedule_friday"
  | "interview_schedule_saturday"
  | "interview_schedule_sunday"
>;

export type OptionalFormData = {
  address: string;
  decision_appointee: string;
  desired_content: string;
  interview_schedule_monday: string[];
  interview_schedule_tuesday: string[];
  interview_schedule_wednesday: string[];
  interview_schedule_thursday: string[];
  interview_schedule_friday: string[];
  interview_schedule_saturday: string[];
  interview_schedule_sunday: string[];
  work_experience_company_name_1: string;
  work_experience_company_name_2: string;
  work_experience_company_name_3: string;
  work_experience_company_name_4: string;
  work_experience_company_name_5: string;
  work_experience_employment_1: string;
  work_experience_employment_2: string;
  work_experience_employment_3: string;
  work_experience_employment_4: string;
  work_experience_employment_5: string;
  work_experience_period_end_1: Date | null;
  work_experience_period_end_2: Date | null;
  work_experience_period_end_3: Date | null;
  work_experience_period_end_4: Date | null;
  work_experience_period_end_5: Date | null;
  work_experience_period_start_1: Date | null;
  work_experience_period_start_2: Date | null;
  work_experience_period_start_3: Date | null;
  work_experience_period_start_4: Date | null;
  work_experience_period_start_5: Date | null;
  work_experience_job_type_1: string;
  work_experience_job_type_2: string;
  work_experience_job_type_3: string;
  work_experience_job_type_4: string;
  work_experience_job_type_5: string;
  work_experience_qualification_1: string;
  work_experience_qualification_2: string;
  work_experience_qualification_3: string;
  work_experience_qualification_4: string;
  work_experience_qualification_5: string;
  work_experience_skill_1: string;
  work_experience_skill_2: string;
  work_experience_skill_3: string;
  work_experience_skill_4: string;
  work_experience_skill_5: string;
  zip_code: string;
};

export type RequiredFormData = {
  birthday: Date | null;
  current_annual_income: string;
  desired_annual_income: string;
  desired_tag: string[];
  desired_time: string;
  desired_work_location: string;
  graduation_high_school: string;
  name: string;
  gender: string;
  last_educational: string;
  phone_number: string;
  skill: string[];
  status: string;
};

export type SetOptionalFormData = Dispatch<SetStateAction<OptionalFormData>>;

export type UpdateLoading = Dispatch<SetStateAction<boolean>>;

export type UpdateOptionalFormData = (
  event:
    | ChangeEvent<HTMLInputElement>
    | ChangeEvent<HTMLSelectElement>
    | ChangeEvent<HTMLTextAreaElement>
) => void;

export type UpdateRequiredFormData = (
  event: ChangeEvent<HTMLInputElement>
) => void;

export type WorkExperienceKey = `work_experience_${
  | "company_name"
  | "employment"
  | "period_start"
  | "period_end"
  | "job_type"
  | "qualification"
  | "skill"}_${1 | 2 | 3 | 4 | 5}`;
