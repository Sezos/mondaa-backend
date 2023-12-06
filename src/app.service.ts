import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello New World!';
  }

  async checkHealth(version: string) {
    if (!version) {
      return {
        success: false,
        message: 'Please provide version number to check.',
        code: -1,
      };
    }

    if (version !== process.env.APP_LATEST_VERSION) {
      return {
        success: true,
        message:
          'Your App is outdated. Please Update to Latest Version from Appstore or PlayStore',
        code: 0,
      };
    }

    return {
      success: true,
      message: 'Your App is up to date, and you are good to go',
      code: 1,
    };
  }
}
