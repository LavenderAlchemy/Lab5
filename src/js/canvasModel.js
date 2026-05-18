/**
 * @file canvasModel.js
 * Plain data model holding all settings needed to render the canvas.
 */

/**
 * Stores the current state of the canvas rendering parameters and draws itself.
 */
export default class CanvasModel {
    constructor() {
        this.image = null;

        this.topText = '';
        this.bottomText = '';

        this.textColor = '#ffffff';
        this.fontFamily = 'sans-serif';
        this.fontSize = 42;
        this.outlineColor = 'black';
        this.filter = 'none';

        this.zoom = 1;
        this.imageOffsetX = 0;
        this.imageOffsetY = 0;

        this.stickers = [];
        this.previewSticker = null;
    }

    /**
     * Clears and redraws the whole canvas.
     * @param {HTMLCanvasElement} canvasElement
     */
    render(canvasElement) {
        const ctx = canvasElement.getContext('2d');
        const { width, height } = canvasElement;

        ctx.clearRect(0, 0, width, height);

        ctx.save();

        // Oval profile frame clipping for Group B
        ctx.beginPath();
        ctx.ellipse(width / 2, height / 2, width * 0.42, height * 0.48, 0, 0, Math.PI * 2);
        ctx.clip();

        this.#drawImage(ctx, width, height);

        ctx.restore();

        this.#drawFrame(ctx, width, height);
        this.#drawStickers(ctx);
        this.#drawPreviewSticker(ctx);
        this.#drawText(ctx, canvasElement);
    }

    /**
     * Draws the selected image with zoom and offset.
     */
    #drawImage(ctx, width, height) {
    if (!this.image) {
        return;
    }

    ctx.filter = this.#getCanvasFilter();

    const imageRatio = this.image.naturalWidth / this.image.naturalHeight;
    const canvasRatio = width / height;

    let baseWidth;
    let baseHeight;

    if (imageRatio > canvasRatio) {
        baseHeight = height;
        baseWidth = height * imageRatio;
    } else {
        baseWidth = width;
        baseHeight = width / imageRatio;
    }

    const drawWidth = baseWidth * this.zoom;
    const drawHeight = baseHeight * this.zoom;
    const drawX = (width - drawWidth) / 2 + this.imageOffsetX;
    const drawY = (height - drawHeight) / 2 + this.imageOffsetY;

    ctx.drawImage(this.image, drawX, drawY, drawWidth, drawHeight);

    ctx.filter = 'none';
}

    /**
     * Converts the selected filter option into a canvas filter string.
     */
    #getCanvasFilter() {
        switch (this.filter) {
            case 'grayscale':
                return 'grayscale(100%)';
            case 'sepia':
                return 'sepia(100%)';
            case 'invert':
                return 'invert(100%)';
            case 'gaussian':
                return 'blur(4px)';
            case 'sharpen':
                return 'contrast(140%)';
            case 'noise':
                return 'saturate(180%)';
            default:
                return 'none';
        }
    }

    /**
     * Draws the oval border around the profile image.
     */
    #drawFrame(ctx, width, height) {
        ctx.save();

        ctx.beginPath();
        ctx.ellipse(width / 2, height / 2, width * 0.42, height * 0.48, 0, 0, Math.PI * 2);

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 8;
        ctx.stroke();

        ctx.restore();
    }

    /**
     * Draws all placed stickers.
     */
    #drawStickers(ctx) {
        ctx.save();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = '42px sans-serif';

        for (const sticker of this.stickers) {
            ctx.fillText(sticker.text, sticker.x, sticker.y);
        }

        ctx.restore();
    }

    /**
     * Draws the sticker that follows the mouse before being placed.
     */
    #drawPreviewSticker(ctx) {
        if (!this.previewSticker) {
            return;
        }

        ctx.save();
        ctx.globalAlpha = 0.7;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = '42px sans-serif';
        ctx.fillText(this.previewSticker.text, this.previewSticker.x, this.previewSticker.y);
        ctx.restore();
    }

    /**
     * Draws top and bottom text onto the canvas.
     */
    #drawText(ctx, canvasElement) {
        const fontSize = Number(this.fontSize);

        ctx.save();

        ctx.font = `bold ${fontSize}px ${this.fontFamily}`;
        ctx.textAlign = 'center';
        ctx.fillStyle = this.textColor;
        ctx.strokeStyle = this.outlineColor;
        ctx.lineWidth = fontSize / 10;

        if (this.topText) {
            this.#drawOutlinedText(ctx, this.topText, canvasElement.width / 2, fontSize + 10);
        }

        if (this.bottomText) {
            this.#drawOutlinedText(
                ctx,
                this.bottomText,
                canvasElement.width / 2,
                canvasElement.height - fontSize / 3
            );
        }

        ctx.restore();
    }

    /**
     * Draws filled text with optional outline.
     */
    #drawOutlinedText(ctx, text, x, y) {
        if (this.outlineColor !== 'none') {
            ctx.strokeText(text, x, y);
        }

        ctx.fillText(text, x, y);
    }

    /**
     * Returns simple data that can be saved to localStorage.
     */
    toStorageObject() {
        return {
            topText: this.topText,
            bottomText: this.bottomText,
            textColor: this.textColor,
            fontFamily: this.fontFamily,
            fontSize: this.fontSize,
            outlineColor: this.outlineColor,
            filter: this.filter,
            zoom: this.zoom,
            imageOffsetX: this.imageOffsetX,
            imageOffsetY: this.imageOffsetY,
            stickers: this.stickers
        };
    }

    /**
     * Loads saved settings from localStorage data.
     */
    loadFromStorageObject(savedData) {
        if (!savedData) {
            return;
        }

        this.topText = savedData.topText || '';
        this.bottomText = savedData.bottomText || '';
        this.textColor = savedData.textColor || '#ffffff';
        this.fontFamily = savedData.fontFamily || 'sans-serif';
        this.fontSize = savedData.fontSize || 42;
        this.outlineColor = savedData.outlineColor || 'black';
        this.filter = savedData.filter || 'none';
        this.zoom = savedData.zoom || 1;
        this.imageOffsetX = savedData.imageOffsetX || 0;
        this.imageOffsetY = savedData.imageOffsetY || 0;
        this.stickers = savedData.stickers || [];
    }
}