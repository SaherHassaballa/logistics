import React from 'react';
import { RealInteractiveMap } from './RealInteractiveMap';
import { LocationPoint, VehicleCategory, DeliveryStop } from '../../types';

export interface MapVisualizerProps {
  pickup: LocationPoint;
  dropoff: LocationPoint;
  stops?: DeliveryStop[];
  onStopsChange?: (stops: DeliveryStop[]) => void;
  driverCoords?: { lat: number; lng: number };
  vehicleType?: VehicleCategory;
  driverName?: string;
  isMoving?: boolean;
  statusText?: string;
  className?: string;
  readOnly?: boolean;
}

export const MapVisualizer: React.FC<MapVisualizerProps> = ({
  pickup,
  dropoff,
  stops,
  onStopsChange,
  driverCoords,
  vehicleType = 'PICKUP',
  driverName = 'Ahmed Hassan',
  isMoving = true,
  statusText = 'En Route to Delivery Point',
  className = 'h-96 w-full',
  readOnly = false,
}) => {
  // If stops array is supplied, use directly; otherwise construct from pickup and dropoff
  const resolvedStops: DeliveryStop[] = stops && stops.length > 0
    ? stops
    : [
        {
          id: 'pickup-0',
          type: 'PICKUP',
          sequence: 0,
          title: 'Pickup Location',
          address: pickup.address,
          addressAr: pickup.addressAr,
          city: pickup.city,
          lat: pickup.lat || 30.5877,
          lng: pickup.lng || 31.502,
          contactName: pickup.contactName,
          contactPhone: pickup.contactPhone,
          instructions: pickup.notes,
        },
        {
          id: 'dropoff-final',
          type: 'DROPOFF',
          sequence: 1,
          title: 'Destination',
          address: dropoff.address,
          addressAr: dropoff.addressAr,
          city: dropoff.city,
          lat: dropoff.lat || 30.3015,
          lng: dropoff.lng || 31.7428,
          contactName: dropoff.contactName,
          contactPhone: dropoff.contactPhone,
          instructions: dropoff.notes,
        },
      ];

  // Default driver position somewhere midway if driverCoords not provided
  const activeDriverCoords = driverCoords || {
    lat: (resolvedStops[0].lat + resolvedStops[resolvedStops.length - 1].lat) / 2 + 0.02,
    lng: (resolvedStops[0].lng + resolvedStops[resolvedStops.length - 1].lng) / 2 + 0.03,
  };

  return (
    <RealInteractiveMap
      stops={resolvedStops}
      onStopsChange={onStopsChange}
      driverCoords={activeDriverCoords}
      vehicleType={vehicleType}
      driverName={driverName}
      isMoving={isMoving}
      statusText={statusText}
      className={className}
      readOnly={readOnly}
    />
  );
};
