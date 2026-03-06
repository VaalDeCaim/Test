'use client';

import { useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { Button, Card, CardContent, CardHeader, Spinner } from '@heroui/react';
import { api } from '@/lib/api';

export default function ConvertPage() {
  const { user, isLoading: userLoading } = useUser();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [jobId, setJobId] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('');
  const [error, setError] = useState<string>('');

  const getToken = async () => {
    const res = await fetch('/api/auth/token');
    const data = await res.json();
    return data.accessToken;
  };

  const handleUpload = async () => {
    if (!file || !user) return;
    setError('');
    setUploading(true);
    try {
      const token = await getToken();
      const ext = file.name.includes('.') ? file.name.slice(file.name.lastIndexOf('.')) : '';
      const safeExt = ['.mt940', '.xml', '.camt053'].includes(ext.toLowerCase()) ? ext : '.mt940';
      const { uploadUrl, key } = await api.initUpload(token, {
        filename: file.name,
        contentType: file.type || 'application/octet-stream',
      });
      await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type || 'application/octet-stream' },
      });
      const job = await api.createJob(token, {
        key,
        originalFilename: file.name,
      });
      setJobId(job.id);
      setStatus('processing');
      pollJob(job.id, token);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const pollJob = async (id: string, token: string) => {
    const interval = setInterval(async () => {
      try {
        const job = await api.getJob(token, id);
        setStatus(job.status);
        if (job.status === 'completed') {
          clearInterval(interval);
        } else if (job.status === 'failed') {
          clearInterval(interval);
          setError('Conversion failed');
        }
      } catch {
        clearInterval(interval);
      }
    }, 2000);
  };

  const handleDownload = async (format: 'csv' | 'xlsx' | 'qbo') => {
    if (!jobId) return;
    try {
      const token = await getToken();
      const { url } = await api.getExportUrl(token, jobId, format);
      window.open(url, '_blank');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Download failed');
    }
  };

  if (userLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="container max-w-2xl space-y-8 p-8">
      <h1 className="text-2xl font-bold">Convert Bank Statement</h1>
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Upload file</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Upload MT940 (.mt940) or CAMT.053 (.xml) file. Max 10MB.
          </p>
          <input
            type="file"
            accept=".mt940,.xml"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="block w-full text-sm"
          />
          <Button
            variant="primary"
            onPress={handleUpload}
            isDisabled={!file || uploading}
          >
            {uploading ? 'Converting...' : 'Convert'}
          </Button>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </CardContent>
      </Card>

      {jobId && (
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Status: {status}</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            {status === 'completed' && (
              <div className="flex gap-2">
                <Button onPress={() => handleDownload('csv')}>Download CSV</Button>
                <Button onPress={() => handleDownload('xlsx')}>Download XLSX</Button>
                <Button onPress={() => handleDownload('qbo')}>Download QBO</Button>
              </div>
            )}
            {status === 'processing' && <Spinner size="sm" />}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
