export default function PaginationControl(props: {
  currPage: number;
  totalItems: number;
  startIndex: number;
  endIndex: number;
  currSize: number;
  availableSizes: Array<number>;
  handlePageChange: (newPage: number) => void;
  handlePageSizeChange: (newPageSize: number) => void;
}) {
  const {
    currPage,
    totalItems,
    startIndex,
    endIndex,
    currSize,
    availableSizes,
    handlePageChange,
    handlePageSizeChange,
  } = props;

  return (
    <div className="mt-1 pb-3 d-flex justify-content-end semibold">
      <small className="me-3 d-flex">
        <span onClick={() => handlePageChange(currPage - 1)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            fill="currentColor"
            className="bi bi-chevron-left"
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"
            />
          </svg>
        </span>
        <p className="px-1">
          {startIndex} - {endIndex} of {totalItems}
        </p>
        <span onClick={() => handlePageChange(currPage + 1)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            fill="currentColor"
            className="bi bi-chevron-right"
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
            />
          </svg>
        </span>
      </small>
      <div className="d-flex">
        <small className="text-sm semibold">Rows per page:</small>
        <span className="ms-2">
          <div className="dropdown" style={{ marginTop: "-4px" }}>
            <button
              className="btn btn-sm btn-outline-dark dropdown-toggle rounded-pill"
              type="button"
              id="dropdownMenuButton1"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {currSize}
            </button>
            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
              {availableSizes.map((size, idx) => (
                <li
                  className="dropdown-item"
                  key={idx}
                  onClick={() => handlePageSizeChange(size)}
                >
                  <span>{size}</span>
                </li>
              ))}
            </ul>
          </div>
        </span>
      </div>
    </div>
  );
}
