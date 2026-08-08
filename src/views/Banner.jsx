import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function Banner({ success, error }) {
  if (!success && !error) return null;
  const isError = !!error;
  return (
    <div
      className={`flex items-start gap-2 rounded-lg px-4 py-3 text-sm mb-4 ${
        isError ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'
      }`}
    >
      {isError ? <AlertCircle size={16} className="mt-0.5 shrink-0" /> : <CheckCircle2 size={16} className="mt-0.5 shrink-0" />}
      <span>{error || success}</span>
    </div>
  );
}
