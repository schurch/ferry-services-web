import type React from "react";
import { useCallback, useEffect, useState } from "react";
import { Navigate, useLocation, useParams } from "react-router-dom";
import { fetchService } from "../api/services";
import { AppPromo } from "../components/AppPromo";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeading } from "../components/SiteHeading";
import type { Service } from "../types";
import { toDateInput } from "../utils/date";
import { DisruptionDetailsModal } from "./service-details/DisruptionDetailsModal";
import { ScheduledDeparturesPanel } from "./service-details/ScheduledDeparturesPanel";
import { ServiceSummaryPanel } from "./service-details/ServiceSummaryPanel";

export function ServiceDetailsPage(): React.JSX.Element {
  const params = useParams();
  const location = useLocation();
  const serviceId = Number(params.id);
  const initialService = (location.state as { service?: Service } | null)?.service;

  const [service, setService] = useState<Service | null>(initialService ?? null);
  const [dateValue] = useState(() => toDateInput(new Date()));
  const [loading, setLoading] = useState(!initialService);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showDisruptionModal, setShowDisruptionModal] = useState(false);

  const loadDetails = useCallback(async () => {
    if (Number.isNaN(serviceId)) {
      setErrorMessage("Invalid service ID.");
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const latest = await fetchService(serviceId, dateValue);
      setService(latest);
    } catch {
      setErrorMessage("Could not load latest service details.");
    } finally {
      setLoading(false);
    }
  }, [dateValue, serviceId]);

  useEffect(() => {
    void loadDetails();
  }, [loadDetails]);

  if (Number.isNaN(serviceId)) {
    return <Navigate to="/" replace />;
  }

  const hasAdditionalInfo = Boolean(service?.additionalInfo && service.additionalInfo.trim().length > 0);

  useEffect(() => {
    if (!showDisruptionModal) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowDisruptionModal(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [showDisruptionModal]);

  return (
    <main>
      <SiteHeading />
      <div className="content-with-promo">
        <div className="primary-content">
          {loading && <p className="muted">Loading service details...</p>}
          {!loading && errorMessage && <p className="muted">{errorMessage}</p>}

          {service && (
            <>
              <ServiceSummaryPanel
                service={service}
                hasAdditionalInfo={hasAdditionalInfo}
                onOpenDisruptionDetails={() => setShowDisruptionModal(true)}
              />
              <ScheduledDeparturesPanel service={service} />
            </>
          )}
        </div>
        <aside className="promo-column">
          <AppPromo />
        </aside>
      </div>
      {service && hasAdditionalInfo && showDisruptionModal && (
        <DisruptionDetailsModal
          area={service.area}
          additionalInfo={service.additionalInfo ?? ""}
          onClose={() => setShowDisruptionModal(false)}
        />
      )}
      <SiteFooter />
    </main>
  );
}
