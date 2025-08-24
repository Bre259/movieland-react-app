import React from "react";
import "./BackIcon.css";

const BackIcon = ({
  onClick,
  size = 24,
  color = "#333",
  className = "",
  label = "Back",
  showLabel = true,
  style = "arrow", // 'arrow', 'chevron', or 'text'
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      // Default behavior: go back in browser history
      window.history.back();
    }
  };

  const renderIcon = () => {
    switch (style) {
      case "chevron":
        return (
          <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15,18 9,12 15,6"></polyline>
          </svg>
        );
      case "text":
        return <span style={{ color, fontSize: size }}>←</span>;
      default: // arrow
        return (
          <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12,19 5,12 12,5"></polyline>
          </svg>
        );
    }
  };

  return (
    <button
      className={`back-icon ${className}`}
      onClick={handleClick}
      aria-label={label}
      title={label}
    >
      <span className="back-icon-symbol">{renderIcon()}</span>
      {showLabel && <span className="back-icon-label">{label}</span>}
    </button>
  );
};

export default BackIcon;
