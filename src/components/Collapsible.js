import React from "react";
import { Collapse } from 'antd';

const { Panel } = Collapse


export const Collapsible = ({ title, expanded, children }) => {
  return <Collapse defaultActiveKey={expanded ? "1" : null}>
    <Panel header={title} key="1">
      {children}
    </Panel>
  </Collapse>;
}