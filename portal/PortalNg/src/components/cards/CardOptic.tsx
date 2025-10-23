// Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
// // CardOptic.tsx
// import React, { ReactNode } from 'react';

// interface CardOpticProps {
//   title?: string;
//   category?: string;
//   children?: ReactNode;
//   imageUrl?: string;
//   imageAlt?: string;
// }

// const CardOptic: React.FC<CardOpticProps> = ({ title, category, children, imageUrl, imageAlt }) => {
//   return (
//     <div className="card p-10 bg-slate-400 dark:bg-gray-700 text-gray-800 dark:text-white overflow-hidden flex align-middle" style={{ minHeight: '15rem' }}>
//       {imageUrl && <img src={imageUrl} alt={imageAlt} className="card-img-top" />}
//       <div className="card-body">
//         {title && <h4 className="card-title">{title}</h4>}
//         {category && <p className="card-category">{category}</p>}
//         {children}
//       </div>
//     </div>
//   );
// };

// export default CardOptic;
