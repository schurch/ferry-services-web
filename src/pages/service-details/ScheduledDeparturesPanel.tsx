import type React from "react";
import type { ScheduledDeparture, Service } from "../../types";
import { formatTime } from "../../utils/date";

export function ScheduledDeparturesPanel({ service }: { service: Service }): React.JSX.Element | null {
  if (!service.scheduledDeparturesAvailable) {
    return null;
  }

  const locationsWithDepartures = service.locations.filter(
    (currentLocation) => currentLocation.scheduledDepartures.length > 0
  );

  if (locationsWithDepartures.length === 0) {
    return null;
  }

  return (
    <>
      <div className="panel-divider" />
      <h2 className="title card-subtitle">Scheduled Departures</h2>
      {locationsWithDepartures
        .sort((a, b) => {
          const aFirst = a.scheduledDepartures[0]?.departure ?? "";
          const bFirst = b.scheduledDepartures[0]?.departure ?? "";
          return aFirst.localeCompare(bFirst);
        })
        .map((currentLocation) => {
          const groupedByDestination = new Map<number, ScheduledDeparture[]>();
          for (const departure of currentLocation.scheduledDepartures) {
            const existing = groupedByDestination.get(departure.destination.id) ?? [];
            existing.push(departure);
            groupedByDestination.set(departure.destination.id, existing);
          }

          return Array.from(groupedByDestination.entries()).map(([destinationId, departures]) => {
            const destinationName = departures[0]?.destination.name ?? "Destination";
            return (
              <article className="departures-route" key={`${currentLocation.id}-${destinationId}`}>
                <h3>
                  {currentLocation.name} to {destinationName}
                </h3>
                {departures
                  .slice()
                  .sort((a, b) => a.departure.localeCompare(b.departure))
                  .map((departure) => {
                    const hasDeparted = new Date(departure.departure).getTime() < Date.now();
                    return (
                      <div
                        className={`departure-row ${hasDeparted ? "departure-dim" : ""}`}
                        key={`${departure.departure}-${departure.arrival}`}
                      >
                        <span>{formatTime(departure.departure)}</span>
                        <span>{formatTime(departure.arrival)}</span>
                      </div>
                    );
                  })}
              </article>
            );
          });
        })}
    </>
  );
}
