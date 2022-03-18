import {
  VideoDimensions,
  MethodTypeonMessagesReceived,
} from './_internal/Consts';

// import type { RtcStats } from "./_internal/Defines";

function test1(params:VideoDimensions) {
  params.height;
  params.width;
  let ss = MethodTypeonMessagesReceived;
}

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
