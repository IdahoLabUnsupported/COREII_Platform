// Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
import * as React from 'react';

type Props = {
  availableYears: number[],
  selectedYears: number[],
  onYearSelect: (years: number[]) => void
};

const TimelineAllAttacks: React.FC<Props> = ({
  availableYears,
  selectedYears,
  onYearSelect
}) => {

  const toggleYearSelection = (year: number) => {
    if (selectedYears.includes(year)) {
      onYearSelect(selectedYears.filter(y => y !== year));
    } else {
      onYearSelect([...selectedYears, year]);
    }
  };

  return (
    <>
      <ul className="steps w-full pt-1">
        {availableYears.map((year, index) => (
          <li 
          key={index}
          data-content=""
          className={selectedYears.includes(year) ? "step step-primary" : "step"}
          onClick={() => toggleYearSelection(year)}
          >
            {year}
          </li>
        ))}
      </ul>
    </>
  );
}

const MemoizedTimelineAllAttacks = React.memo(TimelineAllAttacks);

export default MemoizedTimelineAllAttacks;
