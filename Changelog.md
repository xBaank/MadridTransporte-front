# Changelog

## 1.12.6

- Improve stops search.

## 1.12.5

- Fixed issue that caused favorite modal to close when data was loaded.

## 1.12.4

- Added option to update stops.
- Improved performance by using IndexedDB async api.

## 1.12.3
- Remove theme meta tag.

## 1.12.2
- Updated dependencies.
- Added `leaflet` as a npm dependency (This will improve loading time and caching).
- Improved map performance.

## 1.12.1
- Removed not working abono menu. Now only available on apk version.

## 1.12.0
- Added button to see stop in map.

## 1.11.0
- Added accessibility data to stops.

## 1.10.2
- Persist map zoom between pages.

## 1.10.1
- Persist map position between pages.

## 1.10.0
- Updated dependencies.
- Added planned times for bus stops.

## 1.9.7
- Updated dependencies.
- Fixed infinite loading on abono error.

## 1.9.6

- Updated dependencies.
- Removed status bar color.

## 1.9.5

- Make stop times errors less intrusive.

## 1.9.4

- Fixed icons positions.

## 1.9.3

- UI improvements.

## 1.9.2

- Added Roboto as default font for MUI.

## 1.9.1

- Removed theme color in manifest.

## 1.9.0

- Theme rework.

## 1.8.4

- Bugfix.

## 1.8.3

- Fixed manifest.json

## 1.8.2

- Use Google Maps instead of OpenStreetMap.
- Fixed icons size.

## 1.8.1

- Fixed locations render error.

## 1.8.0

- Added abono notifications.

## 1.7.17

- Reverted kml as it does not represent all the route.

## 1.7.16

- Use Kml instead of shapes.

## 1.7.15

- Updated dependencies.

## 1.7.14

- Fixed locations map lag.

## 1.7.13

- Adapted to new endpoints.

## 1.7.12

- Visual improvements.
- Request permission when to update to a new version.

## 1.7.11

- Updated dependencies.
- Changed the way bus locations are shown. 


## 1.7.10

- Fixed problem where subscriptions were not refrehed along with times.

## 1.7.9

- Added pull to refresh.
- Removed time to reach stop.
- UI improvements.


## 1.7.8

- Added more information for abono.
- UI improvements.

## 1.7.7

- Fixed notification bug that caused subscriptions to not load.

## 1.7.6

- Added notifications on android.

## 1.7.5

- Fixed abono favorite name.

## 1.7.4

- Updated stops.

## 1.7.3

- Reimplemented abono NFC.

## 1.7.2

- Improved UI.

## 1.7.1

- Fixed notification bug.

## 1.7.0

- Added train times.

## 1.6.9

- Removed scrolls on edge.

## 1.6.8

- Improved searching.
- Improved stop clicking.


## 1.6.7

- Optimize.

## 1.6.6

- Improved shapes.

## 1.6.5

- Redeploy.

## 1.6.4

- Fixed shapes routes by using OSRM `match` endpoint.

## 1.6.3

- Fixed theme loading delay.

## 1.6.2

- Fixed theme not being saved.

## 1.6.1

- Fixed maps on native.

## 1.6.0

- Replaced TTP card check by using NFC.

> [!NOTE]\
> This means it's not posible to check TTP card via web.

## 1.5.4

- Updated types according to the api.

## 1.5.3

- Added emt locations.

## 1.5.2

- Removed PC version.


## 1.5.1

- Changed map background to black on dark mode.
- Fixed bug that caused the stops to not be rendered on the map until the user moved the camera.

## 1.5.0

- Added dark theme to map.

## 1.4.10

- Fixed requests being sent twice.

## 1.4.9

- Use shapes for line routes instead of generating the stop route.

## 1.4.8

- Updated stops data.

## 1.4.7

- Optimized locations fetch.

## 1.4.6

- Use default port for back.

## 1.4.5

- Fixed favorite icon.

## 1.4.4

- Added stop code to map stop markers and stop times.

## 1.4.3

- Visual improvements.

## 1.4.2

- Added a different color for the selected stop when seeing line locations.

## 1.4.1

- Fixed a bug that caused the map to not center the stop when looking for a line .

## 1.4.0

- Added a button to see the locations of a bus line in the map (Only available for urban and interurban buses).

## 1.3.11

- Fixed bug that did't open the stop when clicking the notification.

## 1.3.10

- Removed usage of `v1/stops/all`.
- Improved performance when searching for stops.

## 1.3.9

- Load stop info before stop times.

## 1.3.8

- Added nearest stop button.
- Updated location marker when user moves.

## 1.3.7

- Fixed filter.

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

- Added service worker.
- Fixed typo.

## 1.3.1

- Improved performance when searching for stops.

## 1.3.0

- Use colors depending on the time left.
- Fixed problem that caused the mobile navigation bar to be displayed incorrectly.

## 1.2.2

- Fixed bug that crashed the app when the browser didn't support Notification API.

## 1.2.1

- Fixed text too large in settings page.

## 1.2.0

- Added settings page.
- Added option to show time in minutes.

## 1.1.2

- Remove webVitals.

## 1.1.1

- Fixed an issue that caused the map location marker to be created every time the location was found.

## 1.1.0

- Added message to say if times are not available and cache is being used.

## 1.0.4

- Use status codes properly.

## 1.0.3

- Fixed an issue that caused the app to be unusable if Firebase messaging was not supported.
- Use system theme by default.

## 1.0.2

- Ask to delete on train favorites

## 1.0.1

- Disabled zoom on mobile

## 1.0.0

- Release version 1.0.0

## 1.0.0-RC14

- Center marker when clicked.

## 1.0.0-RC13

- Fixed map problems.

## 1.0.0-RC12

- Show stop name and add possibility to add to favorites even if the times are not available.

## 1.0.0-RC11

- Fixed an issue that caused times to not be loaded when alerts were not retreived.

## 1.0.0-RC10

- Fixed abono save favorite button for mobile.

## 1.0.0-RC9

- Reworked Favorites buttons in abono.

## 1.0.0-RC8

- Fixed a bug that caused the app to delete more than one favorite at a time.

## 1.0.0-RC7

- Disabled service worker

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
