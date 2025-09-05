import React from "react";

const SkeletonCard = () => {
  return (
    <div className="skeleton-card">
      <div className="skeleton-poster"></div>
      <div className="skeleton-content">
        <div className="skeleton-title"></div>
        <div className="skeleton-year"></div>
        <div className="skeleton-type"></div>
      </div>
    </div>
  );
};

export default SkeletonCard;
