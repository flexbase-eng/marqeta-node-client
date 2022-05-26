'use strict'

import type {
  Marqeta,
  MarqetaError,
  MarqetaOptions,
} from './'

export interface CommandoMode {
  token: string;
  programGatewayFundingSourceToken: string;
  currentState: {
    commandoEnabled: boolean;
    reason: string;
    channel: string;
  };
  commandoModeEnables: {
    programFundingSource: string;
    velocityControls: string[];
  };
  createdTime: string;
  lastModifiedTime: string;
}

export interface CommandoModeList {
  count: bigint;
  startIndex: bigint;
  endIndex: bigint;
  isMore: boolean;
  data: CommandoMode[];
}

export class CommandoModeApi {
  client: Marqeta;

  constructor(client: Marqeta, _options?: MarqetaOptions) {
    this.client = client
  }

  /*
   * Function to take a list of optional Commando Mode arguments, send those to
   * Marqeta, and have a list of Commando Modes returned to the caller.
   */
  async list(options: {
    count?: number,
    startIndex?: number,
    sortBy?: string,
  } = {}): Promise<{
    success: boolean,
    commandoModes?: CommandoModeList,
    error?: MarqetaError,
  }> {
    const resp = await this.client.fire('GET',
      'commandomodes',
      options
    )
    // catch any errors...
    if (resp?.payload?.errorCode) {
      return {
        success: false,
        error: {
          type: 'marqeta',
          error: resp?.payload?.errorMessage,
          status: resp?.payload?.errorCode,
        },
      }
    }
    return { success: !resp?.payload?.errorCode, commandoModes: { ...resp.payload } }
  }
}
