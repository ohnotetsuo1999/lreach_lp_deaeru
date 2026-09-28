import { Container, MaxWidth } from "@/components/common";
import { FooterButton } from "@/components/db/button";

type Props = {
  formData: { [key: string]: number | string | string[] | null };
  isSubmitting: boolean;
  step: number;
  submit: () => void;
  updateStep: (type: "next" | "prev") => void;
};

export function Footer({
  formData,
  isSubmitting,
  step,
  submit,
  updateStep,
}: Props) {
  return (
    <footer className="fixed bottom-0 w-full border-t bg-white">
      <MaxWidth>
        <Container width="90">
          <div className="flex h-18 items-center justify-between gap-x-4">
            <FooterButton
              button="前へ"
              disabled={step === 1}
              onClick={() => updateStep("prev")}
            />
            {step !== 2 ? (
              <FooterButton button="次へ" onClick={() => updateStep("next")} />
            ) : (
              <FooterButton
                button="スカウトを受け取る"
                disabled={
                  formData.birthday &&
                  formData.name &&
                  formData.phone_number &&
                  formData.zip_code &&
                  !isSubmitting
                    ? false
                    : true
                }
                onClick={submit}
              />
            )}
          </div>
        </Container>
      </MaxWidth>
    </footer>
  );
}
