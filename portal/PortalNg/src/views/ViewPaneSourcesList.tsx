// Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
// React
import * as React from 'react';

type Props = object;

const ViewPaneSourcesList: React.FC<Props> = () => {
  return (
    <div className="view-pane-component p-10 flex flex-1 flex-grow">
      <div>
        <p className="text-3xl">
          Sources
        </p>
        <p>
          Initial Content
        </p>
      </div>
    </div>
  );
}

export default ViewPaneSourcesList;