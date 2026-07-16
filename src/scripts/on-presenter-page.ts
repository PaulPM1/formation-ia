/* Les scripts des visuels sont des modules : ils ne s'exécutent qu'une fois
   par session. Avec le ClientRouter, chaque navigation remplace le DOM sans
   recharger la page — l'initialisation doit donc se rejouer à chaque
   astro:page-load (émis aussi au chargement initial). */
export function onPresenterPage(init: () => void): void {
  document.addEventListener('astro:page-load', init);
}
