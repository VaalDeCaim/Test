import { Header } from '@/components/layout/Header';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="container max-w-3xl px-4 py-16">
        <h1 className="text-3xl font-bold">Privacy Policy</h1>
        <p className="mt-4 text-muted-foreground">
          Last updated: {new Date().toLocaleDateString()}
        </p>
        <div className="mt-8 space-y-6 text-muted-foreground">
          <p>
            StatementFlow respects your privacy. We collect only the information necessary to provide our bank statement conversion service.
          </p>
          <p>
            Your uploaded files are processed securely and automatically deleted after 72 hours. We do not share your data with third parties.
          </p>
        </div>
      </main>
    </div>
  );
}
