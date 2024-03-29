import path = require('path');
import {CliUx} from '@oclif/core';
import axios from 'axios';
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
    const name = await CliUx.ux.prompt('Profile name?');
    const url = await CliUx.ux.prompt('Url? (e.g. http://localhost:5000)');
    const email = await CliUx.ux.prompt('Login email?');
    const password = await CliUx.ux.prompt('Login password?', { type: 'hide' });
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
    const response = await axios({
      url: `${url}/api/auth/login`,
      method: 'post',
      data: { email, password },
      headers: { 'Content-Type': 'application/json' },
    });
    let authCookie;
    response.headers['set-cookie']?.forEach((c: string) => {
      if (c.includes('Authorization=')) authCookie = c;
    });
    if (!authCookie) throw new Error('Could not authenticate!');
    return authCookie;
  }

  async makeRequest(url: string, options: FetchParams) {
    const profile = await this.getCurrentProfile();
    const reqOpts = {
      url: `${profile.url}${url}`,
      method: options.method,
      headers: {
        'Content-Type': 'application/json',
        Cookie: profile.authCookie,
      },
    } as any;
    if (options.data) reqOpts.body = JSON.stringify(options.data);
    return axios(reqOpts);
  }
}
