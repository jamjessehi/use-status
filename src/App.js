import React, { useState } from "react";
import StateDemo from "./StateDemo";
import ReducerDemo from "./ReducerDemo";
import "./App.css";

export default () => {
  const [tab, setTab] = useState(0);

  let Content = () => null;

  if (tab === 0) {
    Content = StateDemo;
  }

  if (tab === 1) {
    Content = ReducerDemo;
  }

  const tabPaneClasses = i => {
    const cls = ["tab-pane"];

    if (i === tab) {
      cls.push("checked");
    }

    return cls.join(" ");
  };

  return (
    <div>
      <div className="tabs">
        <div className={tabPaneClasses(0)} onClick={() => setTab(0)}>
          StateDemo
        </div>
        <div className={tabPaneClasses(1)} onClick={() => setTab(1)}>
          ReducerDemo
        </div>
      </div>
      <Content />
    </div>
  );
};
