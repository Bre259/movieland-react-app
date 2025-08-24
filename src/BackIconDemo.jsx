import React, { useState } from "react";
import BackIcon from "./BackIcon";
import "./BackIconDemo.css";

const BackIconDemo = ({ onClose }) => {
  const [currentExample, setCurrentExample] = useState("basic");

  const examples = {
    basic: {
      title: "Basic Back Icon",
      description: "Simple back button with default styling",
      component: <BackIcon onClick={onClose} />,
    },
    minimal: {
      title: "Minimal Back Icon",
      description: "Icon only without text label",
      component: (
        <BackIcon onClick={onClose} showLabel={false} className="minimal" />
      ),
    },
    styled: {
      title: "Styled Back Icons",
      description: "Different color variants",
      component: (
        <div className="styled-examples">
          <BackIcon onClick={onClose} className="primary" label="Primary" />
          <BackIcon onClick={onClose} className="secondary" label="Secondary" />
          <BackIcon onClick={onClose} className="success" label="Success" />
          <BackIcon onClick={onClose} className="danger" label="Danger" />
        </div>
      ),
    },
    sizes: {
      title: "Different Sizes",
      description: "Various size options",
      component: (
        <div className="size-examples">
          <BackIcon
            onClick={onClose}
            className="compact"
            label="Compact"
            size={16}
          />
          <BackIcon onClick={onClose} label="Default" size={24} />
          <BackIcon
            onClick={onClose}
            className="large"
            label="Large"
            size={32}
          />
        </div>
      ),
    },
    styles: {
      title: "Different Icon Styles",
      description: "Arrow, chevron, and text styles",
      component: (
        <div className="style-examples">
          <BackIcon onClick={onClose} style="arrow" label="Arrow" />
          <BackIcon onClick={onClose} style="chevron" label="Chevron" />
          <BackIcon onClick={onClose} style="text" label="Text" />
        </div>
      ),
    },
  };

  return (
    <div className="back-icon-demo">
      <div className="demo-header">
        <BackIcon onClick={onClose} label="Back to App" className="primary" />
        <h1>BackIcon Component Demo</h1>
      </div>

      <div className="demo-navigation">
        {Object.keys(examples).map((key) => (
          <button
            key={key}
            className={`demo-nav-btn ${currentExample === key ? "active" : ""}`}
            onClick={() => setCurrentExample(key)}
          >
            {examples[key].title}
          </button>
        ))}
      </div>

      <div className="demo-content">
        <div className="example-section">
          <h2>{examples[currentExample].title}</h2>
          <p>{examples[currentExample].description}</p>

          <div className="example-preview">
            {examples[currentExample].component}
          </div>

          <div className="example-code">
            <h3>Code Example:</h3>
            <pre>
              <code>
                {currentExample === "basic" &&
                  `<BackIcon onClick={handleBack} />`}
                {currentExample === "minimal" &&
                  `<BackIcon 
  onClick={handleBack} 
  showLabel={false} 
  className="minimal" 
/>`}
                {currentExample === "styled" &&
                  `<BackIcon onClick={handleBack} className="primary" label="Primary" />
<BackIcon onClick={handleBack} className="secondary" label="Secondary" />
<BackIcon onClick={handleBack} className="success" label="Success" />
<BackIcon onClick={handleBack} className="danger" label="Danger" />`}
                {currentExample === "sizes" &&
                  `<BackIcon onClick={handleBack} className="compact" size={16} />
<BackIcon onClick={handleBack} size={24} />
<BackIcon onClick={handleBack} className="large" size={32} />`}
                {currentExample === "styles" &&
                  `<BackIcon onClick={handleBack} style="arrow" />
<BackIcon onClick={handleBack} style="chevron" />
<BackIcon onClick={handleBack} style="text" />`}
              </code>
            </pre>
          </div>
        </div>

        <div className="usage-section">
          <h3>Usage Instructions:</h3>
          <ul>
            <li>
              <strong>Basic Usage:</strong> Just import and use{" "}
              <code>&lt;BackIcon /&gt;</code>
            </li>
            <li>
              <strong>Custom Click Handler:</strong> Pass your own function to{" "}
              <code>onClick</code> prop
            </li>
            <li>
              <strong>Styling:</strong> Use <code>className</code> prop for
              custom CSS classes
            </li>
            <li>
              <strong>Size Control:</strong> Use <code>size</code> prop to
              control icon size
            </li>
            <li>
              <strong>Hide Label:</strong> Set{" "}
              <code>showLabel={`{false}`}</code> to hide text
            </li>
            <li>
              <strong>Icon Style:</strong> Use <code>style</code> prop: "arrow",
              "chevron", or "text"
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BackIconDemo;
