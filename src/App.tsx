import React from 'react';
import './Styles.css'
import { Outlet } from "react-router-dom";

function App() {
  return (
    <div>
      <div className="brandBackgroundContainer">
        <div className="headerContainer centerContainer">
          <h1 className="headerText">Scottish Ferries</h1>
          <h2 className="subtitleText">The latest disruption information</h2>
        </div>
      </div>
      <div className="centerContainer mainContent">
        <div>
          <Outlet />
        </div>
        <div className="appLinksContainer">
          <img className="mainImage" alt="Screenshot of the iPhone app" src="/images/screenshot.png" />
          <h3 className="appBlurbHeader">Get the App</h3>
          <p className="appBlurb">Get notified about the latest disruptions with the app.</p>
          <div>
            <a href="https://apps.apple.com/nz/app/scottish-ferries/id861271891">
              <img className="appLinkImage" alt="The Apple App Store logo" src="/images/app-store.png" />
            </a>
          </div>
          <div>
            <a href="https://play.google.com/store/apps/details?id=com.stefanchurch.ferryservices">
              <img className="appLinkImage" alt="The Google Pay Store logo" src="/images/play-store.png" />
            </a>
          </div>
        </div>
      </div>
      <div className="brandBackgroundContainer">
        <div className="supportContainer centerContainer">
          <h2>Support</h2>
          <p>Please contact me at <a href="mailto:stefan.church@gmail.com">stefan.church@gmail.com</a> if you have any issues or questions.</p>
        </div>
      </div>
    </div >
  );
}

export default App;
