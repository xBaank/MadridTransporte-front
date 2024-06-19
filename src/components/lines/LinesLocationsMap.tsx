import {type Map} from "leaflet";
import {useMemo, useState} from "react";
import ErrorMessage from "../Error";
import LoadingSpinner from "../LoadingSpinner";
import {StopsMarkers} from "../stops/StopsMarkers";
import {LineLocationsMarkers} from "./LineLocationsMarkers";
import ThemedMap from "../stops/ThemedMap";
import {Polyline} from "react-leaflet";
import Line from "../Line";
import {getColor} from "../stops/api/Utils";
import {defaultPosition} from "../../hooks/hooks";
import {
  useFixedShapes,
  useItineraryByDirection,
  useLineLocations,
} from "./hooks/Lines";
import {useParams, useSearchParams} from "react-router-dom";
import {TransportType} from "../stops/api/Types";

export default function LinesLocationsMap() {
  const interval = 1000 * 15;
  const {type, fullLineCode, direction} = useParams<{
    type: TransportType;
    fullLineCode: string;
    direction: string;
  }>();
  const [searchParam] = useSearchParams();
  const [map, setMap] = useState<Map | null>(null);
  const [itinerary, currentStop, itineraryError] = useItineraryByDirection(
    type,
    fullLineCode,
    direction,
    searchParam.get("stopCode") ?? undefined,
  );
  const [lineLocations, locationsError] = useLineLocations(
    interval,
    type,
    fullLineCode,
    direction,
    searchParam.get("stopCode") ?? undefined,
  );
  const [allRoute, routeError] = useFixedShapes(itinerary, type);

  function StopsMarkersMemo() {
    return useMemo(() => {
      if (map == null) return <></>;
      return (
        <StopsMarkers
          current={currentStop}
          stops={itinerary?.stops ?? []}
          map={map}
        />
      );
    }, [map, currentStop, itinerary]);
  }

  if (
    routeError !== undefined ||
    locationsError !== undefined ||
    itineraryError !== undefined
  )
    return (
      <ErrorMessage
        message={
          routeError ?? locationsError ?? itineraryError!
        }></ErrorMessage>
    );

  if (allRoute === undefined || lineLocations === undefined)
    return <LoadingSpinner></LoadingSpinner>;

  return (
    <ThemedMap
      setMap={setMap}
      center={{
        lat: currentStop?.stopLat ?? defaultPosition.lat,
        lng: currentStop?.stopLon ?? defaultPosition.lng,
      }}
      zoom={16}
      onLocateClick={() => {
        map?.locate({enableHighAccuracy: false, maximumAge: 5000});
      }}>
      <Polyline
        color={getColor(lineLocations.codMode)}
        weight={6}
        positions={allRoute}
      />
      <LineLocationsMarkers lineLocations={lineLocations.locations} />
      <StopsMarkersMemo />
      <div
        style={{zIndex: 500}}
        className={`absolute top-4 w-20 h-5 right-0 left-0 mx-auto rounded-sm`}>
        <Line
          info={{
            line: lineLocations.lineCode,
            codMode: lineLocations.codMode,
          }}
        />
      </div>
    </ThemedMap>
  );
}
