const path = require('path');
const { createCanvas, loadImage } = require('canvas');

// generate nft avatar
module.exports = async function (pfp, enableLaser) {
  const canvas = createCanvas(600, 600);
  const ctx = canvas.getContext('2d');

  ctx.clearRect(0, 0, 600, 600);
  ctx.beginPath();
  ctx.rect(0, 0, 600, 600);
  ctx.fillStyle = '#fff';
  ctx.fill();

  let images = ['/traits/Lian.jpg'];
  Object.keys(pfp).forEach((pfpKey) => {
    if (pfp[pfpKey]) {
      images.push(`/traits/${pfpKey}/${pfp[pfpKey]}.png`);
    }
  });

  // always move Faxing to the end
  images.push(
    images.splice(
      images.findIndex((img) => img.includes('Faxing')),
      1
    )[0]
  );

  images = images.map((image) => {
    return path.join(__dirname, '../public' + image);
  });

  // add laser
  if (enableLaser) {
    images.push(`/traits/Jiguangyan/Jiguangyan.png`);
  }

  const imagesObj = await Promise.all(images.map(loadImage));

  imagesObj.forEach((image) => {
    ctx.drawImage(image, 0, 0);
  });

  return canvas.toDataURL('image/png');
};
