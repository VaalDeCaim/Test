import {
  BarChart3,
  FileText,
  KeyRound,
  LayoutDashboard,
  Mail,
  Shield,
  Sparkles,
  Upload,
} from "lucide-react";

const iconClass =
  "size-5 shrink-0 text-default-500";

type BenefitItemProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

function BenefitItem({ icon, title, description }: BenefitItemProps) {
  return (
    <div className="flex gap-3">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-default-100">
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="mt-0.5 text-xs text-default-600">
          {description}
        </p>
      </div>
    </div>
  );
}

export function LoginLeftPanel() {
  return (
    <div className="flex flex-col justify-center space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Log in to StatementFlow
        </h1>
        <p className="text-sm text-default-600">
          Access your dashboards, uploads, and exports. Your data stays secure
          and in your control.
        </p>
      </div>
      <div className="space-y-8">
        <BenefitItem
          icon={<LayoutDashboard className={iconClass} aria-hidden />}
          title="One place for all statements"
          description="See every upload, parsing run, and export in a single dashboard."
        />
        <BenefitItem
          icon={<Upload className={iconClass} aria-hidden />}
          title="Upload and process in seconds"
          description="Upload MT940 or CAMT.053 and get CSV, XLSX, or QBO ready for your ledger or BI tools."
        />
        <BenefitItem
          icon={<BarChart3 className={iconClass} aria-hidden />}
          title="Export when you need it"
          description="Download CSV, XLSX, or QBO with consistent schemas for your workflows."
        />
      </div>
    </div>
  );
}

export function SignupLeftPanel() {
  return (
    <div className="flex flex-col justify-center space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Create your StatementFlow account
        </h1>
        <p className="text-sm text-default-600">
          Set up access for you and your team to automate statement extraction.
          No credit card required to start.
        </p>
      </div>
      <div className="space-y-8">
        <BenefitItem
          icon={<FileText className={iconClass} aria-hidden />}
          title="MT940 & CAMT.053 to CSV, XLSX, QBO"
          description="Upload bank statement files and get clean transactions, balances, and exports for accounting."
        />
        <BenefitItem
          icon={<Sparkles className={iconClass} aria-hidden />}
          title="Built for real bank layouts"
          description="We parse SWIFT MT940 and ISO 20022 CAMT.053 with validated output to CSV, XLSX, and QBO."
        />
        <BenefitItem
          icon={<Shield className={iconClass} aria-hidden />}
          title="You own your data"
          description="Export anytime. We don't lock your data in or sell it to third parties."
        />
      </div>
    </div>
  );
}

export function ForgotPasswordLeftPanel() {
  return (
    <div className="flex flex-col justify-center space-y-8">
      <div className="space-y-2">
        <div className="flex size-10 items-center justify-center rounded-xl bg-warning-100">
          <KeyRound className="size-5 text-warning-600" aria-hidden />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Reset your password
        </h1>
        <p className="text-sm text-default-600">
          Enter the email you use to sign in. We&apos;ll send a secure link to reset your password.
        </p>
      </div>
      <div className="space-y-8">
        <BenefitItem
          icon={<Mail className={iconClass} aria-hidden />}
          title="Secure reset link"
          description="We send a one-time link to your email. It expires after a short time for security."
        />
        <BenefitItem
          icon={<Shield className={iconClass} aria-hidden />}
          title="No password shared"
          description="We never email your password. You'll set a new one after clicking the link."
        />
      </div>
    </div>
  );
}
