import SessionExporter from '@flapjs/session/helper/SessionExporter.js';

import { TinyColor } from '@ctrl/tinycolor';

import { FileJPEGIcon, FilePNGIcon, FileSVGIcon } from '@flapjs/components/icons/Icons.js';

export const IMAGE_TYPE_PNG = 'png';
export const IMAGE_TYPE_JPG = 'jpg';
export const IMAGE_TYPE_SVG = 'svg';
export const IMAGE_TYPE_BW = 'bw';

const EXPORT_PADDING_X = 30;
const EXPORT_PADDING_Y = 0;

class NodalGraphImageExporter extends SessionExporter
{
    constructor(imageType, iconClass, label, title)
    {
        super();
        this._imageType = imageType;
        this._iconClass = iconClass;
        this._label = label;
        this._title = title;
    }

    /** @override */
    exportTarget(exportType, target)
    {
        const session = target;
        const fileName = session.sessionName;
        const svgElement = session.viewController.getViewportAdapter().getElement();
        const workspaceDim = svgElement.viewBox.baseVal;
        const width = workspaceDim.width;
        const height = workspaceDim.height;
        const svg = this.processSVGForExport(svgElement, width, height, session);

        const fileExt = this._imageType === IMAGE_TYPE_BW ? IMAGE_TYPE_PNG : this._imageType;
        return Promise.resolve({
            name: fileName + '.' + fileExt,
            type: 'image',
            data: svg,
            width: width,
            height: height,
            'image-type': fileExt
        });
    }

    //TODO: We need access to a style map
    processColorAttribute(themeManager, attributeValue)
    {
        if (!attributeValue) return attributeValue;

        const startIndex = attributeValue.indexOf('var(--');
        if (startIndex < 0) return attributeValue;

        const stopIndex = attributeValue.indexOf(')', startIndex);
        const value = attributeValue.substring(startIndex + 4, stopIndex);
        const style = themeManager.getStyleByName(value);
        let result = style ? style.getValue() : '#000000';

        if (this._imageType === IMAGE_TYPE_BW)
        {
            result = new TinyColor(result).desaturate().toHexString();
        }

        return result;
    }

    processSVGForExport(element, width, height, session)
    {
        const graphController = session.graphService.graphController;

        const viewport = session.viewController.getViewportAdapter();
        const offsetX = viewport.getOffsetX();
        const offsetY = viewport.getOffsetY();
        const bounds = graphController.getGraph().getBoundingRect();
        const dx = bounds.minX + offsetX - EXPORT_PADDING_X;
        const dy = bounds.minY + offsetY - EXPORT_PADDING_Y;
        const w = bounds.width + EXPORT_PADDING_X * 2;
        const h = bounds.height + EXPORT_PADDING_Y * 2;
        const clone = element.cloneNode(true);
        clone.setAttribute('viewBox', dx + ' ' + dy + ' ' + w + ' ' + h);
        clone.setAttribute('width', width);
        clone.setAttribute('height', height);

        // Apply the workspace font (refer to Workspace.css)
        clone.setAttribute('font-size', '16px');
        clone.setAttribute('font-family', 'monospace');
        clone.setAttribute('style', '.graph-ui {display: none;}');

        // Go through and replace all colors...
        /*
        const themeManager = currentModule.getApp().getThemeManager();
        for (const element of clone.getElementsByTagName('*'))
        {
            const strokeValue = element.getAttribute('stroke');
            const strokeResult = this.processColorAttribute(themeManager, strokeValue);
            if (strokeValue !== strokeResult) element.setAttribute('stroke', strokeResult);

            const fillValue = element.getAttribute('fill');
            const fillResult = this.processColorAttribute(themeManager, fillValue);
            if (fillValue !== fillResult) element.setAttribute('fill', fillResult);
        }
        */

        //Remove unwanted ui elements from image
        const uiElements = clone.getElementsByClassName('graph-ui');
        while (uiElements.length > 0)
        {
            // This will propagate changes to uiElements, so be careful
            const e = uiElements[0];
            e.remove();
        }

        return clone;
    }

    /** @override */
    getIconClass()
    {
        return this._iconClass;
    }

    /** @override */
    getLabel()
    {
        return this._label;
    }

    /** @override */
    getTitle()
    {
        return this._title;
    }

    getImageType()
    {
        return this._imageType;
    }
}

export const IMAGE_EXPORTERS = {
    ['image-' + IMAGE_TYPE_PNG]: new NodalGraphImageExporter(IMAGE_TYPE_PNG, FilePNGIcon, 'file.export.png', 'file.export.png.hint'),
    ['image-' + IMAGE_TYPE_JPG]: new NodalGraphImageExporter(IMAGE_TYPE_JPG, FileJPEGIcon, 'file.export.jpg', 'file.export.jpg.hint'),
    ['image-' + IMAGE_TYPE_SVG]: new NodalGraphImageExporter(IMAGE_TYPE_SVG, FileSVGIcon, 'file.export.svg', 'file.export.svg.hint'),
    ['image-' + IMAGE_TYPE_BW]: new NodalGraphImageExporter(IMAGE_TYPE_BW, FilePNGIcon, 'file.export.bw', 'file.export.bw.hint'),
};

export default NodalGraphImageExporter;
