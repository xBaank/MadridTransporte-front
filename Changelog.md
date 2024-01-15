# Changelog

## 1.6.8

- Improve searching.
- Improve stop clicking.


## 1.6.7

- Optimize.

## 1.6.6

- Improve shapes.

## 1.6.5

- Redeploy.

## 1.6.4

- Fix shapes routes by using OSRM `match` endpoint.

## 1.6.3

- Fix theme loading delay.

## 1.6.2

- Fix theme not being saved.

## 1.6.1

- Fix maps on native.

## 1.6.0

- Replace TTP card check by using NFC.

> [!NOTE]\
> This means it's not posible to check TTP card via web.

## 1.5.4

- Update types according to the api.

## 1.5.3

- Add emt locations.

## 1.5.2

- Remove PC version.


## 1.5.1

- Change map background to black on dark mode.
- Fix bug that caused the stops to not be rendered on the map until the user moved the camera.

## 1.5.0

- Add dark theme to map.

## 1.4.10

- Fix requests being sent twice.

## 1.4.9

- Use shapes for line routes instead of generating the stop route.

## 1.4.8

- Update stops data.

## 1.4.7

- Optimize locations fetch.

## 1.4.6

- Use default port for back.

## 1.4.5

- Fix favorite icon.

## 1.4.4

- Add stop code to map stop markers and stop times.

## 1.4.3

- Visual improvements.

## 1.4.2

- Added a different color for the selected stop when seeing line locations.

## 1.4.1

- Fix a bug that caused the map to not center the stop when looking for a line .

## 1.4.0

- Add a button to see the locations of a bus line in the map (Only available for urban and interurban buses).

## 1.3.11

- Fix bug that did't open the stop when clicking the notification.

## 1.3.10

- Remove usage of `v1/stops/all`.
- Improve performance when searching for stops.

## 1.3.9

- Load stop info before stop times.

## 1.3.8

- Add nearest stop button.
- Update location marker when user moves.

## 1.3.7

- Fix filter.

## 1.3.6

- Use autoUpdate always.

## 1.3.5

- Ask for app update when new version is available.
- Rename maps to .png.

## 1.3.4

- Use jpg format as public folder cant webp doesn't work.

## 1.3.3

- Move files to public folder (this will cache those file and make the app faster)

## 1.3.2

- Add service worker.
- Fix typo.

## 1.3.1

- Improve performance when searching for stops.

## 1.3.0

- Use colors depending on the time left.
- Fix problem that caused the mobile navigation bar to be displayed incorrectly.

## 1.2.2

- Fix bug that crashed the app when the browser didn't support Notification API.

## 1.2.1

- Fix text too large in settings page.

## 1.2.0

- Added settings page.
- Added option to show time in minutes.

## 1.1.2

- Remove webVitals.

## 1.1.1

- Fix an issue that caused the map location marker to be created every time the location was found.

## 1.1.0

- Add message to say if times are not available and cache is being used.

## 1.0.4

- Use status codes properly.

## 1.0.3

- Fix an issue that caused the app to be unusable if Firebase messaging was not supported.
- Use system theme by default.

## 1.0.2

- Ask to delete on train favorites

## 1.0.1

- Disable zoom on mobile

## 1.0.0

- Release version 1.0.0

## 1.0.0-RC14

- Center marker when clicked.

## 1.0.0-RC13

- Fix map problems.

## 1.0.0-RC12

- Show stop name and add possibility to add to favorites even if the times are not available.

## 1.0.0-RC11

- Fix an issue that caused times to not be loaded when alerts were not retreived.

## 1.0.0-RC10

- Fix abono save favorite button for mobile.

## 1.0.0-RC9

- Reworked Favorites buttons in abono.

## 1.0.0-RC8

- Fixed a bug that caused the app to delete more than one favorite at a time.

## 1.0.0-RC7

- Disable service worker

## 1.0.0-RC6

- Reworked Favorites buttons.
- Added an icon to know if the stop if affected by an incident.

## 1.0.0-RC5

- Improve UI

## 1.0.0-RC4

- Improve UI

## 1.0.0-RC3

- Improve UI

## 1.0.0-RC2

- Improve UI

## 1.0.0-RC1

- Improve UI

## 1.0.0-RC

- Added push notifications to know when the transport is arriving (only bus,emt and metro)

## 0.1.3

- Added service worker to cache app

## 0.1.2

- Added time to reach stop walking from location

## 0.1.1

- Added a spinner when fetching data
