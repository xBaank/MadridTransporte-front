import { useParams } from "react-router-dom";
import { TransportType } from "../stops/api/Types";
import { getCodModeByType, getUrlByCodMode } from "../stops/api/Utils";
import { Document, Page, pdfjs } from 'react-pdf';
import React, { useState } from "react";
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export default function RenderMap() {
    const { type } = useParams<{ type: TransportType }>();
    const [numPages, setNumPages] = useState<number>();
    if (type === undefined) return <></>
    const codMode = getCodModeByType(type);

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages);
    }

    return (
        <Document className="text-center" file={{ url: getUrlByCodMode(codMode) }} onLoadSuccess={onDocumentLoadSuccess} >
            {Array.from(
                new Array(numPages),
                (el, index) => (
                    <Page
                        width={1920}
                        className={`w-full`}
                        key={`page_${index + 1}`}
                        pageNumber={index + 1}
                    />
                ),
            )}
        </Document>
    )

}