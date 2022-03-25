import { Feature, FeatureCollection, MultiPoint, Point } from 'geojson';
import { Observable } from 'rxjs/internal/Observable';
import { MapboxOptions } from 'mapbox-gl';

export interface MinimalTreks {
  type: string;
  name: string;
  features: MinimalTrek[];
}

export interface MinimalTrekProperties {
  id: number;
  first_picture: { author: string; legend: string; title: string; url: string };
  name: string;
  departure: string;
  accessibilities: number[];
  difficulty: number;
  practice: number;
  themes: number[];
  usages: number[];
  length: number;
}

export interface MinimalTrek extends Feature<Point> {
  type: 'Feature';
  geometry: { type: 'Point'; coordinates: number[] };
  properties: MinimalTrekProperties;
}

export interface TrekProperties extends MinimalTrekProperties {
  departure: string;
  pictures: Picture[];
  description_teaser: string;
  duration: number;
  arrival: string;
  ascent: number;
  route: number;
  description: string;
  is_park_centered: boolean;
  access: string;
  advised_parking: string;
  advice: string;
  networks: number[];
  cities: string[];
  information_desks: InformationDesk[];
  departure_city?: string;
  arrival_city?: string;
  children: Treks;
}

export interface Trek extends Feature<MultiPoint> {
  type: 'Feature';
  geometry: { type: 'MultiPoint'; coordinates: number[][] };
  properties: TrekProperties;
}

export interface HydratedTrek extends Feature<MultiPoint> {
  type: 'Feature';
  geometry: { type: 'MultiPoint'; coordinates: number[][] };
  properties: HydratedTrekProperties;
}

export interface HydratedTrekProperties {
  id: number;
  thumbnail: string;
  name: string;
  usages: number[];
  length: number;
  departure: string;
  pictures: Picture[];
  description_teaser: string;
  duration: number;
  arrival: string;
  ascent: number;
  description: string;
  is_park_centered: boolean;
  access: string;
  advised_parking: string;
  advice: string;
  difficulty: Property;
  practice: Property;
  route: Property;
  accessibilities: Property[];
  cities: Property[];
  networks: Property[];
  themes: Property[];
  information_desks: InformationDesk[];
  departure_city?: Property;
  arrival_city?: Property;
  parking_location: number[];
  profile: string;
  slug?: string;
  points_reference?: number[][];
  ambiance: string;
  children: Treks;
}

export interface InformationDesk {
  id: number;
  description: string;
  email: string;
  latitude: number;
  longitude: number;
  municipality: string;
  name: string;
  phone: string;
  photo_url: string;
  postal_code: string;
  street: string;
  website: string;
  type: number | Property;
  picture: string;
}

export interface Picture {
  author: string;
  legend: string;
  title: string;
  url: string;
}

export interface Filter {
  id: string;
  name: string;
  type: 'contains' | 'interval';
  values: FilterValue[];
  showAllLabel: string;
  hideAllLabel: string;
}

export type Order = 'alphabetical' | 'location' | 'random' | null;

export interface IntervalFilter extends Filter {
  id: 'length';
  type: 'interval';
}

export interface ContainsFilter extends Filter {
  id: 'difficulty' | 'themes' | 'usages' | 'accessibilities';
  type: 'contains';
}

export interface FilterValue {
  id: number;
  name: string;
  checked: boolean;
  interval?: [number, number];
  pictogram?: string;
  color?: string;
}

export interface InformationIntro {
  id: number;
  title: string;
}

export interface InformationItem {
  id: number;
  title: string;
  content: string;
  external_url: string;
}

export interface Settings {
  data: DataSetting[];
  filters: Filter[];
}

export interface DataSetting {
  id: string;
  name: string;
  values: Property[];
}

export interface Property {
  id: number;
  name: string;
  pictogram?: string;
  color?: string;
  slug?: string;
}

export interface Pois extends FeatureCollection {
  type: 'FeatureCollection';
  features: Poi[];
}

export interface Poi extends Feature<Point> {
  type: 'Feature';
  geometry: { type: 'Point'; coordinates: number[] };
  properties: {
    id: number;
    pictures: Picture[];
    name: string;
    description: string;
    thumbnail: string;
    practical_info?: string;
    contact?: string;
    email?: string;
    website?: string;
    type?: number;
  };
}

export interface TouristicContents extends FeatureCollection {
  type: 'FeatureCollection';
  features: TouristicContent[];
}

export interface TouristicContent extends Feature<Point> {
  type: 'Feature';
  geometry: { type: 'Point'; coordinates: number[] };
  properties: {
    id: number;
    pictures: Picture[];
    name: string;
    description: string;
    description_teaser: string;
    category: number;
  };
}

export interface TouristicCategorie {
  id: number;
  name: string;
}

export interface TouristicCategoryWithFeatures {
  id: number;
  name: string;
  features: TouristicContent[];
}

export interface TouristicEvents extends FeatureCollection {
  type: 'FeatureCollection';
  features: TouristicEvent[];
}

export interface TouristicEvent extends Feature<Point> {
  type: 'Feature';
  geometry: { type: 'Point'; coordinates: number[] };
  properties: {
    id: number;
  };
}

export interface Treks extends FeatureCollection {
  type: 'FeatureCollection';
  features: Trek[];
}

export interface TreksService {
  offline: boolean;
  treks$: Observable<MinimalTreks | null>;
  filteredTreks$: Observable<MinimalTrek[]>;
  getTrekById(id: number, parentId?: number): Observable<Trek | null>;
  getPoisForTrekById(id: number, parentId?: number): Observable<Pois>;
  getTouristicContentsForTrekById(
    id: number,
    parentId?: number
  ): Observable<TouristicContents>;
  getTouristicEventsForTrekById(
    id: number,
    parentId?: number
  ): Observable<TouristicEvents>;
  getTreksUrl(): string;
  getTrekDetailsUrl(trekId: number, parentId?: number): string;
  getTrekImageSrc(trek: Trek, picture?: Picture): string | Promise<string>;
  getTreksMapUrl(): string;
  getTrekMapUrl(trekId: number, parentId?: number): string;
  getMapConfigForTrekById(
    trek: Trek,
    isOffline: boolean
  ): MapboxOptions | Promise<MapboxOptions>;
  getCommonImgSrc(): string | Promise<string>;
}
