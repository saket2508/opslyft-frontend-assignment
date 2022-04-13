export default function TableCountries(props: {
  sortedKeys: Record<string, any>;
  handleSortKeyChange: (keyName: string) => void;
  isSearching: boolean;
  worldSummary: Record<string, any>;
  tabularData: Array<Record<string, any>>;
  formatter: Intl.NumberFormat;
  startIndex: number;
}) {
  function getLabel(keyName: string) {
    return keyName.charAt(0).toUpperCase() + keyName.slice(1);
  }

  function getSortedIcon(isAscending: boolean) {
    if (isAscending) {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className="bi bi-sort-up-alt"
          viewBox="0 0 16 16"
        >
          <path d="M3.5 13.5a.5.5 0 0 1-1 0V4.707L1.354 5.854a.5.5 0 1 1-.708-.708l2-1.999.007-.007a.498.498 0 0 1 .7.006l2 2a.5.5 0 1 1-.707.708L3.5 4.707V13.5zm4-9.5a.5.5 0 0 1 0-1h1a.5.5 0 0 1 0 1h-1zm0 3a.5.5 0 0 1 0-1h3a.5.5 0 0 1 0 1h-3zm0 3a.5.5 0 0 1 0-1h5a.5.5 0 0 1 0 1h-5zM7 12.5a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 0-1h-7a.5.5 0 0 0-.5.5z" />
        </svg>
      );
    }
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        fill="currentColor"
        className="bi bi-sort-down"
        viewBox="0 0 16 16"
      >
        <path d="M3.5 2.5a.5.5 0 0 0-1 0v8.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L3.5 11.293V2.5zm3.5 1a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zM7.5 6a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zm0 3a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1h-3zm0 3a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1h-1z" />
      </svg>
    );
  }

  const {
    sortedKeys,
    handleSortKeyChange,
    isSearching,
    worldSummary,
    tabularData,
    formatter,
    startIndex,
  } = props;
  return (
    <div className="table-responsive">
      <table className="table table-striped table-hover table-borderless">
        <thead className="table-secondary">
          <tr className="text-sm">
            <th scope="col">
              <small>#</small>
            </th>
            {Object.keys(sortedKeys).map((keyName, idx) => (
              <th scope="col" key={idx} onClick={() => handleSortKeyChange(keyName)}>
                <small>{getLabel(keyName)}</small>
                {sortedKeys[keyName].isSorted && (
                  <span className="text-secondary ps-1">
                    {getSortedIcon(sortedKeys[keyName].isAscending)}
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="table-warning">
            <td></td>
            <td>
              <span className="me-2">🌎</span>
              World
            </td>
            <td>{formatter.format(worldSummary["confirmed"])}</td>
            <td>{formatter.format(worldSummary["deceased"])}</td>
            <td>{formatter.format(worldSummary["recovered"])}</td>
          </tr>
          {tabularData.length > 0 ? (
            tabularData.map((row: any, idx) => {
              return (
                <tr key={idx}>
                  <th scope="row" className="align-middle">
                    {isSearching ? idx + 1 : idx + startIndex}
                  </th>
                  <td>
                    <div className="d-flex align-items-center">
                      <span className="me-2">
                        <img src={row["flagImg"]} className="circularAvatar" />
                      </span>
                      {row["name"]}
                    </div>
                  </td>
                  <td>
                    {formatter.format(row["confirmed"])}
                    {row["newCases"] > 0 && (
                      <small>
                        <span
                          className="badge rounded-pill bg-danger ms-1"
                          style={{
                            paddingLeft: "0.4em",
                            paddingRight: "0.4em",
                          }}
                        >
                          + {formatter.format(row["newCases"])}
                        </span>
                      </small>
                    )}
                  </td>
                  <td>
                    {formatter.format(row["deceased"])}
                    {row["newDeaths"] > 0 && (
                      <small>
                        <span
                          className="badge rounded-pill bg-secondary ms-1"
                          style={{
                            paddingLeft: "0.4em",
                            paddingRight: "0.4em",
                          }}
                        >
                          + {formatter.format(row["newDeaths"])}
                        </span>
                      </small>
                    )}
                  </td>
                  <td>{formatter.format(row["recovered"])}</td>
                </tr>
              );
            })
          ) : (
            <tr className="table-danger">
              <td colSpan={5}>
                <small className="text-center semibold">No Results Found</small>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
