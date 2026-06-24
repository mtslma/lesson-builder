export const appendItem = <T>(items: T[], item: T) => [...items, item];

export const removeItemAt = <T>(items: T[], index: number) =>
  items.filter((_, itemIndex) => itemIndex !== index);

export const replaceItemAt = <T>(items: T[], index: number, nextItem: T) =>
  items.map((item, itemIndex) => (itemIndex === index ? nextItem : item));

export const updateItemAt = <T>(items: T[], index: number, updater: (item: T) => T) =>
  items.map((item, itemIndex) => (itemIndex === index ? updater(item) : item));

export const moveItem = <T>(items: T[], index: number, direction: -1 | 1) => {
  const targetIndex = index + direction;

  if (targetIndex < 0 || targetIndex >= items.length) {
    return items;
  }

  const nextItems = [...items];

  [nextItems[index], nextItems[targetIndex]] = [nextItems[targetIndex], nextItems[index]];

  return nextItems;
};
