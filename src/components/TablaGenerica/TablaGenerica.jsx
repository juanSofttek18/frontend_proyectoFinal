import React from 'react';
import './TablaGenerica.css';

const TablaGenerica = ({ columns, data, loading, error, emptyMessage = "No hay datos para mostrar." }) => {
    // Muestra un mensaje mientras los datos están cargando
    if (loading) {
        return <p className="table-state-message">Cargando datos...</p>;
    }

    // Muestra un mensaje si hubo un error en la carga
    if (error) {
        return <p className="table-state-message error-message">{error}</p>;
    }

    // Función para renderizar el contenido de una celda
    const renderCell = (item, column) => {
        // Si la columna tiene un renderizador personalizado (componente o función), lo usa
        if (column.Cell) {
            return column.Cell({ row: { original: item } });
        }
        // Si no, simplemente accede al dato usando la clave (accessor)
        return item[column.accessor];
    };

    return (
        <div className="table-responsive">
            <table className="generic-table">
                <thead>
                    <tr>
                        {columns.map((col) => (
                            <th key={col.Header}>{col.Header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length} className="table-state-message">{emptyMessage}</td>
                        </tr>
                    ) : (
                        data.map((item, rowIndex) => (
                            <tr key={item.id || rowIndex}>
                                {columns.map((col) => <td key={col.Header} className={col.className || ''}>{renderCell(item, col)}</td>)}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default TablaGenerica;