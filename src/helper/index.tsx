export const fetchGeolocation = async(): Promise<string> => {
  return 'India';
}

export const fetchWorldData = async(): Promise<Record<string, any>> => {
  const res = await fetch("https://disease.sh/v3/covid-19/all");
  const responseData = await res.json();
  const worldData = {
    'confirmed': responseData['cases'],
    'deaths': responseData['deaths'],  
    'recovered': responseData['recovered'],  
  }
  const updatedTimeStamp = responseData['updated'];
  return { worldData, updatedTimeStamp };
}

export const fetchCountries = async (): Promise<Record<string, any>> => {
  const res = await fetch("https://disease.sh/v3/covid-19/countries");
  const responseData: Array<Record<string, any>> = await res.json();
  const getCountryName = (name: string) => {
    if(name === 'USA') {
      return 'United States of America';
    } else if(name === 'UK') {
      return 'United Kingdom';
    } else if(name === 'S. Korea') {
      return 'South Korea';
    } else {
      return name;
    }
  }
  const parsedData = responseData.map((item: any) => ({ 
    'name': getCountryName(item['country']),
    'confirmed': item['cases'],
    'newCases': item['todayCases'],
    'deaths': item['deaths'],
    'newDeaths': item['todayDeaths'],
    'recovered': item['recovered'],
    'iso': item['countryInfo']['iso2'],
    'flagImg': item['countryInfo']['flag']
  }))
  const descSortedData = parsedData.sort((a, b) => b['confirmed'] - a['confirmed']);
  return { dataCountries: descSortedData };
};

export const fetchTimeSeriesData = async (
  countryCode?: string
): Promise<Record<string, any>> => {
  const res = countryCode
    ? await fetch(`https://disease.sh/v3/covid-19/historical/${countryCode}?lastdays=91`)
    : await fetch(`https://disease.sh/v3/covid-19/historical/in?lastdays=91`);
  const responseData: Record<string, any> = await res.json();
  // Get data from the last three months
  const timeSeriesData: Record<string, any> = {
    newCases: {},
    newDeaths: {},
  };
  const casesData = responseData['timeline']['cases'];
  const deathsData = responseData['timeline']['deaths'];
  let dates = Object.keys(casesData);
  for(let i = 1; i < dates.length; i++) {
    const currDate = dates[i];
    const prevDate = dates[i-1];
    const newCases = casesData[currDate] - casesData[prevDate];
    const newDeaths = deathsData[currDate] - deathsData[prevDate];
    timeSeriesData['newCases'][currDate] = newCases;
    timeSeriesData['newDeaths'][currDate] = newDeaths;
  }
  return timeSeriesData;
};
