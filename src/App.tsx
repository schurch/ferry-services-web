import React, { useEffect, useState } from 'react';
import './App.css'

interface ServiceResponse {
  service_id: number
  sort_order: number
  area: string
  route: string
  additional_info: string
  status: number
}

enum Status {
  Normal = 0,
  Disrupted = 1,
  Cancelled = 2,
  Unknown = -99
}

type Service = {
  serviceID: number,
  sortOrder: number,
  area: string
  route: string
  status: Status
}

function App() {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    async function fetchServices() {
      try {
        // const response = await fetch("http://localhost:3001/api/services");
        const response = await fetch("https://scottishferryapp.com/api/services");
        const json: ServiceResponse[] = await response.json();
        const services: Service[] = json.map(jsonService => (
          {
            serviceID: jsonService.service_id,
            sortOrder: jsonService.sort_order,
            area: jsonService.area,
            route: jsonService.route,
            status: jsonService.status
          }
        )).sort((a, b) => a.sortOrder - b.sortOrder);
        setServices(services);
      } catch (e) {
        console.log(e);
      }
    }
    fetchServices();
  }, []);

  return (
    <div>
      <div className="brandBackgroundContainer">
        <div className="headerContainer centerContainer">
          <div className="smallScreenPadding">
            <h1 className="headerText">Scottish Ferries</h1>
            <h2 className="subtitleText">The latest disruption information</h2>
          </div>
        </div>
      </div>
      <div className="centerContainer mainContent">
        <div>
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
                    <div>{service.area}</div>
                    <div>{service.route}</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="appLinksContainer">
          <img className="mainImage" alt="Screenshot of the iPhone app" src="images/screenshot.png" />
          <h3 className="appBlurbHeader">Get the App</h3>
          <p className="appBlurb">Get notified about the latest disruptions with the app.</p>
          <div>
            <a href="https://apps.apple.com/nz/app/scottish-ferries/id861271891">
              <img className="appLinkImage" alt="The Apple App Store logo" src="images/app-store.png" />
            </a>
          </div>
          <div>
            <a href="https://play.google.com/store/apps/details?id=com.stefanchurch.ferryservices">
              <img className="appLinkImage" alt="The Google Pay Store logo" src="images/play-store.png" />
            </a>
          </div>
        </div>
      </div>
      <div className="brandBackgroundContainer">
        <div className="supportContainer centerContainer">
          <div className="smallScreenPadding">
            <h2>Support</h2>
            <p>Please contact me at <a href="mailto:stefan.church@gmail.com">stefan.church@gmail.com</a> if you have any issues or questions.</p>
          </div>
        </div>
      </div>
    </div >
  );
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

export default App;
