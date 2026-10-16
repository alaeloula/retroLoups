# Sur la piste des loups – tableau de rétro

Tableau de rétrospective d'équipe sur le thème des loups, hébergé sur GitHub Pages.

Colonnes : Ce qui a bien marché · Ce qui nous a freinés · Ce qu'on a appris · Bravo et remerciements · Ce qu'on fait ensuite.

## Liens
- **Équipe** : `https://alaeloula.github.io/retroLoups/?r=sprint-24`
- **Animateur** : `https://alaeloula.github.io/retroLoups/?r=sprint-24#animateur`

`?r=` donne un nom à la rétro : changez-le à chaque sprint pour repartir d'un tableau vide.

## Fonctionnement
- Chaque participant écrit ses notes. Elles sont envoyées automatiquement dans une feuille Google Sheets, et il ne voit que les siennes.
- L'animateur ouvre le lien `#animateur`, saisit sa clé, puis clique sur **Actualiser** pour voir les notes de toute l'équipe. Il fait ensuite voter.
- Le bouton « Importer des notes » n'apparaît que dans la vue animateur.

## Mise en place de Google Sheets (une seule fois)
1. Créez une feuille Google Sheets vide, puis ouvrez **Extensions → Apps Script**.
2. Remplacez le contenu par celui de `apps-script/Code.gs` et changez `CLE_ANIMATEUR`.
3. **Déployer → Nouveau déploiement → Application Web** :
   - Exécuter en tant que : **Moi**
   - Qui a accès : **Tout le monde**
4. Autorisez l'accès, puis copiez l'URL qui finit par `/exec`.
5. Collez-la dans `index.html`, dans `const ENDPOINT = "";`.

Si `ENDPOINT` est vide, le tableau fonctionne en mode hors ligne : chacun envoie un code `MEUTE:…` que l'animateur importe.

## Confidentialité
Les notes sont stockées dans votre feuille Google. Seule la personne qui a la clé animateur peut les lire depuis le tableau. Évitez d'y écrire des informations sensibles.
