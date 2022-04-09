import * as React from "react";
import Select from 'react-select';
import ChartContainer from "./ChartContainer";

export default function DataContainer() {
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const availablePageSizes = [10, 25, 50];
  const [currPage, setCurrPage] = React.useState<number>(1);
  const [startIndex, setStartIndex] = React.useState<number>(1);
  const [endIndex, setEndIndex] = React.useState<number>(10);
  const [pageSize, setPageSize] = React.useState<number>(10);
  const [isSearching, setIsSearching] = React.useState<boolean>(false);
  const [search, setSearch] = React.useState<string>("");
  const [selectedCountry, setSelectedCountry] = React.useState<string>("India");
  const [countryCodes, setCountryCodes] = React.useState<
    Record<string, any>
  >({});
  const [listCountries, setListCountries] = React.useState<Array<any>>([]);
  const [countrySummary, setCountrySummary] = React.useState<Record<string, any>>({});
  const [timeSeriesData, setTimeSeriesData] = React.useState<
    Record<string, any>
  >({});
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

  React.useEffect(() => {
    (async () => {
      const timeSeriesData = await fetchTimeSeriesData(countryCodes[selectedCountry]['slug']);
      const countrySummary = dataCountries.find((country: any) => country['Country'] === selectedCountry);
      setTimeSeriesData(timeSeriesData);
      setCountrySummary(countrySummary);
    })();
  }, [selectedCountry])

  const fetchData = async () => {
    const codes = await fetchCountryCodes();
    const { sortedCountries, globalData } = await fetchTabularData();
    const timeSeriesData = await fetchTimeSeriesData();
    let sortedCountryNames = Object.keys(codes).sort();
    let countryOptions = sortedCountryNames.map((country) => {
      return { label: country, value: country };
    });
    const countrySummary = sortedCountries.find((country: any) => country['Country'] === 'India');
    setListCountries(countryOptions);
    setCountryCodes(codes);
    setTimeSeriesData(timeSeriesData);
    setWorldSummary(globalData);
    setDataCountries(sortedCountries);
    setCountrySummary(countrySummary);
    const initialData = sortedCountries.slice(
      startIndex - 1,
      currPage * pageSize
    );
    setTabularData(initialData);
    setIsLoading(false);
  };

  const fetchCountryCodes = async (): Promise<Record<string, any>> => {
    const res = await fetch("https://api.covid19api.com/countries");
    const responseData = await res.json();
    const codes: Record<string, any> = {};
    responseData.forEach((item: Record<string, string>) => {
      let name = item["Country"];
      let isoCode = item["ISO2"].toLowerCase();
      let slug = item['Slug'];
      codes[name] = {
        'iso':isoCode,
        'slug': slug
      };
    });
    return codes;
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

  const fetchTimeSeriesData = async (
    country?: string
  ): Promise<Record<string, any>> => {
    const res = country
      ? await fetch(`https://api.covid19api.com/dayone/country/${country}`)
      : await fetch("https://api.covid19api.com/dayone/country/india");
    const responseData: Array<any> = await res.json();
    const size = responseData.length;
    // Get data from the last three months
    const timeSeriesData: Record<string, any> = {
      newCases: {},
      newDeaths: {},
    };
    for (let i = 122; i >= 1; i -= 1) {
      let newCases =
        responseData[size - i]["Confirmed"] -
        responseData[size - i - 1]["Confirmed"];
      let newDeaths =
        responseData[size - i]["Deaths"] - responseData[size - i - 1]["Deaths"];
      let date = responseData[size - i]["Date"];
      timeSeriesData["newCases"][date] = newCases;
      timeSeriesData["newDeaths"][date] = newDeaths;
    }
    console.log(timeSeriesData);
    return timeSeriesData;
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
    const records = dataCountries.filter((e) =>
      e["Country"].toLowerCase().includes(query.toLowerCase())
    );
    setTabularData(records);
  };

  const formatter = new Intl.NumberFormat("en-US");

  if (isLoading) {
    return (
      <div className="mt-4">
        <div className="text-center text-muted text-sm">Getting Data...</div>
      </div>
    );
  }

  // fetch data from API and display chart and table here
  return (
    <div className="d-flex flex-column align-items-center">
      <div className="mt-1 fixedWidth">
        <Select
          className="basic-single"
          classNamePrefix="select"
          options={listCountries}
          defaultValue={listCountries.find(option => option['label'] === 'India')}
          name='listCountries'
          onChange={(option) => setSelectedCountry(option.label)}
        />
      </div>
      <p className="semibold mt-4 mb-2 text-secondary text-center">
        New Cases in {selectedCountry}
        <span className="ms-2">
          <img
            src={`https://hatscripts.github.io/circle-flags/flags/${countryCodes[selectedCountry]['iso']}.svg`}
            width="24"
          />
        </span>
      </p>
      <ChartContainer store={timeSeriesData} />
      <div className="col-12 col-sm-10 px-2 mt-3">
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
            placeholder="Search"
            aria-label="Search"
          />
        </div>
        <div className="table-responsive">
          <table className="table table-striped table-hover table-borderless">
            <thead className="table-secondary">
              <tr className="text-sm">
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
                            <img
                              src={`https://hatscripts.github.io/circle-flags/flags/${row[
                                "CountryCode"
                              ].toLowerCase()}.svg`}
                              width="24"
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
                    <p className="text-center semibold text-sm">
                      No Results Found
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="mt-1 d-flex justify-content-end semibold">
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
    </div>
  );
}