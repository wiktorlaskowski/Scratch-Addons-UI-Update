export default async function ({ addon }) {
  let prevContainer = null;
  let observer = null;

  const sortSounds = (container) => {
    if (!container) return;
    const items = Array.from(container.children);
    items.sort((a, b) => {
      const nameA = a.querySelector("[class^='sound-selector-item_sound-name']").innerText.toLowerCase();
      const nameB = b.querySelector("[class^='sound-selector-item_sound-name']").innerText.toLowerCase();
      return nameA.localeCompare(nameB);
    });
    for (const item of items) {
      container.appendChild(item);
    }
  };

  while (true) {
    await addon.tab.waitForElement("div[class^='sound-selector_items-wrapper']", {
      markAsSeen: true,
      reduxEvents: [
        'scratch-gui/mode/SET_PLAYER',
        'fontsLoaded/SET_FONTS_LOADED',
        'scratch-gui/locales/SELECT_LOCALE',
        'scratch-gui/sounds/ADD_SOUND',
        'scratch-gui/sounds/DELETE_SOUND',
        'scratch-gui/sounds/UPDATE_SOUND_NAME'
      ],
      reduxCondition: (state) => !state.scratchGui.mode.isPlayerOnly,
    });

    const container = document.querySelector("div[class^='sound-selector_items-wrapper']");
    if (container && container !== prevContainer) {
      if (observer) observer.disconnect();
      observer = new MutationObserver(() => sortSounds(container));
      observer.observe(container, { childList: true });
      prevContainer = container;
    }
    sortSounds(container);
  }
}
