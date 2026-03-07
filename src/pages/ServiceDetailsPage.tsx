import type React from "react";
import { useCallback, useEffect, useState } from "react";
import { Navigate, useLocation, useParams, useSearchParams } from "react-router-dom";
import { fetchService } from "../api/services";
import { AppPromo } from "../components/AppPromo";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeading } from "../components/SiteHeading";
import type { Service } from "../types";
import { isDateInput, toDateInput } from "../utils/date";
import { DisruptionDetailsModal } from "./service-details/DisruptionDetailsModal";
import { ServiceSummaryPanel } from "./service-details/ServiceSummaryPanel";

export function ServiceDetailsPage(): React.JSX.Element {
  const params = useParams();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const serviceId = Number(params.id);
  const initialService = (location.state as { service?: Service } | null)?.service;
  const defaultDateValue = toDateInput(new Date());
  const searchDateValue = searchParams.get("departuresDate");
  const dateValue = isDateInput(searchDateValue) ? searchDateValue : defaultDateValue;

  const [service, setService] = useState<Service | null>(initialService ?? null);
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
    const nextService = initialService?.serviceId === serviceId ? initialService : null;
    setService(nextService);
    setLoading(!nextService);
    setErrorMessage(null);
  }, [serviceId]);

  useEffect(() => {
    void loadDetails();
  }, [serviceId]);

  useEffect(() => {
    if (searchDateValue === dateValue) {
      return;
    }

    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("departuresDate", dateValue);
    setSearchParams(nextParams, { replace: true });
  }, [dateValue, searchDateValue, searchParams, setSearchParams]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [serviceId]);

  const handleDeparturesDateChange = (nextDate: string) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("departuresDate", nextDate);
    setSearchParams(nextParams);
  };

  const handleOpenDisruptionDetails = useCallback(() => {
    setShowDisruptionModal(true);
  }, []);

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
                departuresDate={dateValue}
                departuresInitialLocations={service.locations}
                departuresInitialScheduledDeparturesAvailable={service.scheduledDeparturesAvailable}
                service={service}
                hasAdditionalInfo={hasAdditionalInfo}
                onDeparturesDateChange={handleDeparturesDateChange}
                onOpenDisruptionDetails={handleOpenDisruptionDetails}
              />
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
