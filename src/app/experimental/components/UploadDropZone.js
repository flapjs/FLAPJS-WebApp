import React from 'react';
import Style from './UploadDropZone.css';

import UploadIcon from 'components/iconset/UploadIcon.js';

class UploadDropZone extends React.Component
{
    constructor(props)
    {
        super(props);

        this.ref = null;

        this._waiting = false;

        this.onDragEnter = this.onDragEnter.bind(this);
        this.onDragLeave = this.onDragLeave.bind(this);
        this.onFileDrop = this.onFileDrop.bind(this);
    }

    /** @override */
    componentDidMount()
    {
    //Upload drop zone
        this.ref.addEventListener('drop', this.onFileDrop);
        this.ref.addEventListener('dragover', this.onDragEnter);
        this.ref.addEventListener('dragenter', this.onDragEnter);
        this.ref.addEventListener('dragleave', this.onDragLeave);
        this.ref.addEventListener('dragend', this.onDragLeave);
    }

    /** @override */
    componentWillUnmount()
    {
        this.ref.removeEventListener('drop', this.onFileDrop);
        this.ref.removeEventListener('dragover', this.onDragEnter);
        this.ref.removeEventListener('dragenter', this.onDragEnter);
        this.ref.removeEventListener('dragleave', this.onDragLeave);
        this.ref.removeEventListener('dragend', this.onDragLeave);
    }

    onDragEnter(e)
    {
        e.preventDefault();
        e.stopPropagation();

        //Change state
        this._waiting = true;
    }

    onDragLeave(e)
    {
    //Prevent file from being opened
        e.preventDefault();
        e.stopPropagation();

        //Revert state
        this._waiting = false;
    }

    onFileDrop(e)
    {
    //Prevent file from being opened
        e.preventDefault();
        e.stopPropagation();

        //Revert state
        this._waiting = false;

        const dataTransfer = e.dataTransfer;
        let fileBlob = null;
        if (dataTransfer.items)
        {
            const dataItems = dataTransfer.items;
            const length = dataItems.length;

            //Just get the first one
            if (length >= 1)
            {
                const file = dataItems[0];
                if (file.kind === 'file')
                {
                    fileBlob = file.getAsFile();
                }
            }
        }
        else
        {
            const dataFiles = dataTransfer.files;
            const length = dataFiles.length;

            //Just get the first one
            if (length >= 1)
            {
                fileBlob = dataFiles[0];
            }
        }

        if (this.props.onFileDrop)
        {
            //NOTE: fileBlob could be null
            this.props.onFileDrop(fileBlob);
        }

        if (dataTransfer.items)
        {
            dataTransfer.items.clear();
        }
        else
        {
            dataTransfer.clearData();
        }
    }

    /** @override */
    render()
    {
        const isWaitingForFile = this._waiting;

        return (
            <div ref={ref=>this.ref=ref} id={this.props.id}
                className={Style.upload_container +
          (isWaitingForFile ? ' waiting ' : '') +
          ' ' + this.props.className}
                style={this.props.style}>
                <UploadIcon className={Style.upload_icon}/>
                {React.Children.only(this.props.children)}
            </div>
        );
    }
}

export default UploadDropZone;
