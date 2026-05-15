/**
 * @file canvasModel.js
 * Plain data model holding all settings needed to render the canvas.
 */

/**
 * Stores the current state of the canvas rendering parameters and draws itself.
 */
export default class CanvasModel {
    constructor() {
        /** @type {HTMLImageElement|null} The image to draw on the canvas. */
        this.image = null;
        /** @type {string} */
        this.topText = '';
        /** @type {string} */
        this.bottomText = '';

        this.textColor = 'white';
        this.fontFamily = 'sans-serif';
        this.fontSize = 42;
        this.outlineColor = 'black';
        this.filter = 'none';
    }

    /**
     * Clears the canvas, draws the current image stretched to fill it, then
     * layers the top and bottom text on top.
     * @param {HTMLCanvasElement} canvasElement
     */
    render(canvasElement) {
        const ctx = canvasElement.getContext('2d');
        const { width, height } = canvasElement;

        ctx.clearRect(0, 0, width, height);

        if (this.image) {

    switch (this.filter) {
        case 'grayscale':
            ctx.filter = 'grayscale(100%)';
            break;

        case 'sepia':
            ctx.filter = 'sepia(100%)';
            break;

        case 'invert':
            ctx.filter = 'invert(100%)';
            break;

        case 'gaussian':
            ctx.filter = 'blur(4px)';
            break;

        default:
            ctx.filter = 'none';
    }

    ctx.drawImage(this.image, 0, 0, width, height);

    ctx.filter = 'none';
}

        this.#drawText(ctx, canvasElement);
    }

    /**
     * Draws top and bottom text onto the canvas with a stroked outline for legibility.
     * @param {CanvasRenderingContext2D} ctx
     * @param {HTMLCanvasElement} canvasElement
     */
    #drawText(ctx, canvasElement) {
        const fontSize = this.fontSize;
        ctx.font = `bold ${fontSize}px ${this.fontFamily}`;
        ctx.textAlign = 'center';
        ctx.fillStyle = this.textColor;
        ctx.strokeStyle = this.outlineColor;
        ctx.lineWidth = fontSize / 10;

        if (this.topText) {
            ctx.fillText(this.topText, canvasElement.width / 2, fontSize);
            ctx.strokeText(this.topText, canvasElement.width / 2, fontSize);
        }
        if (this.bottomText) {
            ctx.fillText(this.bottomText, canvasElement.width / 2, canvasElement.height - fontSize / 4);
            ctx.strokeText(this.bottomText, canvasElement.width / 2, canvasElement.height - fontSize / 4);
        }
    }
}
