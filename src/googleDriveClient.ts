import { google } from "googleapis";
import { validateError } from "@src/utils";

// https://github.com/googleapis/nodejs-storage/issues/1883
// const getDriveClient = () => {
// 	const auth = new google.auth.GoogleAuth({
// 		keyFile: "../eLearningStorage.json",
// 		scopes: ["https://www.googleapis.com/auth/cloud-platform"],
// 	});
// 	const driveClient = google.drive({ version: "v3", auth });
// 	return driveClient;
// };
//
// export const uploadFile = async (file: File, driveClient = getDriveClient()) => {
// 	try {
// 		const res = await driveClient.files.create({
// 			requestBody: {
// 				name: file.name,
// 				mimeType: file.type,
// 			},
// 			media: {
// 				mimeType: file.type,
// 				body: file.stream(),
// 			},
// 		});
// 		console.log(res.data);
// 	} catch (error) {
// 		const validatedError = validateError(error);
// 		console.log(validatedError);
// 	}
// };
