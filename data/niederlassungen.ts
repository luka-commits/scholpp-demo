export type Niederlassung = {
  id: string;
  name: string;
  stadt: string;
  adresse: string;
  koordinaten: { lat: number; lng: number };
  istHQ?: boolean;
  fleet: {
    sprinter: boolean;
    caddy: boolean;
    schwerlastWerkzeug: boolean;
  };
};

// Quelle: scholpp.de Standorte. Fleet-Flags sind Demo-Mocks
// (keine echte Fleet-DB-Anbindung).
export const niederlassungen: Niederlassung[] = [
  {
    id: "nl-dietzenbach",
    name: "SCHOLPP HQ Dietzenbach",
    stadt: "Dietzenbach",
    adresse: "Robert-Bosch-Str. 10, 63128 Dietzenbach",
    koordinaten: { lat: 50.0061, lng: 8.7773 },
    istHQ: true,
    fleet: { sprinter: true, caddy: true, schwerlastWerkzeug: true },
  },
  {
    id: "nl-berlin",
    name: "SCHOLPP Berlin",
    stadt: "Berlin",
    adresse: "Wolfener Str. 32-34, 12681 Berlin",
    koordinaten: { lat: 52.5413, lng: 13.5421 },
    fleet: { sprinter: true, caddy: true, schwerlastWerkzeug: true },
  },
  {
    id: "nl-chemnitz",
    name: "SCHOLPP Chemnitz",
    stadt: "Chemnitz",
    adresse: "Bornaer Str. 205, 09114 Chemnitz",
    koordinaten: { lat: 50.8633, lng: 12.8861 },
    fleet: { sprinter: true, caddy: true, schwerlastWerkzeug: true },
  },
  {
    id: "nl-leonberg",
    name: "SCHOLPP Leonberg",
    stadt: "Leonberg",
    adresse: "Hertichstr. 47, 71229 Leonberg",
    koordinaten: { lat: 48.7989, lng: 9.0136 },
    fleet: { sprinter: true, caddy: true, schwerlastWerkzeug: true },
  },
  {
    id: "nl-dresden",
    name: "SCHOLPP Dresden",
    stadt: "Dresden",
    adresse: "Bremer Str. 65, 01067 Dresden",
    koordinaten: { lat: 51.0658, lng: 13.7099 },
    fleet: { sprinter: true, caddy: true, schwerlastWerkzeug: false },
  },
  {
    id: "nl-jena",
    name: "SCHOLPP Jena",
    stadt: "Jena",
    adresse: "Löbstedter Str. 78, 07749 Jena",
    koordinaten: { lat: 50.9412, lng: 11.5736 },
    fleet: { sprinter: true, caddy: true, schwerlastWerkzeug: false },
  },
  {
    id: "nl-bremen",
    name: "SCHOLPP Bremen",
    stadt: "Bremen",
    adresse: "Senator-Bömers-Str. 21, 28197 Bremen",
    koordinaten: { lat: 53.1131, lng: 8.7331 },
    fleet: { sprinter: true, caddy: true, schwerlastWerkzeug: false },
  },
];

export function getNiederlassung(id: string): Niederlassung | undefined {
  return niederlassungen.find((n) => n.id === id);
}
