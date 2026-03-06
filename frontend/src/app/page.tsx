import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Button, Card, CardContent, CardHeader, Accordion } from '@heroui/react';

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero */}
        <section className="container px-4 py-24 md:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
              Convert Bank Statements in Seconds
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Transform MT940 and CAMT.053 files into CSV, XLSX, or QuickBooks format. 
              Trusted by accounting teams worldwide. Secure, fast, and easy to use.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Link href="/auth/login?screen_hint=signup">
                <Button variant="primary" size="lg">
                  Get started free
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button variant="outline" size="lg">
                  See how it works
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="border-t bg-muted/30 py-24">
          <div className="container px-4">
            <h2 className="mb-12 text-center text-3xl font-bold">
              Everything You Need for Bank Statement Conversion
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <h3 className="text-xl font-semibold">MT940 & CAMT.053</h3>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Support for SWIFT MT940 and ISO 20022 CAMT.053 formats. 
                    Auto-detection ensures the right parser is used every time.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <h3 className="text-xl font-semibold">Multiple Export Formats</h3>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Export to CSV, Excel (XLSX), or QuickBooks (QBO). 
                    One upload, multiple formats—ready for your workflow.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <h3 className="text-xl font-semibold">Secure & Compliant</h3>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Bank-grade security. Files are encrypted and stored temporarily. 
                    Auto-deletion after 72 hours protects your data.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="py-24">
          <div className="container px-4">
            <h2 className="mb-12 text-center text-3xl font-bold">
              How It Works
            </h2>
            <div className="mx-auto max-w-2xl space-y-8">
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold">Upload your file</h3>
                  <p className="text-muted-foreground">
                    Drag and drop your bank statement (.mt940 or .xml). 
                    We support both MT940 and CAMT.053 formats.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold">We process it</h3>
                  <p className="text-muted-foreground">
                    Our parser extracts transactions and validates the data. 
                    You’ll see validation results and any warnings.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold">Download your export</h3>
                  <p className="text-muted-foreground">
                    Choose CSV, XLSX, or QBO. Download in your preferred format 
                    and import into your accounting software.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="border-t bg-muted/30 py-24">
          <div className="container px-4">
            <h2 className="mb-12 text-center text-3xl font-bold">
              Simple, Transparent Pricing
            </h2>
            <div className="mx-auto max-w-2xl space-y-6 text-center">
              <p className="text-muted-foreground">
                Pay per conversion with coins, or subscribe to Pro for unlimited conversions. 
                No hidden fees. Cancel anytime.
              </p>
              <Link href="/auth/login?screen_hint=signup">
                <Button variant="primary" size="lg">
                  Get started — see pricing
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="py-24">
          <div className="container px-4">
            <h2 className="mb-12 text-center text-3xl font-bold">
              Frequently Asked Questions
            </h2>
            <div className="mx-auto max-w-2xl">
              <Accordion>
                <Accordion.Item key="1">
                  <Accordion.Heading>
                    <Accordion.Trigger>What file formats do you support?</Accordion.Trigger>
                  </Accordion.Heading>
                  <Accordion.Panel>
                    We support SWIFT MT940 (.mt940) and ISO 20022 CAMT.053 (.xml) bank statement formats.
                    The format is detected automatically.
                  </Accordion.Panel>
                </Accordion.Item>
                <Accordion.Item key="2">
                  <Accordion.Heading>
                    <Accordion.Trigger>What export formats are available?</Accordion.Trigger>
                  </Accordion.Heading>
                  <Accordion.Panel>
                    You can export to CSV, Excel (XLSX), or QuickBooks (QBO).
                    Each conversion generates all three formats for maximum flexibility.
                  </Accordion.Panel>
                </Accordion.Item>
                <Accordion.Item key="3">
                  <Accordion.Heading>
                    <Accordion.Trigger>How long are my files stored?</Accordion.Trigger>
                  </Accordion.Heading>
                  <Accordion.Panel>
                    For security, raw and exported files are automatically deleted after 72 hours.
                    Download your exports before they expire.
                  </Accordion.Panel>
                </Accordion.Item>
                <Accordion.Item key="4">
                  <Accordion.Heading>
                    <Accordion.Trigger>Is my data secure?</Accordion.Trigger>
                  </Accordion.Heading>
                  <Accordion.Panel>
                    Yes. We use bank-grade encryption, secure file handling, and Auth0 for authentication.
                    Your data is never shared or used for any purpose other than conversion.
                  </Accordion.Panel>
                </Accordion.Item>
              </Accordion>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t bg-primary py-24 text-primary-foreground">
          <div className="container px-4 text-center">
            <h2 className="text-3xl font-bold">
              Ready to convert your bank statements?
            </h2>
            <p className="mt-4 text-lg opacity-90">
              Join thousands of accounting teams using StatementFlow.
            </p>
            <Link href="/auth/login?screen_hint=signup">
              <Button variant="secondary" size="lg" className="mt-8">
                Create free account
              </Button>
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t py-8">
          <div className="container px-4 flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} StatementFlow. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="/privacy" className="text-sm hover:underline">Privacy</a>
              <a href="/terms" className="text-sm hover:underline">Terms</a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
