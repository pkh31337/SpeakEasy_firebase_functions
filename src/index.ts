// https://github.com/firebase/functions-samples/blob/main/Node/quickstarts/thumbnails/functions/index.js
/**
 * Copyright 2022 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
"use strict";

// [START v2storageImports]
// [START v2storageSDKImport]
import {onObjectFinalized} from "firebase-functions/v2/storage";
// [END v2storageSDKImport]

// [START v2storageAdditionalImports]
import {initializeApp} from "firebase-admin/app";
import {getStorage} from "firebase-admin/storage";
import logger = require("firebase-functions/logger");
import path = require("path");

// library for image resizing
import sharp = require("sharp");


initializeApp();
// [END v2storageAdditionalImports]
// [END v2storageImports]

// [START v2storageGenerateThumbnail]
/**
 * When an image is uploaded in the Storage bucket,
 * generate a thumbnail automatically using sharp.
 */
// [START v2storageGenerateThumbnailTrigger]
exports.generateThumbnail = onObjectFinalized({cpu: 2, region: "asia-northeast3"}, async (event) => {
// [END v2storageGenerateThumbnailTrigger]

  // [START v2storageEventAttributes]
  const fileBucket = event.data.bucket; // Storage bucket containing the file.
  const filePath = event.data.name; // File path in the bucket.
  const contentType = event.data.contentType; // File content type.
  // [END v2storageEventAttributes]

  // [START v2storageStopConditions]
  // Exit if this is triggered on a file that is not an image.
  if (contentType == null || !contentType.startsWith("image/")) {
    return logger.log("This is not an image.");
  }
  // Exit if the image is already a thumbnail.
  // 파일 확장자를 포함한 전체 파일명
  const fileName = path.basename(filePath);
  // 파일 확장자
  const fileExtension = path.extname(filePath);
  // 확장자를 제외한 파일명
  const fileNameWithoutExtension = path.basename(fileName, fileExtension);


  
  // 파일명의 끝부분이 "_thumb"로 끝나는지 검사
  if (fileNameWithoutExtension.endsWith("_thumb")) {
    return logger.log("Already a Thumbnail.");
  }
  // [END v2storageStopConditions]

  // [START v2storageThumbnailGeneration]
  // Download file into memory from bucket.
  const bucket = getStorage().bucket(fileBucket);
  const downloadResponse = await bucket.file(filePath).download();
  const imageBuffer = downloadResponse[0];
  logger.log("Image downloaded!");

  // Generate a thumbnail using sharp.
  const thumbnailBuffer = await sharp(imageBuffer).resize({
    width: 200,
    height: 200,
    withoutEnlargement: true,
  }).toBuffer();
  logger.log("Thumbnail created");

  // Prefix 'thumb_' to file name.
  // const thumbFileName = `thumb_${fileName}`;
  // const thumbFilePath = path.join(path.dirname(filePath), thumbFileName);

  // 파일명의 끝에 "_thumb" 추가 후 확장자명 다시 붙임
  const thumbFileName = `${fileNameWithoutExtension}_thumb${fileExtension}`;
  const thumbFilePath = path.join(path.dirname(filePath), thumbFileName);

  // Upload the thumbnail.
  const metadata = {contentType: contentType};
  await bucket.file(thumbFilePath).save(thumbnailBuffer, {
    metadata: metadata,
  });
  return logger.log("Thumbnail uploaded!");
  // [END v2storageThumbnailGeneration]
});
// [END v2storageGenerateThumbnail]


/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// import {onRequest} from "firebase-functions/v2/https";
// import * as logger from "firebase-functions/logger";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//  logger.info("Hello logs!", {structuredData: true});
//  response.send("Hello from Firebase!");
// });
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
