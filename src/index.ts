/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

export const helloWorld = onRequest((request, response) => {
  logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});
/*
[정보] vscode 에서 TypeScript 직접 Run / Debug 하기
기왕 다 같이 배우는 입장인데 팁 좀 공유하고자 합니다.
vscode 에서 .ts 파일을 바로 실행/디버그 하는 팁입니다.

tsconfig.json 파일에
"sourceMap" : true;
옵션 추가하시어 .ts, .js 파일을 서로 매핑 시켜 줍니다.

Ctrl +<Shift> + b (빌드 단축키) 누르시면 [tsc:감시], [tsc: 빌드]  두가지 선택지가 뜨는데
감시 선택하셔서 작업영역 전체 .ts 파일에 watch 를 걸어 자동 빌드 시켜줍니다.
하단 터미널에 감시-tsconfig.json Task 가 보입니다.

빌드가 자동으로 되고 있으니,
작성하신 .ts 파일을 여신다음에
Ctrl +<Shift> + d (실행 디버그 창 열기) 하시어, run / debug 클릭하시면
vscode 에서 직접 .ts 파일을 실행하실 수 있습니다.
중단점도 먹습니다.

원리를 아는 건 가장 중요하지만, 시간도 못지 않게 중요하니까요.

같이 열공하십시다.
*/
