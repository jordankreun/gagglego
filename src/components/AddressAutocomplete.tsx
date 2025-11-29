import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { APIProvider, useMapsLibrary } from "@vis.gl/react-google-maps";
import { GOOGLE_MAPS_API_KEY } from "@/config/maps";

interface AddressAutocompleteProps {
  value: string;
  onChange: (address: string, placeDetails?: { lat: number; lng: number }) => void;
  placeholder?: string;
  className?: string;
}

function AddressAutocompleteInner({ value, onChange, placeholder, className }: AddressAutocompleteProps) {
  const [inputValue, setInputValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);
  const places = useMapsLibrary("places");
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    if (!places || !inputRef.current) return;

    try {
      const autocompleteInstance = new places.Autocomplete(inputRef.current, {
        fields: ["formatted_address", "geometry", "name"],
        types: ["establishment", "geocode"],
      });

      autocompleteInstance.addListener("place_changed", () => {
        const place = autocompleteInstance.getPlace();
        
        if (place.formatted_address && place.geometry?.location) {
          const address = place.formatted_address;
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          
          setInputValue(address);
          onChange(address, { lat, lng });
        } else if (place.name) {
          // Fallback to place name if formatted address not available
          setInputValue(place.name);
          onChange(place.name);
        }
      });

      setAutocomplete(autocompleteInstance);

      return () => {
        if (autocompleteInstance) {
          google.maps.event.clearInstanceListeners(autocompleteInstance);
        }
      };
    } catch (error) {
      console.error('Error initializing Google Places Autocomplete:', error);
    }
  }, [places, onChange]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    
    // If user manually types, update parent but without coordinates
    if (!autocomplete) {
      onChange(newValue);
    }
  };

  return (
    <Input
      ref={inputRef}
      value={inputValue}
      onChange={handleInputChange}
      placeholder={placeholder}
      className={className}
    />
  );
}

export function AddressAutocomplete(props: AddressAutocompleteProps) {
  return (
    <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
      <AddressAutocompleteInner {...props} />
    </APIProvider>
  );
}
