import path = require('path');
import cli from 'cli-ux';
import fetch from 'node-fetch';
import { getJsonFromFile, writeJsonToFile } from './file';

export interface MyBKCProfile {
  // Name of the config profile
  name: string;
  // URL of the MyBKC server
  url: string;
  // Auth cookie for the MyBKC server
  authCookie: string;
}

export interface MyBKCConfigFile {
  currentProfile: string;
  profiles: {
    [key: string]: MyBKCProfile;
  };
}

export interface FetchParams {
  method: string;
  data: any;
}

export class MyBKC {
  configFilePath: string;

  config: MyBKCConfigFile = { currentProfile: '', profiles: {} };

  constructor(dataDir: string) {
    this.configFilePath = path.join(dataDir, 'mybkc-config.json');
  }

  async init() {
    const data = await getJsonFromFile(this.configFilePath);
    if (data.currentProfile) {
      this.config = data as MyBKCConfigFile;
    } else {
      const profile = await this.newProfile();
      await this.setCurrentProfile(profile);
    }
  }

  async saveConfig() {
    await writeJsonToFile(this.configFilePath, this.config);
  }

  async getProfile(name: string) {
    let profile = this.config.profiles?.[name];
    if (!profile) profile = await this.newProfile();
    return profile;
  }

  async getCurrentProfile() {
    return this.getProfile(this.config.currentProfile);
  }

  async newProfile(): Promise<MyBKCProfile> {
    const name = await cli.prompt('Profile name?');
    const url = await cli.prompt('Url? (e.g. http://localhost:5000)');
    const email = await cli.prompt('Login email?');
    const password = await cli.prompt('Login password?', { type: 'hide' });
    const authCookie = await this.authenticate(url, email, password);

    return {
      name,
      url,
      authCookie,
    };
  }

  async removeProfile(name: string) {
    if (this.config.profiles?.[name]) {
      delete this.config.profiles?.[name];
      await this.saveConfig();
      return true;
    }
    return false;
  }

  async setCurrentProfile(profile: MyBKCProfile) {
    this.config.currentProfile = profile.name;
    this.config.profiles[profile.name] = profile;
    await this.saveConfig();
  }

  async authenticate(url: string, email: string, password: string): Promise<string> {
    const response = await fetch(`${url}/api/auth/login`, {
      method: 'post',
      body: JSON.stringify({ email, password }),
      headers: { 'Content-Type': 'application/json' },
    });
    // node-fetch allows raw access to the set-cookie header
    let authCookie;
    response.headers.raw()['set-cookie'].forEach((c: string) => {
      if (c.includes('Authorization=')) authCookie = c;
    });
    if (!authCookie) throw new Error('Could not authenticate!');
    return authCookie;
  }

  async makeRequest(url: string, options: FetchParams) {
    const profile = await this.getCurrentProfile();
    const reqOpts = {
      method: options.method,
      headers: {
        'Content-Type': 'application/json',
        Cookie: profile.authCookie,
      },
    } as any;
    if (options.data) reqOpts.body = JSON.stringify(options.data);
    return fetch(`${profile.url}${url}`, reqOpts);
  }
}
