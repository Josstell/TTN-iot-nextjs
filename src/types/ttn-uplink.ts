export interface TTNUplinkResponse {
  result: TTNUplinkResult;
}


export interface TTNUplinkResult {
  end_device_ids: EndDeviceIds;
  received_at: string; // ISO date
  uplink_message: UplinkMessage;
}

export interface EndDeviceIds {
  device_id: string;
  application_ids: {
    application_id: string;
  };
  dev_eui: string;
  dev_addr: string;
}

export interface UplinkMessage {
  f_port: number;
  f_cnt: number;
  frm_payload: string;

  decoded_payload: DecodedPayload;

  rx_metadata: RxMetadata[];

  settings: UplinkSettings;

  received_at: string; // ISO date
  consumed_airtime: string;

  packet_error_rate?: number;

  network_ids: NetworkIds;

  last_battery_percentage: LastBatteryPercentage;
}
export interface DecodedPayload {
  battery: number;
  humidity: number;
  temperature: number;
}
export interface RxMetadata {
  gateway_ids: {
    gateway_id: string;
    eui: string;
  };

  time: string;
  timestamp: number;

  rssi: number;
  channel_rssi: number;
  snr: number;

  frequency_offset: string;

  channel_index?: number;

  received_at: string;
}

export interface UplinkSettings {
  data_rate: {
    lora: {
      bandwidth: number;
      spreading_factor: number;
      coding_rate: string;
    };
  };

  frequency: string;
  timestamp: number;
  time: string;
}

export interface NetworkIds {
  net_id: string;
  ns_id: string;
  tenant_id: string;
  cluster_id: string;
  cluster_address: string;
}

export interface LastBatteryPercentage {
  f_cnt: number;
  value: number;
  received_at: string;
}

export interface SensorPoint {
  time: string;
  temperature: number;
  humidity: number;
  battery: number;
}
