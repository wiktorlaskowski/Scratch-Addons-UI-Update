export default async function ({ addon }) {
  let prevContainer = null;
  let observer = null;

  const sortSprites = (container) => {
    if (!container) return;
    const items = Array.from(container.children);
    items.sort((a, b) => {
      const nameA = a.querySelector("[class^='sprite-selector-item_sprite-name']").innerText.toLowerCase();
      const nameB = b.querySelector("[class^='sprite-selector-item_sprite-name']").innerText.toLowerCase();
      return nameA.localeCompare(nameB);
    });
    for (const item of items) {
      container.appendChild(item);
    }
  };

  while (true) {
    await addon.tab.waitForElement("div[class^='sprite-selector_items-wrapper']", {
      markAsSeen: true,
      reduxEvents: [
        "scratch-gui/mode/SET_PLAYER",
        "fontsLoaded/SET_FONTS_LOADED",
        "scratch-gui/locales/SELECT_LOCALE",
        "scratch-gui/sprites/ADD_SPRITE",
        "scratch-gui/sprites/DELETE_SPRITE",
        "scratch-gui/sprites/UPDATE_SPRITE_NAME"
      ],
      reduxCondition: (state) => !state.scratchGui.mode.isPlayerOnly,
    });

    const container = document.querySelector("div[class^='sprite-selector_items-wrapper']");
    if (container && container !== prevContainer) {
      if (observer) observer.disconnect();
      observer = new MutationObserver(() => sortSprites(container));
      observer.observe(container, { childList: true });
      prevContainer = container;
    }
    sortSprites(container);
  }
}
