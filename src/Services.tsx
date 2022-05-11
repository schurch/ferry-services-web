import React, { useEffect, useState } from 'react';
import './Styles.css'
import { Link } from "react-router-dom";
import { defaultServices } from "./DefaultServices";
import { Service, ServiceResponse, serviceResponseToService } from "./Types";
import StatusCircle from './StatusCircle';
import { BASE_URL } from './Constants';

export default function Services() {
  const [services, setServices] = useState<Service[]>(defaultServices.map(serviceResponseToService));

  useEffect(() => {
    async function fetchServices() {
      try {
        const response = await fetch(BASE_URL + "/services");
        const json: ServiceResponse[] = await response.json();
        setServices(json.map(serviceResponseToService));
      } catch (e) {
        console.log(e);
      }
    }

    fetchServices();
  }, []);

  return (
    <table className="smallScreenPadding servicesTable">
      <thead>
        <tr>
          <th >Status</th>
          <td className="spacerColumn" aria-hidden="true"></td>
          <th >Service</th>
        </tr>
      </thead>
      <tbody>
        {services.map(service =>
          <tr key={service.serviceID}>
            <td className="statusCell">
              <StatusCircle status={service.status} />
            </td>
            <td aria-hidden="true"></td>
            <td>
              <Link
                to={`/services/${service.serviceID}`}
                state={service}
                key={service.serviceID}
              >
                <div>{service.area}</div>
                <div>{service.route}</div>
              </Link>
            </td>
            <td className="chevronContainer" aria-hidden="true">
              <Link
                to={`/services/${service.serviceID}`}
                state={service}
                key={service.serviceID}
                tabIndex={-1}
              >
                <picture>
                  <source srcSet="/images/chevron-dark-mode.png" media="(prefers-color-scheme: dark)" />
                  <img src="/images/chevron.png" width="7px" height="13px" alt="" />
                </picture>
              </Link>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
