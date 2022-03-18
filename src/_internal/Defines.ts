/**
 * Interface, Class, etc.
 */

export interface Codec {}

export interface JsonCodec extends Codec {
  fromJson(json: string): Map<string, any>;
  toJson(): string;
}
