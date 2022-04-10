
export const fetchCountryCodes = async (): Promise<Record<string, any>> => {
    const res = await fetch("https://api.covid19api.com/countries");
    const responseData = await res.json();
    const codes: Record<string, any> = {};
    responseData.forEach((item: Record<string, string>) => {
      let name = item["Country"];
      let isoCode = item["ISO2"].toLowerCase();
      let slug = item["Slug"];
      codes[name] = {
        iso: isoCode,
        slug: slug,
      };
    });
    return codes;
  };

export const fetchTabularData = async (): Promise<Record<string, any>> => {
    const res = await fetch("https://api.covid19api.com/summary");
    const reponseData = await res.json();
    const globalData = reponseData["Global"];
    const dataCountries: Array<any> = reponseData["Countries"];
    const sortedCountries = dataCountries.sort(
      (a, b) => b["TotalConfirmed"] - a["TotalConfirmed"]
    );
    const updatedTimeStamp = reponseData["Date"];
    return { sortedCountries, globalData, updatedTimeStamp };
  };

export const fetchTimeSeriesData = async (
    country?: string
  ): Promise<Record<string, any>> => {
    const res = country
      ? await fetch(`https://api.covid19api.com/dayone/country/${country}`)
      : await fetch("https://api.covid19api.com/dayone/country/india");
    const responseData: Array<any> = await res.json();
    const size = responseData.length;
    // Get data from the last four months
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
    return timeSeriesData;
  };