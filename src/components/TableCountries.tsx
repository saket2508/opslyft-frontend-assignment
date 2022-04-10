import ReactCountryFlag from "react-country-flag";

type Props = {
    isSearching: boolean;
    worldSummary: Record<string, any>;
    tabularData: Array<Record<string, any>>;
    formatter: Intl.NumberFormat;
    startIndex: number;
}

export default function TableCountries({
    isSearching,
    worldSummary,
    tabularData,
    formatter,
    startIndex
}: Props) {
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
                <td>
                  {formatter.format(worldSummary["TotalConfirmed"])}
                  {worldSummary[""]}
                </td>
                <td>{formatter.format(worldSummary["TotalDeaths"])}</td>
                <td>NA</td>
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
                            <ReactCountryFlag
                              countryCode={row["CountryCode"]}
                              svg
                              style={{
                                width: "1.6em",
                                height: "1.6em",
                              }}
                              title={row["CountryCode"]}
                            />
                          </span>
                          {row["Country"]}
                        </div>
                      </td>
                      <td>
                        {formatter.format(row["TotalConfirmed"])}
                        {row["NewConfirmed"] > 0 && (
                          <small>
                            <span className="badge rounded-pill bg-danger ms-1">
                              + {formatter.format(row["NewConfirmed"])}
                            </span>
                          </small>
                        )}
                      </td>
                      <td>
                        {formatter.format(row["TotalDeaths"])}
                        {row["NewDeaths"] > 0 && (
                          <small>
                            <span className="badge rounded-pill bg-secondary ms-2">
                              + {formatter.format(row["NewDeaths"])}
                            </span>
                          </small>
                        )}
                      </td>
                      <td>NA</td>
                    </tr>
                  );
                })
              ) : (
                <tr className="table-danger">
                  <td colSpan={5}>
                    <small className="text-center semibold">
                      No Results Found
                    </small>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
    )
}