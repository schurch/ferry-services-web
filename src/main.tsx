import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ReactDOM from "react-dom/client";
import {
  HashRouter,
  Link,
  Navigate,
  Route,
  Routes,
  useLocation,
  useParams
} from "react-router-dom";

type ServiceStatus = "normal" | "disrupted" | "cancelled" | "unknown";

type Service = {
  serviceId: number;
  status: ServiceStatus;
  area: string;
  route: string;
  disruptionReason: string | null;
  lastUpdatedDate: string | null;
  updated: string | null;
  additionalInfo: string | null;
  locations: Location[];
  vessels: Vessel[];
  operator: ServiceOperator | null;
  scheduledDeparturesAvailable: boolean;
};

type Location = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  weather: Weather | null;
  scheduledDepartures: ScheduledDeparture[];
  nextDeparture: ScheduledDeparture | null;
  nextRailDeparture: RailDeparture | null;
};

type Weather = {
  description: string;
  icon: string;
  temperatureCelsius: number;
  windSpeedMph: number;
  windDirection: number;
  windDirectionCardinal: string;
};

type ScheduledDeparture = {
  departure: string;
  arrival: string;
  destination: {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
  };
};

type RailDeparture = {
  from: string;
  to: string;
  departure: string;
  departureInfo: string;
  isCancelled: boolean;
  platform: string | null;
};

type Vessel = {
  latitude: number;
  longitude: number;
  name: string;
  speed: number | null;
  course: number | null;
  lastReceived: string | null;
};

type ServiceOperator = {
  id: number;
  name: string;
  website: string | null;
  localNumber: string | null;
  internationalNumber: string | null;
  email: string | null;
  x: string | null;
  facebook: string | null;
};

type ApiService = {
  service_id: number;
  status: number;
  area: string;
  route: string;
  disruption_reason: string | null;
  last_updated_date: string | null;
  updated: string | null;
  additional_info: string | null;
  locations: ApiLocation[];
  vessels: ApiVessel[] | null;
  operator: ApiOperator | null;
  scheduled_departures_available?: boolean | null;
};

type ApiLocation = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  weather: ApiWeather | null;
  scheduled_departures?: ApiScheduledDeparture[] | null;
  next_departure?: ApiScheduledDeparture | null;
  next_rail_departure?: ApiRailDeparture | null;
};

type ApiWeather = {
  description: string;
  icon: string;
  temperature_celsius: number;
  wind_speed_mph: number;
  wind_direction: number;
  wind_direction_cardinal: string;
};

type ApiScheduledDeparture = {
  departure: string;
  arrival: string;
  destination: {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
  };
};

type ApiRailDeparture = {
  from: string;
  to: string;
  departure: string;
  departure_info: string;
  is_cancelled: boolean;
  platform: string | null;
};

type ApiVessel = {
  latitude: number;
  longitude: number;
  name: string;
  speed: number | null;
  course: number | null;
  last_received?: string | null;
};

type ApiOperator = {
  id: number;
  name: string;
  website: string | null;
  local_number: string | null;
  international_number: string | null;
  email: string | null;
  x: string | null;
  facebook: string | null;
};

const API_BASE = "/api";
const SERVICES_CACHE = "ferry-services-web.services.v1";
const GOOGLE_MAPS_API_KEY = (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined)?.trim();

const styles = `
@import url("https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap");

:root {
  --brand: #21bfaa;
  --brand-2: #0a2540;
  --ink: #10243e;
  --ink-soft: #425466;
  --surface: #ffffff;
  --surface-soft: #f6f9fc;
  --border: #dfe8f1;
  --line: #e4ebf2;
  --link: #21bfaa;
  --focus: #21bfaa;
  --card: #ffffff;
  --text: #10243e;
  --muted: #425466;
  --bg: #f6f9fc;
  --row-bg-start: #ffffff;
  --row-bg-end: #fbfdff;
  --panel-bg-start: #ffffff;
  --panel-bg-end: #f9fcff;
  --button-bg-start: #ffffff;
  --button-bg-end: #f6f9ff;
  --button-hover-bg: #edf3ff;
  --chip-bg: rgba(255, 255, 255, 0.65);
  --search-bg: rgba(255, 255, 255, 0.85);
  --shadow-soft: 0 10px 24px rgba(15, 34, 58, 0.08);
  --shadow-strong: 0 14px 30px rgba(15, 34, 58, 0.13);
  --shadow-panel: 0 10px 28px rgba(15, 34, 58, 0.09);
  --shadow-map: 0 10px 28px rgba(15, 34, 58, 0.14);
  --divider: rgba(16, 36, 62, 0.12);
  --modal-overlay: rgba(10, 27, 44, 0.45);
  --modal-bg: #ffffff;
  --modal-shadow: 0 20px 60px rgba(10, 27, 44, 0.35);
  --modal-border: rgba(16, 36, 62, 0.12);
  --map-placeholder-start: #f2f7ff;
  --map-placeholder-end: #ffffff;
  --green: #11865a;
  --amber: #ba7608;
  --red: #b53333;
  --gray: #67788d;
  --radius: 14px;
}

:root[data-theme="dark"] {
  --brand: #3cd7c2;
  --ink: #eff6ff;
  --ink-soft: #9bb1c8;
  --surface: #182634;
  --surface-soft: #0b1725;
  --border: #2a3c51;
  --line: #2a3c51;
  --link: #59d9c7;
  --focus: #59d9c7;
  --card: #182634;
  --text: #eff6ff;
  --muted: #9bb1c8;
  --bg: #081423;
  --row-bg-start: #162638;
  --row-bg-end: #1b2f44;
  --panel-bg-start: #162638;
  --panel-bg-end: #1a2d40;
  --button-bg-start: #1d3348;
  --button-bg-end: #182c40;
  --button-hover-bg: #243d55;
  --chip-bg: rgba(21, 37, 55, 0.9);
  --search-bg: rgba(14, 27, 41, 0.9);
  --shadow-soft: 0 10px 24px rgba(0, 0, 0, 0.34);
  --shadow-strong: 0 14px 30px rgba(0, 0, 0, 0.45);
  --shadow-panel: 0 10px 28px rgba(0, 0, 0, 0.35);
  --shadow-map: 0 10px 28px rgba(0, 0, 0, 0.45);
  --divider: rgba(155, 177, 200, 0.3);
  --modal-overlay: rgba(5, 10, 15, 0.72);
  --modal-bg: #142234;
  --modal-shadow: 0 20px 60px rgba(0, 0, 0, 0.56);
  --modal-border: rgba(155, 177, 200, 0.28);
  --map-placeholder-start: #0e1d2f;
  --map-placeholder-end: #162638;
  --green: #59d996;
  --amber: #e7b052;
  --red: #ef7f7f;
  --gray: #afbfce;
}
* { box-sizing: border-box; }
body {
  margin: 0;
  font-family: "Manrope", "Avenir Next", "Segoe UI", sans-serif;
  color: var(--text);
  background: var(--bg);
  min-height: 100vh;
}
a { color: var(--link); text-decoration-thickness: 1px; text-underline-offset: 2px; }
main {
  max-width: 1040px;
  margin: 0 auto;
  padding: 20px 18px 34px;
  animation: fade-in 360ms ease-out;
}
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 20px;
}
.title {
  margin: 0;
  letter-spacing: -0.03em;
  font-size: clamp(1.55rem, 2.8vw, 2rem);
  line-height: 1.1;
}
.title-link {
  color: inherit;
  text-decoration: none;
}
.title-link:hover {
  text-decoration: none;
}
.page-intro {
  margin-bottom: 22px;
  padding: 0;
  border-radius: 20px;
  color: var(--text);
  background: transparent;
  box-shadow: none;
}
.page-intro .title { color: var(--text); font-size: clamp(1.8rem, 3.5vw, 2.5rem); margin-bottom: 6px; }
.page-subtitle { margin: 0; font-size: 1.05rem; font-weight: 500; opacity: 0.92; }
.meta-row {
  margin-top: 16px;
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 8px;
}
.meta-chip {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 36px;
  background: var(--chip-bg);
  border: none;
  border-radius: 999px;
  padding: 7px 10px;
  font-size: 0.8rem;
  letter-spacing: 0.01em;
  backdrop-filter: blur(4px);
}
.controls { display: flex; gap: 8px; flex-wrap: wrap; }
input, button { font: inherit; }
.search {
  width: min(560px, 100%);
  padding: 12px 14px 12px 38px;
  border: none;
  border-radius: var(--radius);
  background: var(--search-bg);
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%2360778f" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><line x1="16.65" y1="16.65" x2="21" y2="21"/></svg>');
  background-repeat: no-repeat;
  background-position: 12px center;
  background-size: 16px 16px;
  box-shadow: 0 4px 16px rgba(16, 36, 62, 0.06);
  margin-bottom: 14px;
}
.search:focus { outline: 2px solid var(--focus); outline-offset: 1px; }
.button {
  border: none;
  background: linear-gradient(180deg, var(--button-bg-start) 0%, var(--button-bg-end) 100%);
  color: var(--text);
  padding: 10px 13px;
  border-radius: var(--radius);
  cursor: pointer;
  text-decoration: none;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(16, 36, 62, 0.08);
}
.button:hover { background: var(--button-hover-bg); border-color: var(--border); }
.group { margin-bottom: 30px; }
.group h2 {
  font-size: 0.78rem;
  margin: 0 0 8px 2px;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.09em;
  font-weight: 800;
}
.row-link { text-decoration: none; color: inherit; }
.row {
  background: linear-gradient(180deg, var(--row-bg-start) 0%, var(--row-bg-end) 100%);
  border: none;
  border-radius: var(--radius);
  padding: 13px 14px;
  display: flex;
  gap: 12px;
  margin-bottom: 10px;
  align-items: flex-start;
  box-shadow: var(--shadow-soft);
  transition: transform 120ms ease, box-shadow 120ms ease, border-color 120ms ease;
}
.row:hover { transform: translateY(-1px); box-shadow: var(--shadow-strong); }
.row-main { min-width: 0; flex: 1; }
.row-main strong { display: block; font-size: 1rem; letter-spacing: -0.01em; font-weight: 700; }
.row-main .route { color: var(--muted); margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.row-main .status-text { margin-top: 6px; font-size: 0.9rem; font-weight: 600; }
.status-dot { width: 12px; height: 12px; border-radius: 50%; flex-shrink: 0; margin-right: 7px; }
.row .status-dot { margin-left: 8px; margin-top: 6px; }
.status-pill .status-dot { margin-left: 0; }
.status-inline {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 12px;
}
.status-normal { color: var(--green); }
.status-disrupted { color: var(--amber); }
.status-cancelled { color: var(--red); }
.status-unknown { color: var(--gray); }
.status-dot.status-normal { background: var(--green); }
.status-dot.status-disrupted { background: var(--amber); }
.status-dot.status-cancelled { background: var(--red); }
.status-dot.status-unknown { background: var(--gray); }
.status-pill {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  border: none;
  border-radius: 999px;
  padding: 7px 12px;
  background: var(--surface);
  box-shadow: inset 0 -1px 0 rgba(16, 36, 62, 0.04);
}
.panel {
  background: linear-gradient(180deg, var(--panel-bg-start) 0%, var(--panel-bg-end) 100%);
  border: none;
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: var(--shadow-panel);
}
.muted { color: var(--muted); }
.small { font-size: 0.9rem; }
.grid { display: grid; gap: 12px; }
.location {
  border: none;
  border-radius: 12px;
  padding: 12px;
  background: var(--surface);
}
.location h3 { margin: 0 0 8px 0; font-size: 1rem; }
.departure-row { display: flex; justify-content: space-between; gap: 8px; font-size: 0.95rem; padding: 4px 0; }
.departure-dim { opacity: 0.5; }
.inline-buttons { display: flex; gap: 8px; flex-wrap: wrap; }
.detail-headline { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-bottom: 10px; }
.card-subtitle {
  font-size: 1.1rem;
  margin: 18px 0 10px;
}
.panel-divider {
  height: 1px;
  background: var(--divider);
  margin: 14px -16px 0;
}
.service-summary {
  margin-bottom: 14px;
}
.map-shell {
  border-radius: 18px;
  overflow: hidden;
  margin-bottom: 16px;
  box-shadow: var(--shadow-map);
}
.panel-map-bleed {
  margin: 12px -16px 0;
}
.panel-map-bleed .map-shell {
  margin: 0;
  border-radius: 0;
  box-shadow: none;
}
.map-frame {
  width: 100%;
  height: min(42vh, 320px);
  border: 0;
  display: block;
}
.map-mount {
  width: 100%;
  height: min(42vh, 320px);
}
.map-missing-key {
  width: 100%;
  height: min(42vh, 320px);
  display: grid;
  place-items: center;
  padding: 20px;
  background: linear-gradient(180deg, var(--map-placeholder-start) 0%, var(--map-placeholder-end) 100%);
  color: var(--muted);
  text-align: center;
  line-height: 1.45;
}
.site-footer {
  margin-top: 28px;
  background: transparent;
  color: var(--text);
  border-radius: 0;
  padding: 0;
  box-shadow: none;
}
.site-footer h2 {
  margin: 0 0 6px;
  font-size: 1.1rem;
  letter-spacing: -0.01em;
}
.site-footer p {
  margin: 0;
  line-height: 1.45;
}
.site-footer a {
  color: var(--link);
}
.link-button {
  border: 0;
  padding: 0;
  background: transparent;
  color: var(--link);
  font: inherit;
  cursor: pointer;
}
.link-button:hover {
  text-decoration: underline;
}
.app-promo {
  margin-top: 0;
  border-radius: 0;
  overflow: visible;
  background: transparent;
  box-shadow: none;
}
.app-promo-shot {
  display: block;
  width: min(100%, 170px);
  height: auto;
  object-fit: contain;
  background: transparent;
  margin: 12px auto 4px;
}
.app-promo-content {
  padding: 14px 16px 16px;
  background: transparent;
  text-align: center;
}
.app-promo-content h2 {
  margin: 0 0 6px;
  font-size: 1.2rem;
}
.app-promo-content p {
  margin: 0 0 12px;
  color: var(--muted);
}
.store-links {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
}
.store-links a {
  display: inline-block;
}
.store-links img {
  height: 44px;
  width: auto;
  display: block;
}
.content-with-promo {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 300px;
  gap: 18px;
  align-items: start;
  padding-left: 0;
}
.primary-content {
  min-width: 0;
}
.promo-column {
  min-width: 0;
  position: sticky;
  top: 16px;
  align-self: start;
  padding-top: 98px;
  padding-bottom: 28px;
}
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: var(--modal-overlay);
  display: grid;
  place-items: center;
  padding: 20px;
  z-index: 1000;
}
.modal-panel {
  width: min(780px, 100%);
  max-height: min(82vh, 900px);
  overflow: auto;
  background: var(--modal-bg);
  border-radius: 14px;
  box-shadow: var(--modal-shadow);
}
.modal-head {
  position: sticky;
  top: 0;
  background: var(--modal-bg);
  border-bottom: 1px solid var(--modal-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
}
.modal-head h2 {
  margin: 0;
  font-size: 1.05rem;
}
.modal-close {
  border: 0;
  background: transparent;
  color: var(--text);
  font-size: 1.2rem;
  cursor: pointer;
  line-height: 1;
}
.modal-content {
  padding: 14px;
}
@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
@media (max-width: 700px) {
  .header { flex-direction: column; align-items: stretch; }
  .search { width: 100%; }
  .page-intro { padding: 0; border-radius: 0; }
  .page-intro .title { font-size: 1.65rem; }
  .page-subtitle { font-size: 1rem; }
  .meta-row { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .meta-chip { min-height: 34px; }
  .store-links img { height: 40px; }
  .content-with-promo { grid-template-columns: 1fr; padding-left: 0; }
  .promo-column { padding-top: 0; position: static; top: auto; }
}
`;

function toStatus(value: number): ServiceStatus {
  if (value === 0) return "normal";
  if (value === 1) return "disrupted";
  if (value === 2) return "cancelled";
  return "unknown";
}

function toService(raw: ApiService): Service {
  return {
    serviceId: raw.service_id,
    status: toStatus(raw.status),
    area: raw.area,
    route: raw.route,
    disruptionReason: raw.disruption_reason,
    lastUpdatedDate: raw.last_updated_date,
    updated: raw.updated,
    additionalInfo: raw.additional_info,
    locations: (raw.locations ?? []).map((location) => ({
      id: location.id,
      name: location.name,
      latitude: location.latitude,
      longitude: location.longitude,
      weather: location.weather
        ? {
            description: location.weather.description,
            icon: location.weather.icon,
            temperatureCelsius: location.weather.temperature_celsius,
            windSpeedMph: location.weather.wind_speed_mph,
            windDirection: location.weather.wind_direction,
            windDirectionCardinal: location.weather.wind_direction_cardinal
          }
        : null,
      scheduledDepartures: (location.scheduled_departures ?? []).map((departure) => ({
        departure: departure.departure,
        arrival: departure.arrival,
        destination: departure.destination
      })),
      nextDeparture: location.next_departure
        ? {
            departure: location.next_departure.departure,
            arrival: location.next_departure.arrival,
            destination: location.next_departure.destination
          }
        : null,
      nextRailDeparture: location.next_rail_departure
        ? {
            from: location.next_rail_departure.from,
            to: location.next_rail_departure.to,
            departure: location.next_rail_departure.departure,
            departureInfo: location.next_rail_departure.departure_info,
            isCancelled: location.next_rail_departure.is_cancelled,
            platform: location.next_rail_departure.platform
          }
        : null
    })),
    vessels: (raw.vessels ?? []).map((vessel) => ({
      latitude: vessel.latitude,
      longitude: vessel.longitude,
      name: vessel.name,
      speed: vessel.speed,
      course: vessel.course,
      lastReceived: vessel.last_received ?? null
    })),
    operator: raw.operator
      ? {
          id: raw.operator.id,
          name: raw.operator.name,
          website: raw.operator.website,
          localNumber: raw.operator.local_number,
          internationalNumber: raw.operator.international_number,
          email: raw.operator.email,
          x: raw.operator.x,
          facebook: raw.operator.facebook
        }
      : null,
    scheduledDeparturesAvailable: Boolean(raw.scheduled_departures_available)
  };
}

async function fetchServices(): Promise<Service[]> {
  const response = await fetch(`${API_BASE}/services/`);
  if (!response.ok) {
    throw new Error(`Failed services request: ${response.status}`);
  }

  const data = (await response.json()) as ApiService[];
  return data.map(toService);
}

async function fetchService(id: number, dateIso: string): Promise<Service> {
  const url = new URL(`${API_BASE}/services/${id}`, window.location.origin);
  url.searchParams.set("departuresDate", dateIso);

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`Failed service request: ${response.status}`);
  }

  const data = (await response.json()) as ApiService;
  return toService(data);
}

function toApiDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function toDateInput(date: Date): string {
  return toApiDate(date);
}

function formatDateTime(value: string | null): string {
  if (!value) return "Unknown";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown";
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Europe/London"
  }).format(date);
}

function formatTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("en-GB", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "Europe/London"
  }).format(date);
}

type GoogleMapPoint = {
  latitude: number;
  longitude: number;
  label: string;
  type: "location" | "vessel";
  speed?: number | null;
  lastReceived?: string | null;
};

function getGoogleMapPoints(service: Service): GoogleMapPoint[] {
  const locationPoints = service.locations
    .filter((location) => Number.isFinite(location.latitude) && Number.isFinite(location.longitude))
    .map((location) => ({
      latitude: location.latitude,
      longitude: location.longitude,
      label: location.name,
      type: "location" as const
    }));

  const vesselPoints = service.vessels
    .filter((vessel) => Number.isFinite(vessel.latitude) && Number.isFinite(vessel.longitude))
    .map((vessel) => ({
      latitude: vessel.latitude,
      longitude: vessel.longitude,
      label: vessel.name || "Vessel",
      type: "vessel" as const,
      speed: vessel.speed,
      lastReceived: vessel.lastReceived
    }));

  return [...locationPoints, ...vesselPoints];
}

function formatRelativeTime(value: string | null): string {
  if (!value) return "unknown";

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "unknown";

  const deltaSeconds = Math.round((parsed.getTime() - Date.now()) / 1000);
  const absSeconds = Math.abs(deltaSeconds);
  const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  if (absSeconds < 60) return formatter.format(deltaSeconds, "second");
  if (absSeconds < 3600) return formatter.format(Math.round(deltaSeconds / 60), "minute");
  if (absSeconds < 86400) return formatter.format(Math.round(deltaSeconds / 3600), "hour");
  return formatter.format(Math.round(deltaSeconds / 86400), "day");
}

let googleMapsApiLoadPromise: Promise<void> | null = null;

function loadGoogleMapsApi(apiKey: string): Promise<void> {
  if ((window as { google?: unknown }).google) {
    return Promise.resolve();
  }

  if (googleMapsApiLoadPromise) {
    return googleMapsApiLoadPromise;
  }

  googleMapsApiLoadPromise = new Promise((resolve, reject) => {
    const callbackName = "__initFerryGoogleMaps";

    (window as Record<string, unknown>)[callbackName] = () => {
      resolve();
      delete (window as Record<string, unknown>)[callbackName];
    };

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&callback=${callbackName}`;
    script.async = true;
    script.defer = true;
    script.onerror = () => reject(new Error("Failed to load Google Maps script."));
    document.head.appendChild(script);
  });

  return googleMapsApiLoadPromise;
}

function GoogleServiceMap({
  serviceArea,
  points
}: {
  serviceArea: string;
  points: GoogleMapPoint[];
}): React.JSX.Element {
  const mapMountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!GOOGLE_MAPS_API_KEY || !mapMountRef.current) {
      return;
    }

    let cancelled = false;

    void loadGoogleMapsApi(GOOGLE_MAPS_API_KEY).then(() => {
      if (cancelled || !mapMountRef.current) return;

      const googleMaps = (window as { google: any }).google.maps;
      const center = points[0]
        ? { lat: points[0].latitude, lng: points[0].longitude }
        : { lat: 57, lng: -5 };

      const map = new googleMaps.Map(mapMountRef.current, {
        center,
        zoom: 8,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false
      });

      const bounds = new googleMaps.LatLngBounds();
      const infoWindow = new googleMaps.InfoWindow();

      points.forEach((point) => {
        const marker = new googleMaps.Marker({
          position: { lat: point.latitude, lng: point.longitude },
          map,
          title: point.label,
          icon:
            point.type === "vessel"
              ? {
                  path: "M12 2C9 2 5.5 4.5 5.5 8.5v2.3L3 13.2V16h2v2h2v2h10v-2h2v-2h2v-2.8l-2.5-2.4V8.5C18.5 4.5 15 2 12 2z",
                  fillColor: "#0b72e7",
                  fillOpacity: 0.95,
                  strokeColor: "#ffffff",
                  strokeWeight: 1.2,
                  scale: 1.6,
                  anchor: new googleMaps.Point(12, 12)
                }
              : {
                  path: googleMaps.SymbolPath.CIRCLE,
                  fillColor: "#21bfaa",
                  fillOpacity: 0.95,
                  strokeColor: "#ffffff",
                  strokeWeight: 1.4,
                  scale: 7
                }
        });

        bounds.extend(marker.getPosition());

        const details =
          point.type === "vessel"
            ? `Vessel: ${point.label}<br/>Speed: ${point.speed == null ? "unknown" : `${point.speed.toFixed(1)} kn`}<br/>Last received: ${formatRelativeTime(point.lastReceived ?? null)}`
            : `Location: ${point.label}`;

        marker.addListener("click", () => {
          infoWindow.setContent(
            `${details}<br/>${point.latitude.toFixed(5)}, ${point.longitude.toFixed(5)}`
          );
          infoWindow.open({ anchor: marker, map });
        });
      });

      if (points.length === 1) {
        map.setCenter(bounds.getCenter());
        map.setZoom(10);
      } else if (points.length > 1) {
        map.fitBounds(bounds, 24);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [points]);

  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <div className="map-shell">
        <div className="map-missing-key">
          Google Maps requires an API key. Set <code>VITE_GOOGLE_MAPS_API_KEY</code> and reload to render
          location and vessel markers for {serviceArea}.
        </div>
      </div>
    );
  }

  return (
    <div className="map-shell">
      <div className="map-mount" ref={mapMountRef} aria-label={`${serviceArea} map`} />
    </div>
  );
}

function statusLabel(status: ServiceStatus): string {
  switch (status) {
    case "normal":
      return "Normal operations";
    case "disrupted":
      return "Sailings disrupted";
    case "cancelled":
      return "Sailings cancelled";
    default:
      return "Unknown status";
  }
}

function disruptionText(status: ServiceStatus): string {
  switch (status) {
    case "normal":
      return "There are currently no disruptions with this service.";
    case "disrupted":
      return "There are disruptions with this service.";
    case "cancelled":
      return "Sailings have been cancelled for this service.";
    default:
      return "There was a problem fetching the service status.";
  }
}

function SiteHeading({ children }: { children?: React.ReactNode }): React.JSX.Element {
  return (
    <section className="page-intro">
      <h1 className="title">
        <Link className="title-link" to="/">
          Scottish Ferries
        </Link>
      </h1>
      <p className="page-subtitle">The latest disruption information</p>
      {children}
    </section>
  );
}

function SiteFooter(): React.JSX.Element {
  return (
    <footer className="site-footer">
      <h2>Support</h2>
      <p>
        Please contact me at{" "}
        <a href="mailto:stefan.church@gmail.com">stefan.church@gmail.com</a> if you have any issues or questions.
      </p>
    </footer>
  );
}

function AppPromo(): React.JSX.Element {
  return (
    <section className="app-promo">
      <img
        className="app-promo-shot"
        src="https://scottishferryapp.com/images/screenshot.png"
        alt="Scottish Ferries app screenshot"
        loading="lazy"
      />
      <div className="app-promo-content">
        <h2>Get the App</h2>
        <p>Get notified about the latest disruptions with the app.</p>
        <div className="store-links">
          <a
            href="https://apps.apple.com/nz/app/scottish-ferries/id861271891"
            target="_blank"
            rel="noreferrer"
            aria-label="Download on the App Store"
          >
            <img src="https://scottishferryapp.com/images/app-store.png" alt="Download on the App Store" />
          </a>
          <a
            href="https://play.google.com/store/apps/details?id=com.stefanchurch.ferryservices"
            target="_blank"
            rel="noreferrer"
            aria-label="Get it on Google Play"
          >
            <img src="https://scottishferryapp.com/images/play-store.png" alt="Get it on Google Play" />
          </a>
        </div>
      </div>
    </section>
  );
}

function ServicesPage(): React.JSX.Element {
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

function ServiceDetailsPage(): React.JSX.Element {
  const params = useParams();
  const location = useLocation();
  const serviceId = Number(params.id);
  const initialService = (location.state as { service?: Service } | null)?.service;

  const [service, setService] = useState<Service | null>(initialService ?? null);
  const [dateValue, setDateValue] = useState(() => toDateInput(new Date()));
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
  const mapPoints = service ? getGoogleMapPoints(service) : [];

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
          <section className="panel service-summary">
            <h1 className="title" style={{ marginBottom: 0, fontSize: "1.1rem" }}>{service.area}</h1>
            <div className="muted" style={{ marginBottom: 12 }}>{service.route}</div>
            <div className={`status-inline status-text status-${service.status}`}>
              <span className={`status-dot status-${service.status}`} aria-hidden="true" />
              <span>{statusLabel(service.status)}</span>
            </div>
            <p style={{ marginTop: 12, marginBottom: 0 }}>{disruptionText(service.status)}</p>
                {service.disruptionReason && <p className="small" style={{ marginBottom: 0 }}>{service.disruptionReason}</p>}
                <p className="small muted" style={{ marginBottom: 0 }}>
                  Last updated: {formatDateTime(service.lastUpdatedDate ?? service.updated)}
                </p>
                {hasAdditionalInfo && (
                  <p style={{ marginBottom: 0 }}>
                    <button
                      className="link-button"
                      type="button"
                      onClick={() => setShowDisruptionModal(true)}
                    >
                      View disruption details
                    </button>
                  </p>
                )}
            <div className="panel-map-bleed">
              <GoogleServiceMap serviceArea={service.area} points={mapPoints} />
            </div>
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
                            Next ferry: {formatTime(serviceLocation.nextDeparture.departure)} to {serviceLocation.nextDeparture.destination.name}
                          </p>
                        )}
                        {serviceLocation.nextRailDeparture && (
                          <p className="small" style={{ margin: "6px 0" }}>
                            Next rail: {formatTime(serviceLocation.nextRailDeparture.departure)} to {serviceLocation.nextRailDeparture.to}
                            {serviceLocation.nextRailDeparture.platform ? ` • Platform ${serviceLocation.nextRailDeparture.platform}` : ""}
                            {serviceLocation.nextRailDeparture.departureInfo ? ` • ${serviceLocation.nextRailDeparture.departureInfo}` : ""}
                          </p>
                        )}
                        {serviceLocation.weather && (
                          <p className="small muted" style={{ margin: "6px 0" }}>
                            Weather: {serviceLocation.weather.temperatureCelsius}C, {serviceLocation.weather.description}, wind {serviceLocation.weather.windSpeedMph} mph {serviceLocation.weather.windDirectionCardinal}
                          </p>
                        )}
                      </article>
                    ))}
                </div>
                {service.operator && (
                  <>
                    <div className="panel-divider" />
                    <h2 className="title card-subtitle">{service.operator.name}</h2>
                    <div className="inline-buttons">
                      {service.operator.localNumber && <a className="button" href={`tel:${service.operator.localNumber.split(" ").join("-")}`}>Phone</a>}
                      {service.operator.website && <a className="button" href={service.operator.website} target="_blank" rel="noreferrer">Website</a>}
                      {service.operator.email && <a className="button" href={`mailto:${service.operator.email}`}>Email</a>}
                      {service.operator.x && <a className="button" href={service.operator.x} target="_blank" rel="noreferrer">X</a>}
                      {service.operator.facebook && (
                        <a className="button" href={service.operator.facebook} target="_blank" rel="noreferrer">Facebook</a>
                      )}
                    </div>
                  </>
                )}
          </section>

              {service.scheduledDeparturesAvailable && (
                <section className="panel">
                  <h2 className="title card-subtitle">Scheduled Departures</h2>
                  {service.locations
                    .filter((currentLocation) => currentLocation.scheduledDepartures.length > 0)
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
                          <article className="location" key={`${currentLocation.id}-${destinationId}`}>
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
                                    <span>Depart {formatTime(departure.departure)}</span>
                                    <span>Arrive {formatTime(departure.arrival)}</span>
                                  </div>
                                );
                              })}
                          </article>
                        );
                      });
                    })}
                </section>
              )}

            </>
          )}
        </div>
        <aside className="promo-column">
          <AppPromo />
        </aside>
      </div>
      {service && hasAdditionalInfo && showDisruptionModal && (
        <div className="modal-backdrop" onClick={() => setShowDisruptionModal(false)}>
          <div className="modal-panel" onClick={(event) => event.stopPropagation()}>
            <div className="modal-head">
              <h2>{service.area} disruption details</h2>
              <button
                className="modal-close"
                type="button"
                onClick={() => setShowDisruptionModal(false)}
                aria-label="Close disruption details"
              >
                x
              </button>
            </div>
            <div className="modal-content" dangerouslySetInnerHTML={{ __html: service.additionalInfo ?? "" }} />
          </div>
        </div>
      )}
      <SiteFooter />
    </main>
  );
}

function AdditionalInfoPage(): React.JSX.Element {
  const location = useLocation();
  const state = location.state as { html?: string; area?: string } | null;

  if (!state?.html) {
    return <Navigate to="/" replace />;
  }

  return (
    <main>
      <SiteHeading />
      <div className="content-with-promo">
        <div className="primary-content">
          <div className="header">
            <h1 className="title">{state.area ? `${state.area} Info` : "Service Info"}</h1>
          </div>
          <section className="panel">
            <div dangerouslySetInnerHTML={{ __html: state.html }} />
          </section>
        </div>
        <aside className="promo-column">
          <AppPromo />
        </aside>
      </div>
      <SiteFooter />
    </main>
  );
}

function App(): React.JSX.Element {
  const [systemPrefersDark, setSystemPrefersDark] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (event: MediaQueryListEvent) => setSystemPrefersDark(event.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const resolvedTheme = systemPrefersDark ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", resolvedTheme);
  }, [systemPrefersDark]);

  return (
    <HashRouter>
      <style>{styles}</style>
      <Routes>
        <Route path="/" element={<ServicesPage />} />
        <Route path="/service/:id" element={<ServiceDetailsPage />} />
        <Route path="/service/:id/info" element={<AdditionalInfoPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
