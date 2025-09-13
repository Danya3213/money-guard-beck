import { ConfigService } from '@nestjs/config';

const HOST_URL = new ConfigService().get<string>('HOST_URL');
const PORT = new ConfigService().get<number>('PORT');

const LOCAL = `http://localhost:${PORT}`

export enum EnumModes {
  "DEV" = "DEV",
  "PROD" = "PROD",
  "TEST" = "TEST"
}

export const server_urls = {
  local: LOCAL,
  host: HOST_URL,
}