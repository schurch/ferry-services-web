import React, { useEffect, useState } from 'react';
import './App.css'

interface ServiceResponse {
  service_id: number
  area: string
  route: string
  additional_info: string | null
  last_updated_date: string | null
  disruption_reason: string | null
  updated: string
  status: number
  locations: Location[]
}

interface Location {
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

function App() {
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

const defaultServices: ServiceResponse[] = [
  {
    "status": -99,
    "area": "ARDNAMURCHAN",
    "additional_info": null,
    "last_updated_date": null,
    "disruption_reason": null,
    "route": "Tobermory (TOB) - Kilchoan (KIC)",
    "service_id": 14,
    "updated": "2020-08-28T02:11:48.341768Z",
    "locations": [
      {
        "latitude": 56.68855,
        "name": "Kilchoan",
        "longitude": -6.09396
      },
      {
        "latitude": 56.6233,
        "name": "Tobermory",
        "longitude": -6.06334
      }
    ]
  },
  {
    "status": -99,
    "area": "ARRAN",
    "additional_info": null,
    "last_updated_date": null,
    "disruption_reason": null,
    "route": "Ardrossan (ARD) - Brodick (BRO)",
    "service_id": 5,
    "updated": "2020-08-28T02:11:48.341768Z",
    "locations": [
      {
        "latitude": 55.576606,
        "name": "Brodick",
        "longitude": -5.139172
      },
      {
        "latitude": 55.640516,
        "name": "Ardrossan",
        "longitude": -4.823062
      }
    ]
  },
  {
    "status": -99,
    "area": "ARRAN",
    "additional_info": null,
    "last_updated_date": null,
    "disruption_reason": null,
    "route": "Claonaig (CLA)/Tarbert (TLF) - Lochranza (LRA)",
    "service_id": 6,
    "updated": "2020-08-28T02:11:48.341768Z",
    "locations": [
      {
        "latitude": 55.75106,
        "name": "Claonaig",
        "longitude": -5.38787
      },
      {
        "latitude": 55.707714,
        "name": "Lochranza",
        "longitude": -5.301985
      },
      {
        "latitude": 55.86615,
        "name": "Tarbert (Loch Fyne)",
        "longitude": -5.40376
      }
    ]
  },
  {
    "status": -99,
    "area": "BARRA and ERISKAY",
    "additional_info": null,
    "last_updated_date": null,
    "disruption_reason": null,
    "route": "Ardmhor, Barra (AMH) - Eriskay (ERI)",
    "service_id": 21,
    "updated": "2020-08-28T02:11:48.341768Z",
    "locations": [
      {
        "latitude": 57.07091,
        "name": "Eriskay",
        "longitude": -7.30825
      },
      {
        "latitude": 57.0084,
        "name": "Barra",
        "longitude": -7.40475
      }
    ]
  },
  {
    "status": -99,
    "area": "CUMBRAE",
    "additional_info": null,
    "last_updated_date": null,
    "disruption_reason": null,
    "route": "Largs (LAR) - Millport, Cumbrae Slip (CUM)",
    "service_id": 7,
    "updated": "2020-08-28T02:11:48.341768Z",
    "locations": [
      {
        "latitude": 55.78671,
        "name": "Cumbrae Slip",
        "longitude": -4.898246
      },
      {
        "latitude": 55.794945,
        "name": "Largs",
        "longitude": -4.871013
      }
    ]
  },
  {
    "status": -99,
    "area": "BARRA ",
    "additional_info": null,
    "last_updated_date": null,
    "disruption_reason": null,
    "route": "Oban (OBA) - Castlebay (CAS)",
    "service_id": 20,
    "updated": "2020-08-28T02:11:48.341768Z",
    "locations": [
      {
        "latitude": 57.152201,
        "name": "Lochboisdale",
        "longitude": -7.303969
      },
      {
        "latitude": 56.953846,
        "name": "Castlebay",
        "longitude": -7.488251
      },
      {
        "latitude": 56.41158,
        "name": "Oban",
        "longitude": -5.47725
      }
    ]
  },
  {
    "status": -99,
    "area": "BUTE",
    "additional_info": null,
    "last_updated_date": null,
    "disruption_reason": null,
    "route": "Colintraive (CTR) - Rhubodach (RHU)",
    "service_id": 4,
    "updated": "2020-08-28T02:11:48.341768Z",
    "locations": [
      {
        "latitude": 55.92067,
        "name": "Rhubodach",
        "longitude": -5.15888
      },
      {
        "latitude": 55.923353,
        "name": "Colintraive",
        "longitude": -5.152758
      }
    ]
  },
  {
    "status": -99,
    "area": "BUTE",
    "additional_info": null,
    "last_updated_date": null,
    "disruption_reason": null,
    "route": "Wemyss Bay (WEM) - Rothesay (ROT)",
    "service_id": 3,
    "updated": "2020-08-28T02:11:48.341768Z",
    "locations": [
      {
        "latitude": 55.83848,
        "name": "Rothesay",
        "longitude": -5.05421
      },
      {
        "latitude": 55.87573,
        "name": "Wemyss Bay",
        "longitude": -4.8908
      }
    ]
  },
  {
    "status": -99,
    "area": "COLL and TIREE",
    "additional_info": null,
    "last_updated_date": null,
    "disruption_reason": null,
    "route": "Oban (OBA) - Coll (CLL) - Tiree (TIR)",
    "service_id": 16,
    "updated": "2020-08-28T02:11:48.341768Z",
    "locations": [
      {
        "latitude": 56.508324,
        "name": "Tiree",
        "longitude": -6.798924
      },
      {
        "latitude": 56.615059,
        "name": "Coll",
        "longitude": -6.524241
      },
      {
        "latitude": 56.41158,
        "name": "Oban",
        "longitude": -5.47725
      }
    ]
  },
  {
    "status": -99,
    "area": "COLONSAY",
    "additional_info": null,
    "last_updated_date": null,
    "disruption_reason": null,
    "route": "Oban (OBA) - Colonsay (CSA) - Port Askaig (PAS) - Kennacraig (KEN)",
    "service_id": 10,
    "updated": "2020-08-28T02:11:48.341768Z",
    "locations": [
      {
        "latitude": 55.8067,
        "name": "Kennacraig",
        "longitude": -5.4834
      },
      {
        "latitude": 55.847707,
        "name": "Port Askaig",
        "longitude": -6.105102
      },
      {
        "latitude": 56.06858,
        "name": "Colonsay",
        "longitude": -6.18819
      },
      {
        "latitude": 56.41158,
        "name": "Oban",
        "longitude": -5.47725
      }
    ]
  },
  {
    "status": -99,
    "area": "COWAL & DUNOON",
    "additional_info": null,
    "last_updated_date": null,
    "disruption_reason": null,
    "route": "Gourock (GOU) - Dunoon (DUN)",
    "service_id": 1,
    "updated": "2020-08-28T02:11:48.341768Z",
    "locations": [
      {
        "latitude": 55.947006,
        "name": "Dunoon",
        "longitude": -4.921328
      },
      {
        "latitude": 55.959938,
        "name": "Gourock",
        "longitude": -4.814372
      }
    ]
  },
  {
    "status": -99,
    "area": "GIGHA",
    "additional_info": null,
    "last_updated_date": null,
    "disruption_reason": null,
    "route": "Tayinloan (TAY) - Gigha (GIG)",
    "service_id": 8,
    "updated": "2020-08-28T02:11:48.341768Z",
    "locations": [
      {
        "latitude": 55.678637,
        "name": "Gigha",
        "longitude": -5.733597
      },
      {
        "latitude": 55.65755,
        "name": "Tayinloan",
        "longitude": -5.6691
      }
    ]
  },
  {
    "status": -99,
    "area": "HARRIS",
    "additional_info": null,
    "last_updated_date": null,
    "disruption_reason": null,
    "route": "Uig (UIG) - Tarbert (TAR)",
    "service_id": 24,
    "updated": "2020-08-28T02:11:48.341768Z",
    "locations": [
      {
        "latitude": 57.896848,
        "name": "Tarbert",
        "longitude": -6.798668
      },
      {
        "latitude": 57.58634,
        "name": "Uig",
        "longitude": -6.376447
      }
    ]
  },
  {
    "status": -99,
    "area": "IONA",
    "additional_info": null,
    "last_updated_date": null,
    "disruption_reason": null,
    "route": "Fionnphort (FIO) - Iona (ION)",
    "service_id": 13,
    "updated": "2020-08-28T02:11:48.341768Z",
    "locations": [
      {
        "latitude": 56.330225,
        "name": "Iona",
        "longitude": -6.392257
      },
      {
        "latitude": 56.325611,
        "name": "Fionnphort",
        "longitude": -6.369403
      }
    ]
  },
  {
    "status": -99,
    "area": "ISLAY",
    "additional_info": null,
    "last_updated_date": null,
    "disruption_reason": null,
    "route": "Kennacraig (KEN) - Port Askaig (PAS), Kennacraig (KEN) - Port Ellen (PEL)",
    "service_id": 9,
    "updated": "2020-08-28T02:11:48.341768Z",
    "locations": [
      {
        "latitude": 55.62781,
        "name": "Port Ellen",
        "longitude": -6.18981
      },
      {
        "latitude": 55.8067,
        "name": "Kennacraig",
        "longitude": -5.4834
      },
      {
        "latitude": 55.847707,
        "name": "Port Askaig",
        "longitude": -6.105102
      }
    ]
  },
  {
    "status": -99,
    "area": "KERRERA",
    "additional_info": null,
    "last_updated_date": null,
    "disruption_reason": null,
    "route": "Gallanach (GAL) - Kerrera (KER)",
    "service_id": 38,
    "updated": "2020-08-28T02:11:48.341768Z",
    "locations": [
      {
        "latitude": 56.399859,
        "name": "Kerrera",
        "longitude": -5.517498
      },
      {
        "latitude": 56.396995,
        "name": "Gallanach",
        "longitude": -5.510373
      }
    ]
  },
  {
    "status": -99,
    "area": "COWAL and KINTYRE",
    "additional_info": null,
    "last_updated_date": null,
    "disruption_reason": null,
    "route": "Tarbert, Loch Fyne (TLF) - Portavadie (POR)",
    "service_id": 2,
    "updated": "2020-08-28T02:11:48.341768Z",
    "locations": [
      {
        "latitude": 55.87649,
        "name": "Portavadie",
        "longitude": -5.31654
      },
      {
        "latitude": 55.86615,
        "name": "Tarbert (Loch Fyne)",
        "longitude": -5.40376
      }
    ]
  },
  {
    "status": -99,
    "area": "LEWIS",
    "additional_info": null,
    "last_updated_date": null,
    "disruption_reason": null,
    "route": "Ullapool (ULL) - Stornoway (STO)",
    "service_id": 25,
    "updated": "2020-08-28T02:11:48.341768Z",
    "locations": [
      {
        "latitude": 57.894939,
        "name": "Ullapool Bay",
        "longitude": -5.160442
      },
      {
        "latitude": 58.206822,
        "name": "Stornoway",
        "longitude": -6.386586
      }
    ]
  },
  {
    "status": -99,
    "area": "LEWIS FREIGHT",
    "additional_info": null,
    "last_updated_date": null,
    "disruption_reason": null,
    "route": "Freight Ullapool -Stornoway ",
    "service_id": 35,
    "updated": "2020-08-28T02:11:48.341768Z",
    "locations": [
      {
        "latitude": 57.894939,
        "name": "Ullapool Bay",
        "longitude": -5.160442
      },
      {
        "latitude": 58.206822,
        "name": "Stornoway",
        "longitude": -6.386586
      }
    ]
  },
  {
    "status": -99,
    "area": "LISMORE",
    "additional_info": null,
    "last_updated_date": null,
    "disruption_reason": null,
    "route": "Oban (OBA) - Lismore (LIS)",
    "service_id": 15,
    "updated": "2020-08-28T02:11:48.341768Z",
    "locations": [
      {
        "latitude": 56.511159,
        "name": "Lismore",
        "longitude": -5.492068
      },
      {
        "latitude": 56.41158,
        "name": "Oban",
        "longitude": -5.47725
      }
    ]
  },
  {
    "status": -99,
    "area": "MULL",
    "additional_info": null,
    "last_updated_date": null,
    "disruption_reason": null,
    "route": "Oban (OBA) - Craignure (CRA)",
    "service_id": 11,
    "updated": "2020-08-28T02:11:48.341768Z",
    "locations": [
      {
        "latitude": 56.47074,
        "name": "Craignure",
        "longitude": -5.70629
      },
      {
        "latitude": 56.41158,
        "name": "Oban",
        "longitude": -5.47725
      }
    ]
  },
  {
    "status": -99,
    "area": "MULL",
    "additional_info": null,
    "last_updated_date": null,
    "disruption_reason": null,
    "route": "Lochaline (LAL) - Fishnish (FIS)",
    "service_id": 12,
    "updated": "2020-08-28T02:11:48.341768Z",
    "locations": [
      {
        "latitude": 56.51472,
        "name": "Fishnish",
        "longitude": -5.81032
      },
      {
        "latitude": 56.53666,
        "name": "Lochaline",
        "longitude": -5.77502
      }
    ]
  },
  {
    "status": -99,
    "area": "NORTH UIST",
    "additional_info": null,
    "last_updated_date": null,
    "disruption_reason": null,
    "route": "Uig, Skye (UIG) - Lochmaddy (LMA)",
    "service_id": 22,
    "updated": "2020-08-28T02:11:48.341768Z",
    "locations": [
      {
        "latitude": 57.596518,
        "name": "Lochmaddy",
        "longitude": -7.157672
      },
      {
        "latitude": 57.58634,
        "name": "Uig",
        "longitude": -6.376447
      }
    ]
  },
  {
    "status": -99,
    "area": "NORTH UIST and HARRIS",
    "additional_info": null,
    "last_updated_date": null,
    "disruption_reason": null,
    "route": "Berneray (BER) - Leverburgh (LEV)",
    "service_id": 23,
    "updated": "2020-08-28T02:11:48.341768Z",
    "locations": [
      {
        "latitude": 57.76654,
        "name": "Leverburgh",
        "longitude": -7.025258
      },
      {
        "latitude": 57.702302,
        "name": "Berneray",
        "longitude": -7.180422
      }
    ]
  },
  {
    "status": -99,
    "area": "RAASAY",
    "additional_info": null,
    "last_updated_date": null,
    "disruption_reason": null,
    "route": "Sconser (SCO) - Raasay (RAA)",
    "service_id": 17,
    "updated": "2020-08-28T02:11:48.341768Z",
    "locations": [
      {
        "latitude": 57.351034,
        "name": "Raasay",
        "longitude": -6.082454
      },
      {
        "latitude": 57.313967,
        "name": "Sconser",
        "longitude": -6.110329
      }
    ]
  },
  {
    "status": -99,
    "area": "SKYE",
    "additional_info": null,
    "last_updated_date": null,
    "disruption_reason": null,
    "route": "Mallaig (MAL) - Armadale (ARM)",
    "service_id": 18,
    "updated": "2020-08-28T02:11:48.341768Z",
    "locations": [
      {
        "latitude": 57.064596,
        "name": "Armadale",
        "longitude": -5.894743
      },
      {
        "latitude": 57.006834,
        "name": "Mallaig",
        "longitude": -5.828069
      }
    ]
  },
  {
    "status": -99,
    "area": "SMALL ISLES",
    "additional_info": null,
    "last_updated_date": null,
    "disruption_reason": null,
    "route": "Mallaig (MAL) - Small Isles (SIS)",
    "service_id": 19,
    "updated": "2020-08-28T02:11:48.341768Z",
    "locations": [
      {
        "latitude": 57.056171,
        "name": "Canna",
        "longitude": -6.490296
      },
      {
        "latitude": 57.010862,
        "name": "Rum",
        "longitude": -6.264991
      },
      {
        "latitude": 56.83364,
        "name": "Muck",
        "longitude": -6.226905
      },
      {
        "latitude": 56.8772,
        "name": "Eigg",
        "longitude": -6.12995
      },
      {
        "latitude": 57.006834,
        "name": "Mallaig",
        "longitude": -5.828069
      }
    ]
  },
  {
    "status": -99,
    "area": "SOUTH UIST",
    "additional_info": null,
    "last_updated_date": null,
    "disruption_reason": null,
    "route": "Mallaig (MAL) / Oban (OBA) - Lochboisdale (LBO)",
    "service_id": 37,
    "updated": "2020-08-28T02:11:48.341768Z",
    "locations": [
      {
        "latitude": 57.006834,
        "name": "Mallaig",
        "longitude": -5.828069
      },
      {
        "latitude": 57.152201,
        "name": "Lochboisdale",
        "longitude": -7.303969
      }
    ]
  },
  {
    "status": -99,
    "area": "KILCREGGAN & ROSNEATH",
    "additional_info": null,
    "last_updated_date": null,
    "disruption_reason": null,
    "route": "Gourock (GOU) - Kilcreggan (KIL)",
    "service_id": 39,
    "updated": "2020-08-28T02:11:48.341768Z",
    "locations": [
      {
        "latitude": 55.984704635223416,
        "name": "Kilcreggan",
        "longitude": -4.820426740646081
      },
      {
        "latitude": 55.959938,
        "name": "Gourock",
        "longitude": -4.814372
      }
    ]
  }
]


export default App;
