'use client';

import { useState, useEffect, useRef } from 'react';
import Button from './ui/Button';
import { FiX, FiDownload, FiExternalLink, FiRefreshCw } from 'react-icons/fi';

interface PDFModalProps {
    isOpen: boolean;
    onClose: () => void;
    pdfUrl: string;
}

const PDFModal = ({ isOpen, onClose, pdfUrl }: PDFModalProps) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [iframeBlocked, setIframeBlocked] = useState(false);
    const iframeRef = useRef<HTMLIFrameElement>(null);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            setLoading(true);
            setError(null);
            setIframeBlocked(false);
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);

    useEffect(() => {
        const checkIframe = setTimeout(() => {
            if (iframeRef.current) {
                try {
                    const iframeContent = iframeRef.current.contentWindow;
                    if (!iframeContent || iframeContent.length === 0) {
                        setIframeBlocked(true);
                        setLoading(false);
                    }
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                } catch (e) {
                    setIframeBlocked(true);
                    setLoading(false);
                }
            }
        }, 2000);
        return () => clearTimeout(checkIframe);
    }, [isOpen, pdfUrl]);

    useEffect(() => {
        const iframe = iframeRef.current;
        if (iframe) {
            const handleLoad = () => {
                setLoading(false);
                setError(null);
                try {
                    if (iframe.contentDocument === null) {
                        setIframeBlocked(true);
                    }
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                } catch (e) {
                    setIframeBlocked(true);
                }
            };

            const handleError = () => {
                setLoading(false);
                setError("Failed to load PDF");
            };

            iframe.addEventListener('load', handleLoad);
            iframe.addEventListener('error', handleError);

            return () => {
                iframe.removeEventListener('load', handleLoad);
                iframe.removeEventListener('error', handleError);
            };
        }
    }, [isOpen, pdfUrl]);

    function downloadPdf() {
        try {
            const link = document.createElement('a');
            link.href = pdfUrl;
            link.download = pdfUrl.substring(pdfUrl.lastIndexOf('/') + 1) || 'document.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (err) {
            console.error('Error downloading PDF:', err);
            alert('Failed to download PDF');
        }
    }

    function openInNewTab() {
        window.open(pdfUrl, '_blank', 'noopener,noreferrer');
    }

    function retryLoading() {
        setLoading(true);
        setError(null);
        setIframeBlocked(false);

        if (iframeRef.current) {
            const currentSrc = iframeRef.current.src;
            iframeRef.current.src = '';
            setTimeout(() => {
                if (iframeRef.current) {
                    iframeRef.current.src = currentSrc;
                }
            }, 100);
        }
    }

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
            role="dialog"
            aria-modal="true"
            aria-labelledby="pdf-modal-title"
        >
            <div className="relative w-full h-full max-h-screen flex flex-col bg-white dark:bg-gray-900">
                <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
                    <h2 id="pdf-modal-title" className="text-lg font-semibold">PDF Viewer</h2>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            icon={<FiDownload />}
                            onClick={downloadPdf}
                            aria-label="Download PDF"
                        >
                            Download
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            icon={<FiExternalLink />}
                            onClick={openInNewTab}
                            aria-label="Open in new tab"
                        >
                            Open in Browser
                        </Button>
                        {iframeBlocked && (
                            <Button
                                variant="ghost"
                                size="sm"
                                icon={<FiRefreshCw />}
                                onClick={retryLoading}
                                aria-label="Retry loading"
                            >
                                Retry
                            </Button>
                        )}
                        <Button
                            variant="ghost"
                            size="sm"
                            icon={<FiX />}
                            onClick={onClose}
                            aria-label="Close modal"
                        >
                            Close
                        </Button>
                    </div>
                </div>

                <div className="flex-1 relative bg-gray-100 dark:bg-gray-800">
                    {loading && (
                        <div className="absolute inset-0 flex items-center justify-center z-10">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500" aria-label="Loading PDF"></div>
                        </div>
                    )}

                    {error ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center p-6">
                                <p className="text-red-500">{error}</p>
                                <Button
                                    variant="outline"
                                    className="mt-4"
                                    onClick={retryLoading}
                                >
                                    Retry
                                </Button>
                            </div>
                        </div>
                    ) : iframeBlocked ? (
                        <div className="absolute inset-0 flex items-center justify-center flex-col p-6">
                            <div className="bg-yellow-50 dark:bg-yellow-900/30 p-6 rounded-lg max-w-lg text-center">
                                <h3 className="text-lg font-medium mb-2">Content Security Policy Restriction</h3>
                                <p className="mb-4">
                                    This PDF cannot be displayed in the viewer due to security restrictions set by the source website.
                                </p>
                                <div className="flex justify-center space-x-4">
                                    <Button
                                        variant="primary"
                                        onClick={openInNewTab}
                                        icon={<FiExternalLink />}
                                    >
                                        Open in Browser
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={downloadPdf}
                                        icon={<FiDownload />}
                                    >
                                        Download PDF
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <iframe
                            ref={iframeRef}
                            src={pdfUrl}
                            className="w-full h-full border-0"
                            title="PDF Viewer"
                            sandbox="allow-same-origin allow-scripts allow-forms"
                            allowFullScreen
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default PDFModal;