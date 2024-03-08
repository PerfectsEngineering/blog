import React, { useCallback, useState } from 'react'
import { Collapse } from 'antd'

const { Panel } = Collapse

export const Collapsible = ({ title, expanded, children, className }) => {
  const [expanedState, setExpandedState] = useState(expanded)
  const toggleExpandedState = useCallback(
    (selectedIndices) => {
      setExpandedState(selectedIndices.length > 0)
    },
    [expanedState]
  )

  const titleElement = (
    <div>
      {title}
      &nbsp;
      <br />
      <small>
        <em>Tap to {expanedState ? 'collapse' : 'expand'}</em>
      </small>
    </div>
  )
  return (
    <Collapse
      activeKey={expanedState ? '1' : null}
      defaultActiveKey={expanedState ? '1' : null}
      onChange={toggleExpandedState}
      className={className}
    >
      <Panel header={titleElement} key="1">
        {children}
        {/* <button onClick={() => { setExpandedState(false) }}>
          Close
        </button> */}
      </Panel>
    </Collapse>
  )
}
