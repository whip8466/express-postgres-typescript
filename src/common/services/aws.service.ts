import AWS from "aws-sdk";
import httpStatus from "http-status";

import ApiError from "../../utils/ApiError";

export default class AwsService {
  constructor() {}

  /**
   * File upload
   * @param {string} fileNameWithoutExtension
   * @returns {Promise<Object>}
   */
  static uploadFileInS3 = async (fileNameWithoutExtension: string, file: any) =>
    new Promise((resolve, reject) => {
      try {
        const s3 = new AWS.S3();

        const fileExtension = file?.name?.split(".").pop();
        const fileName = `${fileNameWithoutExtension}.${fileExtension}`;

        const fileContent = Buffer.from(file?.data, "binary");

        const params: any = {
          Bucket: process.env.BUCKET_NAME,
          Key: fileName,
          Body: fileContent
        };

        // Uploading files to the bucket
        s3.upload(params, (err: any, data: any) => {
          if (err) {
            throw err;
          }

          return resolve(data?.Location);
        });
      } catch (error: any) {
        return reject(new ApiError(httpStatus.BAD_REQUEST, error.message));
      }
    });
}
