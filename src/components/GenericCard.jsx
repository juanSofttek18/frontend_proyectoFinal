import "./GenericCard.css";

function GenericCard({ title, subtitle, children, actions }) {
  return (
    <section className="generic-card">
      {(title || subtitle) && (
        <div className="generic-card-header">
          {title && <h2>{title}</h2>}
          {subtitle && <p>{subtitle}</p>}
        </div>
      )}

      <div className="generic-card-content">
        {children}
      </div>

      {actions && (
        <div className="generic-card-actions">
          {actions}
        </div>
      )}
    </section>
  );
}

export default GenericCard;