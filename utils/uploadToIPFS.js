const { Buffer } = require('buffer');
const { Readable } = require('stream');
const { v4: uuidv4 } = require('uuid');
const pinataSDK = require('@pinata/sdk');

// upload to pinata
module.exports = async function (imageDataUrl) {
  const pinata = pinataSDK(
    process.env.PINATA_API_KEY,
    process.env.PINATA_SECRET_API_KEY
  );
  const imageData = imageDataUrl.replace(/^data:image\/png;base64,/, '');
  const imageBuffer = Buffer.from(imageData, 'base64');
  const stream = Readable.from(imageBuffer);
  stream.path = `${uuidv4()}.png`;

  const result = await pinata.pinFileToIPFS(stream, {});

  return 'ipfs://' + result.IpfsHash;
};
