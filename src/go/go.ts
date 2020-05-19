export interface Shortcuts {
  [key: string]: string;
}

export interface Shortcut {
  name: string;
  path: string;
}

const compareNames = (a: Shortcut, b: Shortcut) => {
  const nameA = a.name.toUpperCase(); // ignore upper and lowercase
  const nameB = b.name.toUpperCase(); // ignore upper and lowercase
  if (nameA < nameB) {
    return -1;
  }
  if (nameA > nameB) {
    return 1;
  }
  return 0;
};

export const getShortcuts = (dictionary: Shortcuts) => {
  const shortcuts = Object.entries(dictionary)
    .map(entry => {
      return {
        name: entry[0],
        path: entry[1],
      } as Shortcut;
    })
    .sort(compareNames);
  return shortcuts;
};
