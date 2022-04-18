import React from 'react';
import { Status } from "./Types";

export default function StatusCircle(props: { status: Status }) {
  const width = 20;
  switch (props.status) {
    case Status.Normal:
      return <CircleWithFill fill="#6AB557" width={width} title="Normal services" />
    case Status.Disrupted:
      return <CircleWithFill fill="#FD940A" width={width} title="Services disrupted" />
    case Status.Cancelled:
      return <CircleWithFill fill="#D62A0B" width={width} title="Services cancelled" />
    case Status.Unknown:
      return <CircleWithFill fill="#D7D7D7" width={width} title="Service status unknown" />
  }
}

function CircleWithFill(props: { fill: string, width: number, title: string }) {
  return (
    <svg role="img" width={props.width} height={props.width}>
      <circle cx={props.width / 2} cy={props.width / 2} r={props.width / 2} fill={props.fill} />
      <title>{props.title}</title>
    </svg>
  )
}