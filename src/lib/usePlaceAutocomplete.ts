import { useEffect, useRef, useState } from "react";
import { loadGoogleMaps } from "./googleMaps";
import { EMPTY_LOCATION, type LocationValue } from "./bookingRequest";

/** Zürich HB — the bias center for suggestions across Switzerland and
 *  selected cross-border routes. */
export const ZURICH_CENTER = { lat: 47.3769, lng: 8.5417 };
const BIAS_RADIUS_METERS = 60000;

export interface PlaceSuggestion {
  placeId: string;
  mainText: string;
  secondaryText: string;
}

const DETAIL_FIELDS = ["formatted_address", "geometry", "address_components", "name"];

/**
 * Wraps the classic Places AutocompleteService/PlacesService and the
 * Geocoder into three plain async calls, all biased toward Zürich +
 * Switzerland. Shared by PlaceAutocompleteField and ChooseOnMapModal so
 * suggestions, place details, and reverse geocoding all resolve to the same
 * LocationValue shape.
 */
export function usePlaceAutocomplete() {
  const [ready, setReady] = useState(false);
  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);
  const placesService = useRef<google.maps.places.PlacesService | null>(null);
  const sessionToken = useRef<google.maps.places.AutocompleteSessionToken | null>(null);
  const geocoder = useRef<google.maps.Geocoder | null>(null);

  useEffect(() => {
    let cancelled = false;
    loadGoogleMaps()
      .then(() => {
        if (cancelled) return;
        autocompleteService.current = new google.maps.places.AutocompleteService();
        // PlacesService needs a container node but never attaches it — a
        // detached div is the documented pattern for a map-less instance.
        placesService.current = new google.maps.places.PlacesService(document.createElement("div"));
        geocoder.current = new google.maps.Geocoder();
        setReady(true);
      })
      .catch(() => setReady(false));
    return () => {
      cancelled = true;
    };
  }, []);

  const fetchSuggestions = async (input: string): Promise<PlaceSuggestion[]> => {
    if (!ready || !autocompleteService.current || !input.trim()) return [];
    if (!sessionToken.current) {
      sessionToken.current = new google.maps.places.AutocompleteSessionToken();
    }

    try {
      const { predictions } = await autocompleteService.current.getPlacePredictions({
        input,
        componentRestrictions: { country: "ch" },
        locationBias: { center: ZURICH_CENTER, radius: BIAS_RADIUS_METERS },
        sessionToken: sessionToken.current
      });
      return predictions.map((prediction) => ({
        placeId: prediction.place_id,
        mainText: prediction.structured_formatting?.main_text ?? prediction.description,
        secondaryText: prediction.structured_formatting?.secondary_text ?? ""
      }));
    } catch {
      return [];
    }
  };

  const fetchDetails = (placeId: string): Promise<LocationValue> => {
    return new Promise((resolve) => {
      if (!placesService.current) {
        resolve(EMPTY_LOCATION);
        return;
      }
      const usedToken = sessionToken.current ?? undefined;
      placesService.current.getDetails(
        { placeId, fields: DETAIL_FIELDS, sessionToken: usedToken },
        (place, status) => {
          // The session token is spent once details are fetched — a fresh
          // one is created lazily on the next suggestion request.
          sessionToken.current = null;
          if (status !== google.maps.places.PlacesServiceStatus.OK || !place) {
            resolve(EMPTY_LOCATION);
            return;
          }
          resolve(locationFromPlaceResult(place));
        }
      );
    });
  };

  const reverseGeocode = async (lat: number, lng: number): Promise<LocationValue> => {
    if (!ready || !geocoder.current) return { ...EMPTY_LOCATION, lat, lng };
    try {
      const { results } = await geocoder.current.geocode({ location: { lat, lng } });
      if (!results?.[0]) return { ...EMPTY_LOCATION, lat, lng };
      return locationFromPlaceResult(results[0], { lat, lng });
    } catch {
      return { ...EMPTY_LOCATION, lat, lng };
    }
  };

  return { ready, fetchSuggestions, fetchDetails, reverseGeocode };
}

function locationFromPlaceResult(
  place: google.maps.places.PlaceResult | google.maps.GeocoderResult,
  fallbackCoords?: { lat: number; lng: number }
): LocationValue {
  const location = place.geometry?.location;
  const lat = location ? location.lat() : (fallbackCoords?.lat ?? null);
  const lng = location ? location.lng() : (fallbackCoords?.lng ?? null);
  const components = place.address_components ?? [];
  const city =
    components.find((component) => component.types.includes("locality"))?.long_name ??
    components.find((component) => component.types.includes("postal_town"))?.long_name ??
    null;
  const country =
    components.find((component) => component.types.includes("country"))?.long_name ?? null;
  const description = "name" in place && place.name ? place.name : (place.formatted_address ?? "");

  return {
    description,
    placeId: "place_id" in place ? (place.place_id ?? null) : null,
    formattedAddress: place.formatted_address ?? null,
    lat,
    lng,
    city,
    country
  };
}
