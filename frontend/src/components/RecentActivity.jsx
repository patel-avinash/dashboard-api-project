function RecentActivity({ data }) {
  if (!data?.length) {
    return (
      <section className="table-section">
        <div className="section-header">
          <h3>Recent Activity</h3>
        </div>
        <p className="empty-state">No recent activity available.</p>
      </section>
    );
  }

  return (
    <section className="table-section">
      <div className="section-header">
        <h3>Recent Activity</h3>
      </div>

      <div className="table-wrap">
        <table className="activity-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Age</th>
            </tr>
          </thead>

          <tbody>
            {data.map((user, index) => (
              <tr key={index}>
                <td>{user.firstName} {user.lastName}</td>
                <td>{user.email}</td>
                <td>{user.age}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default RecentActivity;
