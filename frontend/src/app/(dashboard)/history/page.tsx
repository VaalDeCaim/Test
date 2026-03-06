'use client';

import { useEffect, useState } from 'react';
import { Button, Card, CardContent, CardHeader, Spinner, Chip } from '@heroui/react';
import { api } from '@/lib/api';

type Job = {
  id: string;
  status: string;
  format?: string;
  createdAt: string;
};

export default function HistoryPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const getToken = async () => {
    const res = await fetch('/api/auth/token');
    const data = await res.json();
    return data.accessToken;
  };

  useEffect(() => {
    getToken().then((token) => {
      api.getJobs(token).then(setJobs).catch((e) => setError(e.message)).finally(() => setLoading(false));
    });
  }, []);

  const handleDownload = async (jobId: string, format: 'csv' | 'xlsx' | 'qbo') => {
    try {
      const token = await getToken();
      const { url } = await api.getExportUrl(token, jobId, format);
      window.open(url, '_blank');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Download failed');
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="container max-w-4xl space-y-8 p-8">
      <h1 className="text-2xl font-bold">Conversion History</h1>
      {error && <p className="text-destructive">{error}</p>}
      {jobs.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No conversions yet. <a href="/convert" className="text-primary underline">Convert your first file</a>.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <Card key={job.id}>
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm">{job.id.slice(0, 8)}...</span>
                  <Chip size="sm" color={job.status === 'completed' ? 'success' : job.status === 'failed' ? 'danger' : 'default'}>
                    {job.status}
                  </Chip>
                  {job.format && <Chip size="sm" variant="soft">{job.format}</Chip>}
                </div>
                <span className="text-sm text-muted-foreground">
                  {new Date(job.createdAt).toLocaleString()}
                </span>
              </CardHeader>
              <CardContent>
                {job.status === 'completed' && (
                  <div className="flex gap-2">
                    <Button size="sm" onPress={() => handleDownload(job.id, 'csv')}>CSV</Button>
                    <Button size="sm" onPress={() => handleDownload(job.id, 'xlsx')}>XLSX</Button>
                    <Button size="sm" onPress={() => handleDownload(job.id, 'qbo')}>QBO</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
