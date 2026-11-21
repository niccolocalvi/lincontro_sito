/** Un'app di navigazione proposta nel popup "Indicazioni stradali". */
export interface AppNavigazione {
  nome: string;
  icona: string;
  url: string;
}

/**
 * Link per aprire il percorso verso il locale nelle principali app di navigazione.
 * Su smartphone i link https di Google Maps, Apple Maps e Waze aprono direttamente l'app.
 * Su Android aggiunge `geo:`, che mostra la scelta tra tutte le app di mappe installate.
 */
export function appNavigazione(
  destinazione: { lat: number; lng: number; nome: string },
  android: boolean,
): AppNavigazione[] {
  const { lat, lng, nome } = destinazione;
  const coordinate = `${lat},${lng}`;
  const app: AppNavigazione[] = [
    {
      nome: 'Google Maps',
      icona: 'fa-brands fa-google',
      url: `https://www.google.com/maps/dir/?api=1&destination=${coordinate}`,
    },
    {
      nome: 'Apple Mappe',
      icona: 'fa-brands fa-apple',
      url: `https://maps.apple.com/?daddr=${coordinate}&q=${encodeURIComponent(nome)}`,
    },
    {
      nome: 'Waze',
      icona: 'fa-brands fa-waze',
      url: `https://waze.com/ul?ll=${coordinate}&navigate=yes`,
    },
  ];
  if (android) {
    app.push({
      nome: 'Altra app',
      icona: 'fa-solid fa-map-location-dot',
      url: `geo:${coordinate}?q=${coordinate}(${encodeURIComponent(nome)})`,
    });
  }
  return app;
}
