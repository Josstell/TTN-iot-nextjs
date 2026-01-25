import { NextResponse } from "next/server";

const TTN_URL =
  "https://nam1.cloud.thethings.network/api/v3/as/applications/sensor-seox-ls/packages/storage/uplink_message";

export async function GET(): Promise<Response> {
  const url = new URL(TTN_URL);
  url.searchParams.append("last", "12h");

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      Authorization: `Bearer ${process.env.TTN_API_KEY_CO}`,
      Accept: "text/event-stream",
    },
    cache: "no-store",
  });

  if (!response.body) {
    return NextResponse.json(
      { error: "No se pudo obtener el stream de TTN" },
      { status: 500 },
    );
  }

  // Procesar el stream línea por línea (TTN devuelve JSON por línea)
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  const customStream = new ReadableStream({
    async start(controller) {
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines[lines.length - 1]; // Guardar línea incompleta

          for (let i = 0; i < lines.length - 1; i++) {
            const line = lines[i].trim();
            if (line) {
              try {
                const data = JSON.parse(line);
                // Enviar cada JSON en formato SSE correcto
                controller.enqueue(
                  new TextEncoder().encode(`data: ${JSON.stringify(data)}\n\n`),
                );
              } catch (err) {
                console.warn("Línea inválida:", line);
              }
            }
          }
        }

        // Procesar última línea si existe
        if (buffer.trim()) {
          try {
            const data = JSON.parse(buffer.trim());
            controller.enqueue(
              new TextEncoder().encode(`data: ${JSON.stringify(data)}\n\n`),
            );
          } catch (err) {
            console.warn("Última línea inválida:", buffer);
          }
        }
      } catch (error) {
        console.error("Error en stream:", error);
        controller.error(error);
      } finally {
        controller.close();
      }
    },
  });


  return new Response(customStream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
