"use client";

import { useEffect, useState } from "react";
import type { TTNUplinkResponse } from "@/types/ttn-uplink";

interface CleanUplink {
  device: string;
  temperature?: number;
  humidity?: number;
  time: string;
}

export default function TTNTHStream() {
  const [messages, setMessages] = useState<CleanUplink[]>([]);

  useEffect(() => {
    const eventSource = new EventSource("/api/ttn/temphum");

    eventSource.onmessage = (event: MessageEvent<string>) => {
      console.log("Evento recibido:", event.data);
      try {
        const parsed: TTNUplinkResponse = JSON.parse(event.data);

        const payload = parsed.result.uplink_message.decoded_payload;
        if (!payload) return;

        setMessages((prev) => [
          ...prev,
          {
            device: parsed.result.end_device_ids.device_id,
            temperature: payload.temperature,
            humidity: payload.humidity,
            time: parsed.result.uplink_message.received_at,
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
      <h2>Uplinks TTN</h2>
      <pre>{JSON.stringify(messages, null, 2)}</pre>
    </div>
  );
}
