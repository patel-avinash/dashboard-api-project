function MetricsCards({ data }) {
  return (
    <section className="cards">
      <article className="card">
        <p className="card-label">Total Users</p>
        <h3>{data.total_users}</h3>
        <p className="card-note">Fetched from the users API</p>
      </article>

      <article className="card">
        <p className="card-label">Total Sales</p>
        <h3>Rs. {data.total_sales}</h3>
        <p className="card-note">Calculated from the products API</p>
      </article>
    </section>
  );
}

export default MetricsCards;
