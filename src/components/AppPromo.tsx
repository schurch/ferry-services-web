import type React from "react";

export function AppPromo(): React.JSX.Element {
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
