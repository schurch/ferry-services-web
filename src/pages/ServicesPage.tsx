import type React from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { fetchServices } from "../api/services";
import { SERVICES_CACHE } from "../constants";
import { AppPromo } from "../components/AppPromo";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeading } from "../components/SiteHeading";
import type { Service } from "../types";
import { statusLabel } from "../utils/status";

export function ServicesPage(): React.JSX.Element {
  const [services, setServices] = useState<Service[]>([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadServices = useCallback(async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const latest = await fetchServices();
      setServices(latest);
      localStorage.setItem(SERVICES_CACHE, JSON.stringify(latest));
    } catch {
      const cached = localStorage.getItem(SERVICES_CACHE);
      if (cached) {
        try {
          setServices(JSON.parse(cached) as Service[]);
          setErrorMessage("Live refresh failed. Showing cached data.");
        } catch {
          setErrorMessage("Could not load services.");
        }
      } else {
        setErrorMessage("Could not load services.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadServices();
  }, [loadServices]);

  const filtered = useMemo(() => {
    const query = searchText.trim().toLowerCase();
    if (!query) {
      return services;
    }

    return services.filter((service) => {
      return service.area.toLowerCase().includes(query) || service.route.toLowerCase().includes(query);
    });
  }, [searchText, services]);

  const grouped = useMemo(() => {
    const groups = new Map<string, Service[]>();

    for (const service of filtered) {
      const key = service.operator?.name ?? "Services";
      const existing = groups.get(key) ?? [];
      existing.push(service);
      groups.set(key, existing);
    }

    return Array.from(groups.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [filtered]);

  return (
    <main>
      <SiteHeading />
      <div className="content-with-promo">
        <div className="primary-content">
          <div className="header">
            <div className="controls">
              <input
                className="search"
                type="search"
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                placeholder="Search by area or route"
                aria-label="Search services"
              />
            </div>
          </div>

          {loading && <p className="muted">Loading services...</p>}
          {!loading && errorMessage && <p className="muted">{errorMessage}</p>}

          {!loading && grouped.length === 0 && <p className="muted">No services found.</p>}

          {grouped.map(([groupName, groupServices]) => (
            <section className="group" key={groupName}>
              <h2>{groupName}</h2>
              {groupServices.map((service) => (
                <Link
                  key={service.serviceId}
                  className="row-link"
                  to={`/service/${service.serviceId}`}
                  state={{ service }}
                >
                  <article className="row">
                    <span className={`status-dot status-${service.status}`} aria-hidden="true" />
                    <div className="row-main">
                      <strong>{service.area}</strong>
                      <div className="route">{service.route}</div>
                      <div className={`status-text status-${service.status}`}>{statusLabel(service.status)}</div>
                    </div>
                  </article>
                </Link>
              ))}
            </section>
          ))}
        </div>
        <aside className="promo-column">
          <AppPromo />
        </aside>
      </div>
      <SiteFooter />
    </main>
  );
}
