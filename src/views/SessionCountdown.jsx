import { useSessionCountdown } from '../controllers/useSessionCountdown.js';

function formatTime(totalSeconds) {
  const clamped = Math.max(totalSeconds, 0);
  const h = String(Math.floor(clamped / 3600)).padStart(2, '0');
  const m = String(Math.floor((clamped % 3600) / 60)).padStart(2, '0');
  const s = String(clamped % 60).padStart(2, '0');
  return `${h}:${m}:${s}`;
}

export default function SessionCountdown() {
  const secondsLeft = useSessionCountdown();
  if (secondsLeft == null) return null;

  const low = secondsLeft <= 300; // last 5 minutes

  return (
    <div
      className={`fixed bottom-4 left-4 z-50 rounded-xl border px-4 py-2.5 text-sm font-medium shadow-soft ${
        low ? 'bg-red-50 border-red-200 text-red-700' : 'bg-white border-gray-200 text-gray-600'
      }`}
    >
      Session expires in <span className="font-mono">{formatTime(secondsLeft)}</span>
    </div>
  );
}
