import React, { useEffect, useState } from 'react';
import './Styles.css'
import { Link } from "react-router-dom";
import { defaultServices } from "./DefaultServices"

interface ServiceResponse {
  service_id: number
  area: string
  route: string
  additional_info?: string | null
  last_updated_date?: string | null
  disruption_reason?: string | null
  updated: string | null
  status: number
  locations: Location[]
}

interface Location {
  id: number
  name: string
  latitude: number
  longitude: number
}

enum Status {
  Normal = 0,
  Disrupted = 1,
  Cancelled = 2,
  Unknown = -99
}

type Service = {
  serviceID: number,
  area: string
  route: string
  status: Status
}

export default function Services() {
  const [services, setServices] = useState<Service[]>(convertToServices(defaultServices));

  useEffect(() => {
    async function fetchServices() {
      try {
        const response = await fetch("http://localhost:3001/api/services");
        // const response = await fetch("https://scottishferryapp.com/api/services");
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
                key={service.serviceID}
              >
                <div>{service.area}</div>
                <div>{service.route}</div>
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
      status: serviceResponse.status
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
