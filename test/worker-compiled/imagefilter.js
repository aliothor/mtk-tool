export default function (exports) { 

    let canvas$1;
    const OPTIONS = {
        width: 100,
        height: 10
    };
    // const ISNODE = typeof global === 'object';
    let offscreenCanvas = false;
    try {
        const canvas = new OffscreenCanvas(1, 1);
        const ctx = canvas.getContext('2d');
        ctx.fillText('hello', 0, 0);
        offscreenCanvas = true;
    } catch (err) {
        offscreenCanvas = false;
    }
    function getCanvas() {
        if (!canvas$1) {
            const { width, height } = OPTIONS;
            if (offscreenCanvas) {
                canvas$1 = new OffscreenCanvas(width, height);
            } else {
                canvas$1 = document.createElement('canvas');
                canvas$1.width = width;
                canvas$1.height = height;
            }
        }
        return canvas$1;
    }
    class ColorIn {
        constructor(colors, options = {}){
            if (!Array.isArray(colors)) {
                console.error('colors is not array');
                return;
            }
            if (colors.length < 2) {
                console.error('colors.length should >1');
                return;
            }
            this.colors = colors;
            let min = Infinity, max = -Infinity;
            for(let i = 0, len = colors.length; i < len; i++){
                const value = colors[i][0];
                min = Math.min(value, min);
                max = Math.max(value, max);
            }
            this.min = min;
            this.max = max;
            this.valueOffset = this.max - this.min;
            this.options = Object.assign({}, OPTIONS, options);
            this._initImgData();
        }
        getImageData() {
            return this.imgData;
        }
        _initImgData() {
            const canvas = getCanvas();
            const { width, height } = this.options;
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
            const { colors, valueOffset } = this;
            for(let i = 0, len = colors.length; i < len; i++){
                const [stop, color] = colors[i];
                const s = (stop - this.min) / valueOffset;
                gradient.addColorStop(s, color);
            }
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            this.imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        }
        getColor(stop) {
            stop = Math.max(this.min, stop);
            stop = Math.min(stop, this.max);
            const s = (stop - this.min) / this.valueOffset;
            let x = Math.round(s * this.imgData.width);
            x = Math.min(x, this.imgData.width - 1);
            const idx = x * 4;
            const r = this.imgData.data[idx];
            const g = this.imgData.data[idx + 1];
            const b = this.imgData.data[idx + 2];
            const a = this.imgData.data[idx + 3];
            return [
                r,
                g,
                b,
                a
            ];
        }
    }

    const colors = [
        [
            0,
            '#226412'
        ],
        [
            1000,
            '#B9E287'
        ],
        [
            2000,
            '#E7F5D1'
        ],
        [
            3000,
            '#F7F7F7'
        ],
        [
            3500,
            '#80BD3F'
        ],
        [
            4000,
            '#226412'
        ],
        [
            4500,
            '#4C931B'
        ],
        [
            5000,
            '#80BD3F'
        ],
        [
            6000,
            '#F1B7DB'
        ],
        [
            7000,
            '#DF78AF'
        ],
        [
            8000,
            '#C6147E'
        ],
        [
            9000,
            '#8F0051'
        ]
    ];
    const ci = new ColorIn(colors);
    const canvas = new OffscreenCanvas(1, 1);
    const TILESIZE = 256;
    const initialize = function() {
        console.log('tileimagebitmap init');
    };
    const onmessage = function(msg, postResponse) {
        ci.getColor(45);
        const url = msg.data.url;
        canvas.width = TILESIZE;
        canvas.height = TILESIZE;
        const ctx = canvas.getContext('2d');
        // const ctx = canvas.getContext('2d')
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        //fetch image
        fetch(url).then((res)=>res.arrayBuffer()).then((arrayBuffer)=>{
            const blob = new Blob([
                arrayBuffer
            ]);
            createImageBitmap(blob).then((bitmap)=>{
                ctx.filter = 'sepia(100%) invert(90%)';
                ctx.drawImage(bitmap, 0, 0);
                const image = canvas.transferToImageBitmap();
                postResponse(null, {
                    image
                }, [
                    image
                ]);
            });
        }).catch((error)=>{
            const image = canvas.transferToImageBitmap();
            postResponse(null, {
                image
            }, [
                image
            ]);
        });
    };

    exports.initialize = initialize;
    exports.onmessage = onmessage;

}