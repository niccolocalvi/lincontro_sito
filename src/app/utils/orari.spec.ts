import { ORARI_MOCK } from '../testing/pocketbase.mock';
import { formattaOra, isChiuso, orarioDelGiorno } from './orari';

describe('utils/orari', () => {
  it("formatta l'orario in HH:MM", () => {
    expect(formattaOra('05:30:00+02')).toBe('05:30');
    expect(formattaOra('')).toBe('');
  });

  it('trova il giorno corretto', () => {
    // 5 novembre 2026 è un giovedì
    expect(orarioDelGiorno(ORARI_MOCK, new Date(2026, 10, 5))?.day).toBe('Giovedì');
    // 8 novembre 2026 è una domenica
    expect(orarioDelGiorno(ORARI_MOCK, new Date(2026, 10, 8))?.day).toBe('Domenica');
  });

  it('considera chiuso un giorno senza orari', () => {
    expect(isChiuso({ ...ORARI_MOCK[0], from: '', to: '' })).toBe(true);
    expect(isChiuso(ORARI_MOCK[0])).toBe(false);
  });
});
