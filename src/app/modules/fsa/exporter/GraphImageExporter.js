import AbstractGraphExporter from './AbstractGraphExporter.js';

import PNGIcon from 'deprecated/icons/flat/PNGIcon.js';
import JPGIcon from 'deprecated/icons/flat/JPGIcon.js';
// import XMLIcon from 'deprecated/icons/flat/XMLIcon.js';
import SVGIcon from 'deprecated/icons/flat/SVGIcon.js';
import { FILE_TYPE_PNG, FILE_TYPE_JPG, FILE_TYPE_SVG, downloadImageFromSVG } from 'util/Downloader.js';

const EXPORT_PADDING_X = 30;
const EXPORT_PADDING_Y = 0;

class GraphImageExporter extends AbstractGraphExporter
{
    constructor(imageType = FILE_TYPE_PNG)
    {
        super();
        this._imageType = imageType;
    }

    processSVGForExport(element, width, height, currentModule)
    {
        const inputController = currentModule.getInputController();
        const graphController = currentModule.getGraphController();

        const viewport = inputController.getInputAdapter().getViewportAdapter();
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

        //Apply the workspace font (refer to Workspace.css)
        clone.setAttribute('font-size', '16px');
        clone.setAttribute('font-family', 'monospace');
        clone.setAttribute('style', '.graph-ui {display: none;}');

        /*

        const nodeColor = styleOpts.getOptionByProp("--color-graph-node").getStyle();
        const textColor = styleOpts.getOptionByProp("--color-graph-text").getStyle();
        console.log(nodeColor);
        const styleString = "* {"
        + "--color-graph-node: blue;"
        + "--color-graph-text: " + textColor + ";"
        + "}";

        */

        /*
        //TODO: Link the font family to svg
        const link = document.createElement("link");
        link.setAttribute("rel", "stylesheet");
        clone.appendChild(link);
        */

        //Remove unwanted ui elements from image
        const uiElements = clone.getElementsByClassName('graph-ui');
        while (uiElements.length > 0)
        {
            const e = uiElements[0];
            e.remove();//This will propagate changes to uiElements, so be careful
        }

        return clone;
    }

    /** @override */
    exportToFile(filename, module)
    {
        const workspace = module.getApp().getWorkspaceComponent();
        const workspaceDim = workspace.ref.viewBox.baseVal;
        const width = workspaceDim.width;
        const height = workspaceDim.height;
        const svg = this.processSVGForExport(workspace.ref, width, height, module);

        downloadImageFromSVG(filename, this._imageType, svg, width, height);
    }

    /** @override */
    doesSupportFile()
    {
        return true;
    }

    /** @override */
    canImport(module)
    {
        return false;
    }

    /** @override */
    getTitle()
    {
        switch (this._imageType)
        {
            case FILE_TYPE_PNG: return I18N.toString('file.export.png.hint');
            case FILE_TYPE_JPG: return I18N.toString('file.export.jpg.hint');
            case FILE_TYPE_SVG: return I18N.toString('file.export.svg.hint');
            default: return super.getTitle();
        }
    }

    /** @override */
    getLabel()
    {
        switch (this._imageType)
        {
            case FILE_TYPE_PNG: return I18N.toString('file.export.png');
            case FILE_TYPE_JPG: return I18N.toString('file.export.jpg');
            case FILE_TYPE_SVG: return I18N.toString('file.export.svg');
            default: return super.getLabel();
        }
    }

    /** @override */
    getFileType()
    {
        return this._imageType;
    }

    /** @override */
    getIconClass()
    {
        switch (this._imageType)
        {
            case FILE_TYPE_PNG: return PNGIcon;
            case FILE_TYPE_JPG: return JPGIcon;
            case FILE_TYPE_SVG: return SVGIcon;
            default: return null;
        }
    }
}

export default GraphImageExporter;
