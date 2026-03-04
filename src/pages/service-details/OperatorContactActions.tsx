import type React from "react";
import type { ServiceOperator } from "../../types";

export function OperatorContactActions({ operator }: { operator: ServiceOperator }): React.JSX.Element {
  return (
    <>
      <div className="panel-divider" />
      <h2 className="title card-subtitle">{operator.name}</h2>
      <div className="inline-buttons">
        {operator.localNumber && (
          <a className="button" href={`tel:${operator.localNumber.split(" ").join("-")}`}>
            Phone
          </a>
        )}
        {operator.website && (
          <a className="button" href={operator.website} target="_blank" rel="noreferrer">
            Website
          </a>
        )}
        {operator.email && (
          <a className="button" href={`mailto:${operator.email}`}>
            Email
          </a>
        )}
        {operator.x && (
          <a className="button" href={operator.x} target="_blank" rel="noreferrer">
            X
          </a>
        )}
        {operator.facebook && (
          <a className="button" href={operator.facebook} target="_blank" rel="noreferrer">
            Facebook
          </a>
        )}
      </div>
    </>
  );
}
