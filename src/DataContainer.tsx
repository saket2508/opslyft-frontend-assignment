import * as React from "react";
import ChartContainer from "./components/ChartContainer";
import TableCountries from "./components/TableCountries";
import PaginationControl from "./components/PaginationControl";
import {
  fetchCountries,
  fetchGeolocation,
  fetchTimeSeriesData,
  fetchWorldData,
} from "./helper";
import SummaryStats from "./components/SummaryStats";
import SearchBar from "./components/SearchBar";

export default function DataContainer() {
  type chartKey = "newCases" | "newDeaths";
  const legendTitles = {
    newCases: "New Cases",
    newDeaths: "New Deaths",
  };
  const [error, setError] = React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const availablePageSizes = [10, 25, 50];
  const [currPage, setCurrPage] = React.useState<number>(1);
  const [startIndex, setStartIndex] = React.useState<number>(1);
  const [endIndex, setEndIndex] = React.useState<number>(10);
  const [pageSize, setPageSize] = React.useState<number>(10);
  const [isSearching, setIsSearching] = React.useState<boolean>(false);
  const [search, setSearch] = React.useState<string>("");
  const [selectedCountry, setSelectedCountry] = React.useState<string>('');
  const [listCountries, setListCountries] = React.useState<Array<string>>([]);
  const [countrySummary, setCountrySummary] = React.useState<
    Record<string, any>
  >({});
  const chartKeys: chartKey[] = ["newCases", "newDeaths"];
  const [timeSeriesKey, setTimeSeriesKey] =
    React.useState<chartKey>("newCases");
  const [timeSeriesData, setTimeSeriesData] = React.useState<
    Record<string, any>
  >({});
  const [dataCountries, setDataCountries] = React.useState<Array<any>>([]);
  const [tabularData, setTabularData] = React.useState<Array<any>>([]);
  const [worldSummary, setWorldSummary] = React.useState<Record<string, any>>(
    {}
  );
  const [updatedTimeStamp, setUpdatedTimeStamp] = React.useState<string>("");

  React.useEffect(() => {
    (async () => {
      try {
        await fetchData();
      } catch (error) {
        console.error(error);
        setError(true);
      }
    })();
  }, []);

  React.useEffect(() => {
    if(isLoading) {
      return;
    }
    (async () => {
      try {
        const countrySummary = dataCountries.find(
          (country: any) => country["name"] === selectedCountry
        );
        setCountrySummary(countrySummary);
        const countryCode = countrySummary['iso'];
        const timeSeriesData = await fetchTimeSeriesData(
          countryCode
        );
        setTimeSeriesData(timeSeriesData);
      } catch (error) {
        console.error('Could not get time series data');
      }
    })();
  }, [selectedCountry]);

  const fetchData = async () => {
    const { dataCountries } = await fetchCountries();
    const { worldData, updatedTimeStamp } = await fetchWorldData();
    const userCountry = await fetchGeolocation();
    const timeSeriesData = await fetchTimeSeriesData(userCountry);
    const listCountries: Array<string> = [];
    dataCountries.forEach((countryObj: any) => {
      let countryName = countryObj['name'];
      let countryCode = countryObj['iso'];
      listCountries.push(countryName);
    });
    listCountries.sort();
    const countrySummary = dataCountries.find((country: any) => country['iso'] === userCountry);
    const tabularData = dataCountries.slice(startIndex - 1, currPage * pageSize);
    setSelectedCountry(countrySummary['name']);
    setTimeSeriesData(timeSeriesData);
    setWorldSummary(worldData);
    setCountrySummary(countrySummary);
    setTabularData(tabularData);
    setListCountries(listCountries);
    setDataCountries(dataCountries);
    setUpdatedTimeStamp(updatedTimeStamp);
    setIsLoading(false);
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
      e["name"].toLowerCase().includes(query.toLowerCase())
    );
    setTabularData(records);
  };

  function getLastUpdatedDate() {
    let updatedDate = new Date(updatedTimeStamp).toDateString();
    let sub = updatedDate.split(" ");
    let formattedStr = sub.slice(1);
    let formattedDate =
      formattedStr[0] + " " + formattedStr[1] + ", " + formattedStr[2];
    return formattedDate;
  }

  const formatter = new Intl.NumberFormat("en-US");

  if (isLoading) {
    return (
      <div className="mt-3 text-center">
        <small className="text-secondary semibold">
          <div className="spinner-grow spinner-grow-sm me-2" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          Fetching Data
        </small>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-3 text-center">
        <small className="text-danger semibold">
          Error getting data from the server
        </small>
      </div>
    );
  }

  const selectCountry = (countryOption: string) => {
    setSelectedCountry(countryOption);
  };

  return (
    <div className="d-flex flex-column align-items-center">
      <small className="text-secondary semibold mb-3">
        Updated {getLastUpdatedDate()}
      </small>
      <SearchBar listCountries={listCountries} selectCountry={selectCountry} selectedCountry={selectedCountry}/>
      <SummaryStats countrySummary={countrySummary} formatter={formatter} />
      <div className="col-sm-8 col-12 mb-4 px-2">
        <p className="h6 fw-bold">
          {timeSeriesKey === "newCases"
            ? "Newly Reported Cases (Last 3 Months)"
            : "Newly Reported Deaths (Last 3 Months)"}
        </p>
      </div>
      <ChartContainer mode={timeSeriesKey} store={timeSeriesData} />
      <div className="mb-2 d-flex">
        {chartKeys.map((item, idx) =>
          item === timeSeriesKey ? (
            <span className="box-active" key={idx}>
              <small>{legendTitles[item]}</small>
            </span>
          ) : (
            <span
              className="box"
              key={idx}
              onClick={() => setTimeSeriesKey(item)}
            >
              <small>{legendTitles[item]}</small>
            </span>
          )
        )}
      </div>
      <div className="col-12 col-sm-10 px-2 mt-4">
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
        <TableCountries
          isSearching={isSearching}
          worldSummary={worldSummary}
          tabularData={tabularData}
          formatter={formatter}
          startIndex={startIndex}
        />
        <PaginationControl
          currPage={currPage}
          totalItems={dataCountries.length}
          startIndex={startIndex}
          endIndex={endIndex}
          currSize={pageSize}
          availableSizes={availablePageSizes}
          handlePageChange={handlePageChange}
          handlePageSizeChange={handlePageSizeChange}
        />
      </div>
    </div>
  );
}
