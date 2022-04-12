export default function TableCountries(props: {
  isSearching: boolean;
  worldSummary: Record<string, any>;
  tabularData: Array<Record<string, any>>;
  formatter: Intl.NumberFormat;
  startIndex: number;
}) {
  const { isSearching, worldSummary, tabularData, formatter, startIndex } =
    props;
  return (
    <div className="table-responsive">
      <table className="table table-striped table-hover table-borderless">
        <thead className="table-secondary">
          <tr className="text-sm">
            <th scope="col">
              <small>#</small>
            </th>
            <th scope="col">
              <small>Name</small>
            </th>
            <th scope="col">
              <small>Confirmed</small>
            </th>
            <th scope="col">
              <small>Deceased</small>
            </th>
            <th scope="col">
              <small>Recovered</small>
            </th>
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
            <td>{formatter.format(worldSummary["deaths"])}</td>
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
                        <img src={row['flagImg']} className='circularAvatar'/>
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
                    {formatter.format(row["deaths"])}
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
