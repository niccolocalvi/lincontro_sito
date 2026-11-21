/**
 * Crea le collection del menu del sito su PocketBase e le popola con i dati iniziali.
 *
 * Collection create (lettura pubblica, scrittura solo superuser):
 *   site_menus, site_menu_sections, site_menu_items, site_combos
 *
 * Le collection esistenti (categories, products, ... del listino prezzi) non vengono toccate.
 * Se site_menus contiene già dei record il seed viene saltato: lo script è rieseguibile.
 *
 * Esecuzione (le credenziali NON vanno mai scritte in questo file: il repo è pubblico):
 *   PB_EMAIL=... PB_PASSWORD=... node scripts/seed-menu-sito.mjs
 * Variabile opzionale: POCKETBASE_URL (default https://api.lincontrobar.it)
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import PocketBase from 'pocketbase';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const POCKETBASE_URL = process.env.POCKETBASE_URL || 'https://api.lincontrobar.it';
const { PB_EMAIL, PB_PASSWORD } = process.env;

if (!PB_EMAIL || !PB_PASSWORD) {
  console.error('Imposta PB_EMAIL e PB_PASSWORD (credenziali superuser di PocketBase).');
  process.exit(1);
}

const leggiJson = (file) => JSON.parse(fs.readFileSync(path.join(ROOT, 'scripts', file), 'utf8'));
const schema = leggiJson('pb_schema_menu_sito.json');
const seed = leggiJson('menu-sito.seed.json');

const pb = new PocketBase(POCKETBASE_URL);
pb.autoCancellation(false);

await pb.collection('_superusers').authWithPassword(PB_EMAIL, PB_PASSWORD);
console.log(`Autenticato su ${POCKETBASE_URL}`);

// deleteMissing = false: le collection non presenti nello schema restano intatte.
await pb.collections.import(schema, false);
console.log('Collection site_* create/aggiornate.');

const esistenti = await pb.collection('site_menus').getList(1, 1);
if (esistenti.totalItems > 0) {
  console.log('site_menus contiene già dei dati: seed saltato.');
  process.exit(0);
}

/** Una voce può essere ["Nome", prezzo] oppure un oggetto con i campi di site_menu_items. */
const normalizzaVoce = (voce) => (Array.isArray(voce) ? { name: voce[0], price: voce[1] } : voce);

for (const [i, menu] of seed.menus.entries()) {
  const { sections, card_image_file, ...campi } = menu;
  const dati = new FormData();
  for (const [chiave, valore] of Object.entries({ ...campi, sort_order: i + 1, active: true })) {
    dati.append(chiave, String(valore));
  }
  if (card_image_file) {
    const buffer = fs.readFileSync(path.join(ROOT, card_image_file));
    dati.append(
      'card_image',
      new Blob([buffer], { type: 'image/jpeg' }),
      path.basename(card_image_file),
    );
  }
  const recordMenu = await pb.collection('site_menus').create(dati);

  for (const [j, sezione] of sections.entries()) {
    const recordSezione = await pb.collection('site_menu_sections').create({
      menu: recordMenu.id,
      name: sezione.name,
      sort_order: j + 1,
      active: true,
    });
    for (const [k, voce] of sezione.items.entries()) {
      await pb.collection('site_menu_items').create({
        section: recordSezione.id,
        sort_order: k + 1,
        active: true,
        ...normalizzaVoce(voce),
      });
    }
  }
  console.log(`Menu "${menu.slug}": ${sections.length} sezioni.`);
}

for (const [i, combo] of seed.combos.entries()) {
  await pb
    .collection('site_combos')
    .create({ label: 'Combo', sort_order: i + 1, active: true, ...combo });
}
console.log(`Combo: ${seed.combos.length}.`);
console.log('Fatto.');
