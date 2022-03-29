import type { JsonCodec } from 'src/_internal/Defines';

export type PageResultMap = (obj: any) => any;

export class ChatPageResult<T> implements JsonCodec {
  pageCount: number;
  data?: Array<T>;
  constructor(params: { pageCount: number; data?: Array<T> }) {
    this.pageCount = params.pageCount;
    this.data = params.data;
  }
  static fromJson(
    json: Map<string, any>,
    opt?: { map: PageResultMap }
  ): ChatPageResult<any> {
    let pageCount = json.get('count');
    let data = new Array<any>();
    (json.get('list') as Array<any>).forEach((element) => {
      data.push(opt ? opt.map(element) : element);
    });
    return new ChatPageResult({ pageCount, data });
  }
  toJson(): Map<string, any> {
    throw new Error('Method not implemented.');
  }
}
