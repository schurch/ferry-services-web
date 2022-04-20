import React, { useEffect, useState } from 'react';
import './Styles.css'
import { Link } from "react-router-dom";
import { defaultServices } from "./DefaultServices";
import { Service, ServiceResponse } from "./Types";
import StatusCircle from './StatusCircle';

export default function Services() {
  const [services, setServices] = useState<Service[]>(convertToServices(defaultServices));

  useEffect(() => {
    async function fetchServices() {
      try {
        // const response = await fetch("http://localhost:3001/api/services");
        const response = await fetch("https://scottishferryapp.com/api/services");
        const json: ServiceResponse[] = await response.json();
        const services: Service[] = convertToServices(json);
        setServices(services);
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

function convertToServices(serviceResponses: ServiceResponse[]): Service[] {
  return serviceResponses.map(serviceResponse => (
    {
      serviceID: serviceResponse.service_id,
      area: serviceResponse.area,
      route: serviceResponse.route,
      status: serviceResponse.status,
      additional_info: serviceResponse.additional_info
    }
  ))
}
