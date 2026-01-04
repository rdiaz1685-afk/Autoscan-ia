
export interface EvaluationState {
  userName?: string;
  vin?: string;
  vehicleInfo?: {
    make: string;
    model: string;
    year: number;
    color: string;
  };
  vehicleSpecs?: {
    engine?: string;
    horsepower?: string;
    torque?: string;
    transmission?: string;
    driveType?: string;
    fuelEconomy?: string;
    curiosities?: string[];
  };
  legalStatus?: {
    invoiceType?: 'Original' | 'Empresa' | 'Aseguradora' | 'Otro';
    unpaidTaxes?: boolean; // Refrendos/Tenencias
    hasFines?: boolean;
    verificationHologram?: string;
  };
  exteriorPhotos: string[];
  obdCodes: string[];
  inspectionChat: Message[];
  status: 'idle' | 'scanning' | 'inspecting' | 'diagnosing' | 'completed';
  finalReport?: string;
}

export interface Message {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}
