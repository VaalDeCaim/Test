import { Header } from '@/components/layout/Header';

export default function TermsPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="container max-w-3xl px-4 py-16">
        <h1 className="text-3xl font-bold">Terms of Service</h1>
        <p className="mt-4 text-muted-foreground">
          Last updated: {new Date().toLocaleDateString()}
        </p>
        <div className="mt-8 space-y-6 text-muted-foreground">
          <p>
            By using StatementFlow, you agree to these terms. The service is provided as-is for converting bank statements.
          </p>
          <p>
            You are responsible for ensuring you have the right to process any files you upload. We are not liable for any data loss or misuse.
          </p>
        </div>
      </main>
    </div>
  );
}
