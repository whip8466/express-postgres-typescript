import { Request } from "express";
import {
  CONTENT_LANGUAGE,
  DEFAULT_CONTENT_LANGUAGE
} from "../config/constants";

export const getContentLanguage = (request: Request): string => {
  const { headers } = request;
  return headers[CONTENT_LANGUAGE] || DEFAULT_CONTENT_LANGUAGE;
};
