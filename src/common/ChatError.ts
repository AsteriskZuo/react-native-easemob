import type { JsonCodec } from '../_internal/Defines';

export class ChatError implements JsonCodec {
  code: number;
  description: string;

  constructor(code: number, description: string) {
    this.code = code;
    this.description = description;
  }
  static fromJson(json: Map<string, any>): ChatError {
    let code = json.get('code');
    let description = json.get('description');
    return new ChatError(code, description);
  }
  toJson(): Map<string, any> {
    let r = new Map<string, any>();
    r.set('code', this.code);
    r.set('description', this.description);
    return r;
  }
}
