export default function LoadingSpinner({ label }: { label?: string }) {
  return (
    <div className="loading-container">
      <div className="spinner" role="status" aria-label={label ?? 'Loading'} />
      {label && (
        <p className="loading-label">{label}</p>
      )}
    </div>
  );
}
