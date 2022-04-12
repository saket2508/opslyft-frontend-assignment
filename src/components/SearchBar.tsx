import * as React from "react";

const Suggestions = (props: {
  items: Array<string>;
  isSearching: boolean;
  handleSelect: (option: string) => void;
}) => {
  const { items, isSearching, handleSelect } = props;
  if (!isSearching) {
    return <div></div>;
  }
  if (items.length === 0) {
    return (
      <div className="bg-white border border-1 container d-block">
        <div className="fst-italic text-secondary p-1">No options found</div>
      </div>
    );
  }
  return (
    <div className="bg-white border border-1 container d-block">
      {items.map((item, idx) => (
        <div className="p-1" key={idx} onClick={() => handleSelect(item)}>
          {item}
        </div>
      ))}
    </div>
  );
};

export default function SearchBar(props: {
  listCountries: Array<string>;
  selectCountry: (countryOption: string) => void;
  selectedCountry: string;
}) {
  const { listCountries, selectCountry, selectedCountry } = props;
  const [isSearching, setIsSeatching] = React.useState<boolean>(false);
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [listFiltered, setListFiltered] = React.useState<Array<string>>([
    ...listCountries,
  ]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let query = e.target.value;
    setSearchQuery(query);
    if (query.length > 3) {
      setIsSeatching(true);
      const optionsFiltered = listCountries.filter((country) =>
        country.toLowerCase().includes(query.toLowerCase())
      );
      setListFiltered(optionsFiltered);
    } else {
      if (isSearching) {
        setListFiltered([...listCountries]);
        setIsSeatching(false);
      }
    }
  };

  const handleSelect = (option: string) => {
    setSearchQuery(option);
    selectCountry(option);
    setIsSeatching(false);
  };

  return (
    <div className="mt-1 searchBar">
      <input
        value={searchQuery}
        className="form-control fixedWidth rounded-pill"
        type={"text"}
        placeholder={selectedCountry}
        aria-label="Search"
        onChange={handleChange}
      />
      <div className="optionsContainer">
        <Suggestions
          items={listFiltered}
          isSearching={isSearching}
          handleSelect={handleSelect}
        />
      </div>
    </div>
  );
}
