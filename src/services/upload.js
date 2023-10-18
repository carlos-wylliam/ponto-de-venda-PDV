const aws = require("aws-sdk");

const endpoint = new aws.Endpoint(process.env.ENDPOINT_BACKBLAZE);

const s3 = new aws.S3({
  endpoint,
  credentials: {
    accessKeyId: process.env.KEY_ID,
    secretAccessKey: process.env.APP_KEY,
  },
});

const uploadImage = async (path, buffer, mimeType) => {
  const imagem = await s3
    .upload({
      Bucket: process.env.BUCKET_NAME,
      Key: path,
      Body: buffer,
      ContentType: mimeType,
    })
    .promise();

  return {
    path: imagem.Key,
    url: `https://${process.env.BUCKET_NAME}.${process.env.ENDPOINT_BACKBLAZE}/${imagem.Key}`,
  };
};

const deleteImage = async (path, deleteFolder) => {
  await s3
    .deleteObject({
      Bucket: process.env.BUCKET_NAME,
      Key: path,
    })
    .promise();

  if (deleteFolder) {
    const lastSlashIndex = path.lastIndexOf("/");
    folderPath = path.substring(0, lastSlashIndex);

    await s3
      .deleteObject({
        Bucket: process.env.BUCKET_NAME,
        Key: path,
      })
      .promise();
  }
};

module.exports = {
  uploadImage,
  deleteImage,
};
