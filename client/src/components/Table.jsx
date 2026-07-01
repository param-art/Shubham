import React from 'react'
import './Table.css'

function Table({ columns, data, onEdit, onDelete }) {
  return (
    <div className="table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map(col => (
              <th key={col}>{col}</th>
            ))}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={row._id || index}>
              {columns.map(col => (
                <td key={`${row._id}-${col}`}>{row[col] || '-'}</td>
              ))}
              <td className="actions">
                {onEdit && (
                  <button className="btn-edit" onClick={() => onEdit(row)}>
                    ✏️ Edit
                  </button>
                )}
                {onDelete && (
                  <button className="btn-delete" onClick={() => onDelete(row._id)}>
                    🗑️ Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {data.length === 0 && (
        <div className="no-data">No data found</div>
      )}
    </div>
  )
}

export default Table
