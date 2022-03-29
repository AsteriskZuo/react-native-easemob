export interface Codec {}

export class JsonCodec implements Codec {
  static fromJson(json: Map<string, any>): JsonCodec {
    throw new Error('You need a subclass implementation.');
  }
  toJson(): Map<string, any> {
    throw new Error('You need a subclass implementation.');
  }
}
