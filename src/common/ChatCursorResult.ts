import type { JsonCodec } from 'src/_internal/Defines';

export type CursorResultMap = (obj: any) => any;

export class ChatCursorResult<T> implements JsonCodec {
  cursor: string;
  data?: Array<T>;
  constructor(params: { cursor: string; data?: Array<T> }) {
    this.cursor = params.cursor;
    this.data = params.data;
  }
  static fromJson(
    json: Map<string, any>,
    opt?: { map: CursorResultMap }
  ): ChatCursorResult<any> {
    let cursor = json.get('cursor');
    let data = new Array<any>();
    (json.get('list') as Array<any>).forEach((element) => {
      data.push(opt ? opt.map(element) : element);
    });
    return new ChatCursorResult({ cursor, data });
  }
  toJson(): Map<string, any> {
    throw new Error('Method not implemented.');
  }
}
