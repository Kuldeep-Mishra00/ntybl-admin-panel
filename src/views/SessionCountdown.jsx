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

  return (
    <div className="fixed bottom-4 lg:bottom-28 left-4 z-50 rounded-xl border bg-red-50 border-red-200 text-red-700 px-4 py-2.5 text-sm font-medium shadow-soft">
      Session expires in <span className="font-mono">{formatTime(secondsLeft)}</span>
    </div>
  );
}
