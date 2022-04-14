import React, { useEffect, useState } from 'react';
import './Styles.css'
import { Link } from "react-router-dom";
import { defaultServices } from "./DefaultServices";
import { Service, ServiceResponse, Status } from "./Types";

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
          <th className="spacerColumn"></th>
          <th >Service</th>
        </tr>
      </thead>
      <tbody>
        {services.map(service =>
          <tr key={service.serviceID}>
            <td className="statusCell">{CreateStatusCircle(service.status)}</td>
            <td></td>
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
            <td className="chevronContainer">
              <Link
                to={`/services/${service.serviceID}`}
                state={service}
                key={service.serviceID}
              >
                <picture>
                  <source srcSet="/images/chevron-dark-mode.png" media="(prefers-color-scheme: dark)" />
                  <img src="/images/chevron.png" width="7px" />
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

function CreateStatusCircle(status: Status) {
  const width = 20;
  switch (status) {
    case Status.Normal:
      return <CircleWithFill fill="#6AB557" width={width} />
    case Status.Disrupted:
      return <CircleWithFill fill="#FD940A" width={width} />
    case Status.Cancelled:
      return <CircleWithFill fill="#D62A0B" width={width} />
    case Status.Unknown:
      return <CircleWithFill fill="#D7D7D7" width={width} />
  }
}

function CircleWithFill(props: { fill: string, width: number }) {
  return (<svg width={props.width} height={props.width}> <circle cx={props.width / 2} cy={props.width / 2} r={props.width / 2} fill={props.fill} /></svg>)
}
