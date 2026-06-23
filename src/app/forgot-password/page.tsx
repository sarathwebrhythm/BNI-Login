import { LeftPanel } from "@/components/login/LeftPanel";
import { RightPanel } from "@/components/login/RightPanel";
import { ForgotPasswordForm } from "@/components/login/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <main className="min-h-screen bg-dark/20 flex items-center justify-center p-4 lg:p-6">
      <div
        className="
          w-full max-w-[1300px]
          grid grid-cols-1 lg:grid-cols-2
          rounded-2xl overflow-hidden
          shadow-2xl shadow-black/30
          min-h-[700px]
        "
      >
        <div className="order-2 lg:order-1">
          <LeftPanel />
        </div>
        <div className="order-1 lg:order-2">
          <RightPanel
            title="Forgot Password"
            subtitle="Enter your email to receive an OTP"
          >
            <ForgotPasswordForm />
          </RightPanel>
        </div>
      </div>
    </main>
  );
}