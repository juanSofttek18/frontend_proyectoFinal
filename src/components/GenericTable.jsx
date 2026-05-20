function GenericTable({ headers, children }) {
  return (
    <div className="table-responsive-wrapper">
      <table className="generic-table">
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={index}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}
export default GenericTable;