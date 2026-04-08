function ErrorMessage({ message, onRetry }) {
  return (
    <div className="state-screen">
      <div className="state-card">
        <p className="state-label">Error State</p>
        <h2>Unable to load dashboard</h2>
        <p className="state-copy">{message}</p>
        <button type="button" className="retry-button" onClick={onRetry}>
          Retry
        </button>
      </div>
    </div>
  );
}

export default ErrorMessage;
