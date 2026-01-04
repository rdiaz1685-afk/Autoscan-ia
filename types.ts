
export interface EvaluationState {
  userName?: string;
  vin?: string;
  currentPhotoStep?: number; // Para no perder el progreso si la cámara reinicia la app
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
    unpaidTaxes?: boolean;
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
