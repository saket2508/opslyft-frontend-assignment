import * as React from "react";
import ReactCountryFlag from "react-country-flag";

export default function DataContainer() {
  const availablePageSizes = [10, 25, 50];
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [currPage, setCurrPage] = React.useState<number>(1);
  const [startIndex, setStartIndex] = React.useState<number>(1);
  const [endIndex, setEndIndex] = React.useState<number>(10);
  const [pageSize, setPageSize] = React.useState<number>(10);
  const [isSearching, setIsSearching] = React.useState<boolean>(false);
  const [search, setSearch] = React.useState<string>("");
  const [dataCountries, setDataCountries] = React.useState<Array<any>>([]);
  const [tabularData, setTabularData] = React.useState<Array<any>>([]);
  const [worldSummary, setWorldSummary] = React.useState<Record<string, any>>(
    {}
  );

  React.useEffect(() => {
    (async () => {
      await fetchData();
    })();
  }, []);

  const fetchData = async () => {
    const { sortedCountries, globalData } = await fetchTabularData();
    setWorldSummary(globalData);
    setDataCountries(sortedCountries);
    const initialData = sortedCountries.slice(
      startIndex - 1,
      currPage * pageSize
    );
    setTabularData(initialData);
    setIsLoading(false);
  };

  const fetchTabularData = async (): Promise<Record<string, any>> => {
    const res = await fetch("https://api.covid19api.com/summary");
    const reponseData = await res.json();
    const globalData = reponseData["Global"];
    const dataCountries: Array<any> = reponseData["Countries"];
    const sortedCountries = dataCountries.sort(
      (a, b) => b["TotalConfirmed"] - a["TotalConfirmed"]
    );
    return { sortedCountries, globalData };
  };

  const handlePageSizeChange = (newPageSize: number) => {
    let newStartIdx = (currPage - 1) * newPageSize + 1;
    let newEndIdx = currPage * newPageSize;
    if (newEndIdx > dataCountries.length) {
      let nearestMultiple = Math.floor(dataCountries.length / newPageSize);
      const records = dataCountries.slice(
        nearestMultiple * newPageSize,
        dataCountries.length
      );
      setPageSize(newPageSize);
      setCurrPage(nearestMultiple);
      setTabularData(records);
      setStartIndex(nearestMultiple * newPageSize);
      setEndIndex(dataCountries.length);
    } else {
      const records = dataCountries.slice(newStartIdx - 1, newEndIdx);
      setTabularData(records);
      setPageSize(newPageSize);
      setStartIndex(newStartIdx);
      setEndIndex(newEndIdx);
    }
  };

  const handlePageChange = (newPage: number) => {
    // write your logic here
    let newStartIdx = (newPage - 1) * pageSize + 1;
    let newEndIdx = newPage * pageSize;
    if (newPage === 0) {
      return;
    }
    if (newEndIdx > dataCountries.length) {
      if (newStartIdx < dataCountries.length) {
        const records = dataCountries.slice(newStartIdx, dataCountries.length);
        setCurrPage(newPage);
        setStartIndex(newStartIdx);
        setEndIndex(dataCountries.length);
        setTabularData(records);
        return;
      } else {
        return;
      }
    }
    setCurrPage(newPage);
    setStartIndex(newStartIdx);
    setEndIndex(newEndIdx);
    const records = dataCountries.slice(newStartIdx - 1, newEndIdx);
    setTabularData(records);
  };

  const handleSearchResults = (query: string) => {
    if (query.length < 3) {
      if (isSearching) {
        setIsSearching(false);
        const records = dataCountries.slice(startIndex - 1, endIndex);
        setTabularData(records);
      }
      return;
    }
    if (!isSearching) {
      setIsSearching(true);
    }
    console.log(query);
    const records = dataCountries.filter((e) =>
      e["Country"].toLowerCase().includes(query.toLowerCase())
    );
    setTabularData(records);
  };

  const formatter = new Intl.NumberFormat("en-US");

  if (isLoading) {
    return (
      <div className="mt-2">
        <div className="text-center text-muted text-sm fw-bold">
          Getting Data...
        </div>
      </div>
    );
  }

  // fetch data from API and display chart and table here
  return (
    <div className="col-12 col-sm-10 px-2">
      {/* Search */}
      <div className="mb-3">
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            handleSearchResults(e.target.value);
          }}
          className="form-control fixedWidth rounded-pill"
          type="text"
          placeholder="Search Countries"
          aria-label="Search Countries"
        />
      </div>
      <div className="table-responsive">
        <table className="table table-striped table-hover table-borderless">
          <thead className="table-secondary">
            <tr className="text-muted">
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Confirmed Cases</th>
              <th scope="col">Deaths</th>
              <th scope="col">Recovered</th>
            </tr>
          </thead>
          <tbody>
            <tr className="table-warning">
              <td></td>
              <td>
                <span className="me-2">🌎</span>
                World
              </td>
              <td>{formatter.format(worldSummary["TotalConfirmed"])}</td>
              <td>{formatter.format(worldSummary["TotalDeaths"])}</td>
              <td>{formatter.format(worldSummary["TotalRecovered"])}</td>
            </tr>
            {tabularData.length > 0 ? (
              tabularData.map((row: any, idx) => {
                return (
                  <tr key={idx}>
                    <th scope="row">
                      {isSearching ? idx + 1 : idx + startIndex}
                    </th>
                    <td>
                      <div className="d-flex align-items-center">
                        <span className="me-2">
                          <ReactCountryFlag
                            svg
                            countryCode={row["CountryCode"]}
                            style={{
                              fontSize: "1.4em",
                              lineHeight: "1.4em",
                            }}
                            aria-label={row["Country"]}
                          />
                        </span>
                        {row["Country"]}
                      </div>
                    </td>
                    <td>{formatter.format(row["TotalConfirmed"])}</td>
                    <td>{formatter.format(row["TotalDeaths"])}</td>
                    <td>{formatter.format(row["TotalRecovered"])}</td>
                  </tr>
                );
              })
            ) : (
              <tr className="table-danger">
                <td colSpan={5}>
                  <p className="text-center semibold text-sm">No Results Found</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="mt-1 d-flex justify-content-end">
        <small className="me-3 semibold d-flex">
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
                fill-rule="evenodd"
                d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"
              />
            </svg>
          </span>
          <p className="px-1">
            {startIndex} - {endIndex} of {dataCountries.length}
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
                fill-rule="evenodd"
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
                {pageSize}
              </button>
              <ul
                className="dropdown-menu"
                aria-labelledby="dropdownMenuButton1"
              >
                {availablePageSizes.map((size, idx) => (
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
    </div>
  );
}
