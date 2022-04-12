export default function SummaryStats(props: {
  countrySummary: Record<string, number>;
  formatter: Intl.NumberFormat;
}) {
  const { countrySummary, formatter } = props;
  return (
    <div className="mt-4 mb-3">
      <div className="d-flex w-100">
        <div className="d-flex flex-column align-items-center px-4 semibold confirmedText">
          <small>Confirmed</small>
          <p className="fw-bold mb-0">
            {formatter.format(countrySummary["confirmed"])}
          </p>
          {countrySummary["newCases"] > 0 && (
            <small>+ {formatter.format(countrySummary["newCases"])}</small>
          )}
        </div>
        <div className="d-flex flex-column align-items-center px-4 semibold text-muted">
          <small>Deceased</small>
          <p className="fw-bold mb-0">
            {formatter.format(countrySummary["deaths"])}
          </p>
          {countrySummary["newCases"] > 0 && (
            <small>+ {formatter.format(countrySummary["newDeaths"])}</small>
          )}
        </div>
        <div className="d-flex flex-column align-items-center px-4 semibold recoveredText">
          <small>Recovered</small>
          <p className="fw-bold">{formatter.format(countrySummary["recovered"])}</p>
        </div>
      </div>
    </div>
  );
}
