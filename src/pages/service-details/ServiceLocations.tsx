import type React from "react";
import type { Service } from "../../types";
import { formatTime } from "../../utils/date";

export function ServiceLocations({ service }: { service: Service }): React.JSX.Element {
  return (
    <>
      <h2 className="title card-subtitle">Locations</h2>
      <div className="grid">
        {service.locations
          .slice()
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((serviceLocation) => (
            <article className="location" key={serviceLocation.id}>
              <h3>{serviceLocation.name}</h3>
              {serviceLocation.nextDeparture && (
                <p className="small" style={{ margin: "6px 0" }}>
                  Next ferry: {formatTime(serviceLocation.nextDeparture.departure)} to{" "}
                  {serviceLocation.nextDeparture.destination.name}
                </p>
              )}
              {serviceLocation.nextRailDeparture && (
                <p className="small" style={{ margin: "6px 0" }}>
                  Next rail: {formatTime(serviceLocation.nextRailDeparture.departure)} to {serviceLocation.nextRailDeparture.to}
                  {serviceLocation.nextRailDeparture.platform ? ` • Platform ${serviceLocation.nextRailDeparture.platform}` : ""}
                  {serviceLocation.nextRailDeparture.departureInfo
                    ? ` • ${serviceLocation.nextRailDeparture.departureInfo}`
                    : ""}
                </p>
              )}
              {serviceLocation.weather && (
                <p className="small muted" style={{ margin: "6px 0" }}>
                  Weather: {serviceLocation.weather.temperatureCelsius}C, {serviceLocation.weather.description}, wind{" "}
                  {serviceLocation.weather.windSpeedMph} mph {serviceLocation.weather.windDirectionCardinal}
                </p>
              )}
            </article>
          ))}
      </div>
    </>
  );
}
