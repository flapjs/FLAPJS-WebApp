import SessionExporter from 'session/SessionExporter.js';

import PNGIcon from 'deprecated/icons/flat/PNGIcon.js';
import JPGIcon from 'deprecated/icons/flat/JPGIcon.js';
import SVGIcon from 'deprecated/icons/flat/SVGIcon.js';

export const IMAGE_TYPE_PNG = 'png';
export const IMAGE_TYPE_JPG = 'jpg';
export const IMAGE_TYPE_SVG = 'svg';

const EXPORT_PADDING_X = 30;
const EXPORT_PADDING_Y = 0;

class NodalGraphImageExporter extends SessionExporter
{
    constructor(imageType=IMAGE_TYPE_PNG)
    {
        super();
        this._imageType = imageType;
    }

    /** @override */
    exportTarget(exportType, target)
    {
        const session = target;
        const currentModule = session.getCurrentModule();
        const fileName = session.getProjectName();
        const workspace = session.getApp().getWorkspaceComponent();
        const svgElement = workspace.getSVGElement();
        const workspaceDim = svgElement.viewBox.baseVal;
        const width = workspaceDim.width;
        const height = workspaceDim.height;
        const svg = this.processSVGForExport(svgElement, width, height, currentModule);

        return Promise.resolve({
            name: fileName + '.' + this._imageType,
            type: 'image',
            data: svg,
            width: width,
            height: height,
            'image-type': this._imageType
        });
    }

    processSVGForExport(element, width, height, currentModule)
    {
        const graphController = currentModule.getGraphController();

        const viewport = currentModule.getApp().getInputAdapter().getViewportAdapter();
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
        while(uiElements.length > 0)
        {
            const e = uiElements[0];
            e.remove();//This will propagate changes to uiElements, so be careful
        }

        return clone;
    }

    /** @override */
    getIconClass()
    {
        switch(this._imageType)
        {
        case IMAGE_TYPE_PNG: return PNGIcon;
        case IMAGE_TYPE_JPG: return JPGIcon;
        case IMAGE_TYPE_SVG: return SVGIcon;
        default: return null;
        }
    }

    /** @override */
    getLabel()
    {
        switch(this._imageType)
        {
        case IMAGE_TYPE_PNG: return I18N.toString('file.export.png');
        case IMAGE_TYPE_JPG: return I18N.toString('file.export.jpg');
        case IMAGE_TYPE_SVG: return I18N.toString('file.export.svg');
        default: return super.getLabel();
        }
    }

    /** @override */
    getTitle()
    {
        switch(this._imageType)
        {
        case IMAGE_TYPE_PNG: return I18N.toString('file.export.png.hint');
        case IMAGE_TYPE_JPG: return I18N.toString('file.export.jpg.hint');
        case IMAGE_TYPE_SVG: return I18N.toString('file.export.svg.hint');
        default: return super.getTitle();
        }
    }

    getImageType()
    {
        return this._imageType;
    }
}

export const IMAGE_EXPORTERS = [
    new NodalGraphImageExporter(IMAGE_TYPE_PNG),
    new NodalGraphImageExporter(IMAGE_TYPE_JPG),
    new NodalGraphImageExporter(IMAGE_TYPE_SVG)
];

export function registerImageExporters(exportManager)
{
    for(const exporter of IMAGE_EXPORTERS)
    {
        exportManager.registerExporter(exporter, 'image-' + exporter.getImageType());
    }
}

export default NodalGraphImageExporter;
