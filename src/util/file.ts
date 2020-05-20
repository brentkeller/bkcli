import * as fse from 'fs-extra';

export const getJsonFromFile = async (filepath: string) => {
  try {
    await fse.ensureFile(filepath);
    return await fse.readJSON(filepath);
  } catch (error) {
    // TODO: How to relay read errors?
    return {};
  }
};

export const fileExists = (filepath: string) => {
  return fse.existsSync(filepath);
};

export const writeJsonToFile = async (filepath: string, data: any) => {
  await fse.writeJSON(filepath, data);
};
