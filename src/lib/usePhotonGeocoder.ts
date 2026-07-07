import { EMPTY_LOCATION, type LocationValue } from "./bookingRequest";

/** Zürich HB — the bias point for suggestions across Switzerland and
 *  selected cross-border routes. */
export const ZURICH_CENTER = { lat: 47.3769, lng: 8.5417 };

const PHOTON_BASE = "https://photon.komoot.io";
const PROVIDER = "photon";

export interface PhotonSuggestion {
  /** Stable-ish React key — OSM type+id when Photon provides one. */
  key: string;
  mainText: string;
  secondaryText: string;
  location: LocationValue;
}

export type GeocodeResult<T> =
  | { status: "ok"; value: T }
  | { status: "empty" }
  | { status: "error" };

interface PhotonProperties {
  name?: string;
  street?: string;
  housenumber?: string;
  city?: string;
  postcode?: string;
  state?: string;
  country?: string;
  osm_type?: string;
  osm_id?: number;
}

interface PhotonFeature {
  type: "Feature";
  geometry: { type: "Point"; coordinates: [number, number] };
  properties: PhotonProperties;
}

interface PhotonResponse {
  features?: PhotonFeature[];
}

function mainTextFor(props: PhotonProperties): string {
  if (props.name) return props.name;
  const street = [props.street, props.housenumber].filter(Boolean).join(" ");
  if (street) return street;
  if (props.city) return props.city;
  return "Unnamed location";
}

function secondaryTextFor(props: PhotonProperties, mainText: string): string {
  const cityLine = [props.postcode, props.city].filter(Boolean).join(" ");
  const parts = [cityLine || (props.city !== mainText ? props.city : null), props.country].filter(
    (part): part is string => Boolean(part)
  );
  // Deduplicate consecutive identical parts (e.g. city already equals mainText).
  return Array.from(new Set(parts)).join(", ");
}

function formattedAddressFor(props: PhotonProperties): string {
  const street = [props.street, props.housenumber].filter(Boolean).join(" ");
  const cityLine = [props.postcode, props.city].filter(Boolean).join(" ");
  return [street, cityLine, props.state, props.country].filter(Boolean).join(", ");
}

function locationFromFeature(feature: PhotonFeature): LocationValue {
  const props = feature.properties ?? {};
  const [lng, lat] = feature.geometry.coordinates;
  const mainText = mainTextFor(props);

  return {
    ...EMPTY_LOCATION,
    description: mainText,
    formattedAddress: formattedAddressFor(props) || mainText,
    lat,
    lng,
    city: props.city ?? null,
    country: props.country ?? null,
    placeId: props.osm_type && props.osm_id != null ? `osm:${props.osm_type}:${props.osm_id}` : null,
    provider: PROVIDER
  };
}

function suggestionFromFeature(feature: PhotonFeature, index: number): PhotonSuggestion {
  const props = feature.properties ?? {};
  const mainText = mainTextFor(props);
  const key =
    props.osm_type && props.osm_id != null ? `${props.osm_type}${props.osm_id}` : `${mainText}-${index}`;

  return {
    key,
    mainText,
    secondaryText: secondaryTextFor(props, mainText),
    location: locationFromFeature(feature)
  };
}

/**
 * Free, no-key geocoding via the public Photon API (photon.komoot.io) —
 * OpenStreetMap data underneath. Forward search already returns full
 * address/coordinate data per result, so there's no separate "details" round
 * trip the way Google's Places flow needed.
 */
export function usePhotonGeocoder() {
  const fetchSuggestions = async (query: string): Promise<GeocodeResult<PhotonSuggestion[]>> => {
    if (!query.trim()) return { status: "ok", value: [] };

    const url = new URL(`${PHOTON_BASE}/api/`);
    url.searchParams.set("q", query);
    url.searchParams.set("limit", "6");
    url.searchParams.set("lang", "en");
    url.searchParams.set("lat", String(ZURICH_CENTER.lat));
    url.searchParams.set("lon", String(ZURICH_CENTER.lng));
    url.searchParams.set("location_bias_scale", "0.4");

    try {
      const response = await fetch(url.toString());
      if (!response.ok) return { status: "error" };
      const data: PhotonResponse = await response.json();
      const features = data.features ?? [];
      if (features.length === 0) return { status: "empty" };
      return { status: "ok", value: features.map(suggestionFromFeature) };
    } catch {
      return { status: "error" };
    }
  };

  const reverseGeocode = async (lat: number, lng: number): Promise<GeocodeResult<LocationValue>> => {
    const url = new URL(`${PHOTON_BASE}/reverse`);
    url.searchParams.set("lat", String(lat));
    url.searchParams.set("lon", String(lng));

    try {
      const response = await fetch(url.toString());
      if (!response.ok) return { status: "error" };
      const data: PhotonResponse = await response.json();
      const feature = data.features?.[0];
      if (!feature) return { status: "empty" };
      return { status: "ok", value: locationFromFeature(feature) };
    } catch {
      return { status: "error" };
    }
  };

  return { fetchSuggestions, reverseGeocode };
}
