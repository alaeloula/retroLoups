/**
 * Rétro « Sur la piste des loups » – stockage des notes dans Google Sheets.
 *
 * 1. Changez la clé animateur ci-dessous (gardez-la pour vous).
 * 2. Déployer > Nouveau déploiement > Application Web
 *    - Exécuter en tant que : Moi
 *    - Qui a accès : Tout le monde
 * 3. Copiez l'URL de l'application Web (elle finit par /exec).
 */
const CLE_ANIMATEUR = 'changez-moi'; // À changer UNIQUEMENT dans Apps Script, jamais ici (dépôt public)

const FEUILLE = 'Notes';
const ENTETES = ['id', 'retro', 'colonne', 'texte', 'auteur', 'responsable', 'echeance', 'votes', 'supprime', 'date'];
const COLONNES = ['garder', 'ameliorer', 'appris', 'merci', 'actions'];

function feuille_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let f = ss.getSheetByName(FEUILLE);
  if (!f) {
    f = ss.insertSheet(FEUILLE);
    f.appendRow(ENTETES);
    f.setFrozenRows(1);
  }
  return f;
}

function reponse_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

// Empêche Sheets d'interpréter un texte comme une formule (=, +, -, @).
function texte_(v, max) {
  let s = String(v == null ? '' : v).slice(0, max || 2000);
  if (/^[=+\-@]/.test(s)) s = "'" + s;
  return s;
}

function ligneDe_(f, id) {
  const n = f.getLastRow() - 1;
  if (n < 1) return -1;
  const ids = f.getRange(2, 1, n, 1).getValues().map(r => String(r[0]));
  const i = ids.indexOf(String(id));
  return i < 0 ? -1 : i + 2;
}

// Lecture des notes : réservée à l'animateur (clé obligatoire).
function doGet(e) {
  const p = e.parameter || {};
  if (p.cle !== CLE_ANIMATEUR) return reponse_({ ok: false, erreur: 'cle' });
  const retro = String(p.retro || 'retro');
  const f = feuille_();
  const n = f.getLastRow() - 1;
  const lignes = n > 0 ? f.getRange(2, 1, n, ENTETES.length).getValues() : [];
  const notes = lignes
    .filter(r => String(r[1]) === retro && String(r[8]) !== 'oui')
    .map(r => ({ id: String(r[0]), col: String(r[2]), t: String(r[3]).replace(/^'/, ''), by: String(r[4]),
                 who: String(r[5]), when: String(r[6]), v: Number(r[7]) || 0 }));
  return reponse_({ ok: true, notes: notes });
}

// Ajout, suppression et votes.
function doPost(e) {
  let d;
  try { d = JSON.parse(e.postData.contents); } catch (err) { return reponse_({ ok: false, erreur: 'format' }); }
  const verrou = LockService.getScriptLock();
  verrou.waitLock(10000);
  try {
    const f = feuille_();
    const ligne = ligneDe_(f, d.id);
    if (d.action === 'add') {
      if (!d.id || !d.t || COLONNES.indexOf(d.col) < 0) return reponse_({ ok: false, erreur: 'note' });
      if (ligne < 0) {
        f.appendRow([texte_(d.id, 60), texte_(d.retro, 40), d.col, texte_(d.t), texte_(d.by, 80),
                     texte_(d.who, 80), texte_(d.when, 80), 0, '', new Date()]);
      }
      return reponse_({ ok: true });
    }
    if (d.action === 'delete') {
      if (ligne > 0) f.getRange(ligne, 9).setValue('oui');
      return reponse_({ ok: true });
    }
    if (d.action === 'vote') {
      if (d.cle !== CLE_ANIMATEUR) return reponse_({ ok: false, erreur: 'cle' });
      if (ligne > 0) {
        const c = f.getRange(ligne, 8);
        c.setValue((Number(c.getValue()) || 0) + 1);
      }
      return reponse_({ ok: true });
    }
    return reponse_({ ok: false, erreur: 'action' });
  } finally {
    verrou.releaseLock();
  }
}
