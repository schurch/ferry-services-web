import React, { useEffect, useState } from 'react';
import { useLocation } from "react-router-dom";
import { Service, ServiceResponse, Status, serviceResponseToService } from "./Types"
import ScrollToTopOnMount from "./ScrollToTopOnMount"
import StatusCircle from './StatusCircle';
import { BASE_URL } from './Constants';

export default function ServiceDetails() {
  const location = useLocation();
  const [service, setService] = useState<Service>(location.state as Service);

  useEffect(() => {
    async function fetchService() {
      try {
        const response = await fetch(BASE_URL + "/services/" + service.serviceID);
        const json: ServiceResponse = await response.json();
        setService(serviceResponseToService(json));
      } catch (e) {
        console.log(e);
      }
    }

    fetchService();
  }, []);

  return (
    <>
      <ScrollToTopOnMount />
      <h1>{service.area}</h1>
      <h2>{service.route}</h2>
      <div className="statusDetails">
        <StatusCircle status={service.status} />
        <span>{statusText(service.status)}</span>
      </div>
      <div dangerouslySetInnerHTML={{ __html: service.additional_info ?? "" }}></div>
    </>
  );
}

function statusText(status: Status): string {
  switch (status) {
    case Status.Normal:
      return "There are currently no disruptions with this service"
    case Status.Disrupted:
      return "There are disruptions with this service"
    case Status.Cancelled:
      return "Sailings have been cancelled for this service"
    case Status.Unknown:
      return "There was a problem fetching the status of this service"
  }
}