import './RouteLoader.css';

/** Shown while a route chunk downloads. Text stays readable; no spinner glare. */
export function RouteLoader({ label = 'Opening the notebook' }: { label?: string }) {
  return (
    <div className="route-loader" role="status" aria-live="polite">
      <span className="mono-label">{label}</span>
      <span className="route-loader__line" aria-hidden="true" />
    </div>
  );
}
