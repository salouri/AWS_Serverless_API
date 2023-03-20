import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import createHttpError from 'http-errors';

/*
 * Uploads a picture to S3
 * @param {string} key - the key of the picture
 * @param {string} body - the body of the picture
 * @returns {Promise} - the url of the picture
 */
export async function uploadPictureToS3(key, body) {
  // upload the picture to S3 using sdk v3
  const REGION = process.env.AWS_REGION;
  const s3 = new S3Client({ region: REGION });
  const params = {
    Bucket: process.env.AUCTIONS_BUCKET_NAME,
    Key: key,
    Body: body,
    ContentType: 'image/jpeg',
    ContentEncoding: 'base64',
  };

  let imageLocation;
  try {
    const result = await s3.send(new PutObjectCommand(params));
    if (result.$metadata.httpStatusCode !== 200) {
      throw new createHttpError.InternalServerError('Error uploading picture to S3');
    }
    imageLocation = `https://${process.env.AUCTIONS_BUCKET_NAME}.s3.${REGION}.amazonaws.com/${key}`;
  } catch (error) {
    throw new createHttpError.InternalServerError(error);
  }
  return imageLocation;
}
