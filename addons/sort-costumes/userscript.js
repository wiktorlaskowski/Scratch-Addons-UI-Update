export default async function ({ addon }) {
  let prevContainer = null;
  let observer = null;

  const sortCostumes = (container) => {
    if (!container) return;
    const items = Array.from(container.children);
    items.sort((a, b) => {
      const nameA = a.querySelector("[class^='costume-selector-item_costume-name']").innerText.toLowerCase();
      const nameB = b.querySelector("[class^='costume-selector-item_costume-name']").innerText.toLowerCase();
      return nameA.localeCompare(nameB);
    });
    for (const item of items) {
      container.appendChild(item);
    }
  };

  while (true) {
    await addon.tab.waitForElement("div[class^='costume-selector_items-wrapper']", {
      markAsSeen: true,
      reduxEvents: [
        'scratch-gui/mode/SET_PLAYER',
        'fontsLoaded/SET_FONTS_LOADED',
        'scratch-gui/locales/SELECT_LOCALE',
        'scratch-gui/costumes/ADD_COSTUME',
        'scratch-gui/costumes/DELETE_COSTUME',
        'scratch-gui/costumes/UPDATE_COSTUME_NAME'
      ],
      reduxCondition: (state) => !state.scratchGui.mode.isPlayerOnly,
    });

    const container = document.querySelector("div[class^='costume-selector_items-wrapper']");
    if (container && container !== prevContainer) {
      if (observer) observer.disconnect();
      observer = new MutationObserver(() => sortCostumes(container));
      observer.observe(container, { childList: true });
      prevContainer = container;
    }
    sortCostumes(container);
  }
}
