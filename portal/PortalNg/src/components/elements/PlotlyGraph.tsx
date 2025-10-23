// Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
// // React
// import React from 'react';
//
// // Imports
// import Plot from "react-plotly.js";
//
// type Props = {
//   data: any[];
//   layout: any;
//   xAxisLabel?: string;
//   yAxisLabel?: string;
// };
//
// const PlotlyGraph: React.FC<Props> = ({
//   data,
//   layout
// }) => {
//
//   const combinedLayout = React.useMemo(() => ({
//     ...layout,
//     autosize: true,
//     plot_bgcolor: 'transparent',
//     paper_bgcolor: 'transparent',
//     font: {
//       family: 'Source Sans Pro, sans-serif',
//       color: '#ffffff',
//     },
//     responsive: true,
//     margin: {
//       t: 20,
//       l: 70,
//       b: 20,
//       r: 40,
//     },
//     barmode: layout.barmode,
//     bargap: layout.bargap,
//     shapes: layout.shapes,
//     annotations: layout.annotations,
//     xaxis: { ...layout.xaxis, autorange: true, },
//     yaxis: { ...layout.yaxis, autorange: true, },
//     yaxis2: { ...layout.yaxis2, autorange: true, },
//   }), [layout]);
//
//   return (
//     <>
//       <Plot
//         data={data}
//         layout={combinedLayout}
//         useResizeHandler={true}
//         className="w-full"
//       />
//     </>
//   );
// };
//
// export default PlotlyGraph;
