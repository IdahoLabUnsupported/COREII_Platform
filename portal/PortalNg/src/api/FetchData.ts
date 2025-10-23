// Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
import { useState, useEffect } from "react";
export function FetchData(url) {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    fetch(url)
    .then((res) => res.json())
    .then((data) => setData(data))
    .catch((err) => console.log(`Error: ${err}`));
  }, [url]);
  return { data };
}


