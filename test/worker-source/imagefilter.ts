import { ColorIn } from 'colorin'

const colors = [
  [0, '#226412'],
  [1000, '#B9E287'],
  [2000, '#E7F5D1'],
  [3000, '#F7F7F7'],
  [3500, '#80BD3F'],
  [4000, '#226412'],
  [4500, '#4C931B'],
  [5000, '#80BD3F'],
  [6000, '#F1B7DB'],
  [7000, '#DF78AF'],
  [8000, '#C6147E'],
  [9000, '#8F0051'],
]

const ci = new ColorIn(colors)

const canvas = new OffscreenCanvas(1, 1)
const TILESIZE = 256

export const initialize = function () {
  console.log('tileimagebitmap init')
}

export const onmessage = function (msg, postResponse) {
  ci.getColor(45)
  const url = msg.data.url
  canvas.width = TILESIZE
  canvas.height = TILESIZE
  const ctx = canvas.getContext('2d') as OffscreenCanvasRenderingContext2D
  // const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  //fetch image
  fetch(url)
    .then((res) => res.arrayBuffer())
    .then((arrayBuffer) => {
      const blob = new Blob([arrayBuffer])
      createImageBitmap(blob).then((bitmap) => {
        ctx.filter = 'sepia(100%) invert(90%)'
        ctx.drawImage(bitmap, 0, 0)
        const image = canvas.transferToImageBitmap()
        postResponse(null, { image }, [image])
      })
    })
    .catch((error) => {
      const image = canvas.transferToImageBitmap()
      postResponse(null, { image }, [image])
    })
}
