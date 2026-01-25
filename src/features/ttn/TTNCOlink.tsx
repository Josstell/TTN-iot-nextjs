"use client";

import { useEffect, useState } from "react";
import { SensorReading, TTNUplinkEvent } from "@/types/ttn-uplinks-Co";

export default function TTNCOtream() {
  const [messages, setMessages] = useState<SensorReading[]>([]);

  useEffect(() => {
    const eventSource = new EventSource("/api/ttn/conductivity");

    eventSource.onmessage = (event: MessageEvent<string>) => {
      console.log("Evento recibido conductivity:", event.data);
      try {
        const parsed: TTNUplinkEvent = JSON.parse(event.data);

        const payload = parsed.result.uplink_message.decoded_payload;
        if (!payload) return;

        setMessages((prev) => [
          ...prev,
          {
            deviceId: parsed.result.end_device_ids.device_id,
            time: parsed.result.uplink_message.received_at,
            temperature:
              parsed.result.uplink_message.decoded_payload.temp_SOIL1,
            humidity: parsed.result.uplink_message.decoded_payload.water_SOIL1,
            battery: parsed.result.uplink_message.decoded_payload.BatV,
            conductivity:
              parsed.result.uplink_message.decoded_payload.conduct_SOIL1,
            rssi: parsed.result.uplink_message.rx_metadata[0].rssi,
            snr: parsed.result.uplink_message.rx_metadata[0].snr,
          },
        ]);
      } catch (err) {
        console.warn("Evento no válido:", err);
      }
    };

    eventSource.onerror = () => {
      eventSource.close();
    };

    return () => eventSource.close();
  }, []);

  return (
    <div>
      <h2>Uplinks TTN Conductivty</h2>
      <pre>{JSON.stringify(messages, null, 2)}</pre>
    </div>
  );
}
