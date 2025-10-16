import { Request } from "express";
import { Readable } from "stream";

export interface DecodedRequest extends Request {
  decodedStream: Readable;
}
