import {
  MethodTypeonMessagesReceived,
} from './_internal/Consts';

// import type { RtcStats } from "./_internal/Defines";

// function test1(params:VideoDimensions) {
//   params.height;
//   params.width;
//   let ss = MethodTypeonMessagesReceived;
// }

// function test2(params:RtcStats) {
//   params.ddd.set("1", "string");
//   params.ddd.set("1", 2);
//   let sub2 = new Map<string, any>();
//   sub2.set("sub", "more");
//   params.ddd.set("1", sub2);
// }

type Rate = 1 | 2 | 3 | 4 | 5;

function test3(params:Rate) {
  let v1:Rate = 5;
}

function test4(opt: {p1: string, p2:string}, p3: string): void {
  let v3 = opt.p2;
}
//https://blog.csdn.net/lee727n/article/details/107407593?spm=1001.2101.3001.6650.1&utm_medium=distribute.pc_relevant.none-task-blog-2%7Edefault%7ECTRLIST%7ERate-1.pc_relevant_default&depth_1-utm_source=distribute.pc_relevant.none-task-blog-2%7Edefault%7ECTRLIST%7ERate-1.pc_relevant_default&utm_relevant_index=2
function test6(p1: string , p2: string = '', p3?: string): void {

}

function test7(params:{p1?: string, p2: string, p3?: string}) : void  {
  console.log('%s', params.p1);
}


function test5() {
  // test4(, '2');
//   test4({
//   p2: '4',
//   p1: ''
// }, 'p3');
  // test4({p1:'3'});
  // test6('');
  test7({p1: 'p1', p2: 'p2'});
}

// class TestClass {
//   p1: string;
//    p2: string = '';
//     p3: string;
//   constructor() {

//   }
// }
// function p1(arg0: string, p1: any) {
//   throw new Error('Function not implemented.');
// }


interface TestMessage {
  msgId: string;
  time: number;
  getMsgId(): number;
}

class TestMessageImpl implements TestMessage {
  constructor() {
    this.msgId = '';
    this.time = Date.now();
  }
  msgId: string;
  time: number;
  getMsgId(): number {
    throw new Error('Method not implemented.');
  }
}

interface TestClient {
  sendMessage(data: string): void;
}
function getInstance(): TestClient {
  return new TestClientImpl();
}
class TestClientImpl implements TestClient {
  constructor() {

  }
  sendMessage(data: string): void {
    throw new Error('Method not implemented.');
  }
}
