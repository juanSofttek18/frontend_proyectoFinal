import React from "react";
import "./Pagination.css";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i);

  return (
    <div className="pagination-container">
      <button
        className="pagination-btn arrow"
        disabled={currentPage === 0}
        onClick={() => onPageChange(currentPage - 1)}
        aria-label="Página anterior"
      >
        &lsaquo; Anterior
      </button>

      <div className="pagination-pages">
        {pages.map((page) => (
          <button
            key={page}
            className={`pagination-btn page-num ${page === currentPage ? "active" : ""}`}
            onClick={() => onPageChange(page)}
          >
            {page + 1}
          </button>
        ))}
      </div>

      <button
        className="pagination-btn arrow"
        disabled={currentPage === totalPages - 1}
        onClick={() => onPageChange(currentPage + 1)}
        aria-label="Página siguiente"
      >
        Siguiente &rsaquo;
      </button>
    </div>
  );
}
