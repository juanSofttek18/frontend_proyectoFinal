function GenericTable({ headers, children }) {
return(
    <div>
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
<<<<<<< HEAD
);
=======

)

>>>>>>> feature/Alejandro
}
export default GenericTable;