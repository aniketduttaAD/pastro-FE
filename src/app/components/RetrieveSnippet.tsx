'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { formatDate } from '@/app/lib/util';
import CodeDisplay from './CodeDisplay';
import Button from './ui/Button';
import Card from './ui/Card';
import Dialog from './ui/Dialog';
import PasswordField from './ui/PasswordField';
import FadeIn from './animations/FadeIn';
import { SlideIn } from './animations/SlideIn';
import PDFModal from '@/app/components/PdfViewerModal';
import {
    FiSearch,
    FiArrowLeft,
    FiLock,
    FiAlertTriangle,
    FiEye,
    FiClock,
    FiExternalLink,
    FiFileText
} from 'react-icons/fi';
import { showToast } from './ui/Toast';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001';

interface SnippetData {
    content: string;
    contentType: 'plain' | 'markdown' | 'code';
    language: string;
    expiresAt: string;
    createdAt: string;
    views: number;
}

const RetrieveSnippet = () => {
    const [code, setCode] = useState('');
    const [snippet, setSnippet] = useState<SnippetData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPasswordDialog, setShowPasswordDialog] = useState(false);
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState<string | undefined>(undefined);
    const [countdown, setCountdown] = useState<number | null>(null);
    const [contentType, setContentType] = useState<'website' | 'pdf' | 'other' | null>(null);
    const [showPdfModal, setShowPdfModal] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const detectContentType = (content: string): 'website' | 'pdf' | 'other' => {
        const isUrl = (str: string) => {
            try {
                new URL(str);
                return true;
            } catch {
                return false;
            }
        };
        const trimmedContent = content.trim();

        if (!isUrl(trimmedContent)) {
            return 'other';
        }
        if (trimmedContent.toLowerCase().endsWith('.pdf') ||
            trimmedContent.toLowerCase().includes('/pdf/') ||
            trimmedContent.toLowerCase().includes('application/pdf') ||
            trimmedContent.toLowerCase().includes('drive.google.com') && trimmedContent.toLowerCase().includes('.pdf')) {
            return 'pdf';
        }
        return 'website';
    };

    const openContent = useCallback(() => {
        if (!snippet || !contentType || contentType === 'other') return;

        const trimmedContent = snippet.content.trim();

        try {
            new URL(trimmedContent);

            if (contentType === 'pdf') {
                setShowPdfModal(true);
            } else {
                window.open(trimmedContent, '_blank', 'noopener,noreferrer');
            }

            // showToast.success(`Opening ${contentType === 'pdf' ? 'PDF' : 'website'} in ${contentType === 'pdf' ? 'viewer' : 'new tab'}`);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
            showToast.error(`Invalid URL: ${trimmedContent}`);
        }
    }, [snippet, contentType]);

    useEffect(() => {
        if (contentType === 'website' || contentType === 'pdf') {
            setCountdown(5);

            if (timerRef.current) {
                clearInterval(timerRef.current);
            }

            timerRef.current = setInterval(() => {
                setCountdown(prev => {
                    if (prev === 1) {
                        if (timerRef.current) {
                            clearInterval(timerRef.current);
                        }
                        openContent();
                        return null;
                    }
                    return prev ? prev - 1 : null;
                });
            }, 1000);
        }

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [contentType, openContent]);

    const fetchSnippet = useCallback(async (snippetCode: string | null) => {
        setLoading(true);
        setError(null);
        setSnippet(null);
        setContentType(null);
        setCountdown(null);

        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }

        try {
            if (!snippetCode) {
                throw new Error('Snippet code is required.');
            }

            const response = await fetch(`${API_BASE_URL}/api/snippets/${snippetCode}`);
            const data = await response.json();

            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error(`Snippet not found for code "${snippetCode}". It might have expired or never existed.`);
                }
                throw new Error(data.error || `Failed to retrieve snippet for code "${snippetCode}" (status ${response.status})`);
            }

            if (data.isProtected) {
                setCode(snippetCode);
                setShowPasswordDialog(true);
                setLoading(false);
                return;
            }

            if (data.snippet) {
                const snippetData = {
                    content: data.snippet.content,
                    contentType: data.snippet.contentType,
                    language: data.snippet.language,
                    createdAt: formatDate(new Date(data.snippet.createdAt)),
                    expiresAt: formatDate(new Date(data.snippet.expiresAt)),
                    views: data.snippet.views ?? 0,
                };

                setSnippet(snippetData);

                const detectedType = detectContentType(data.snippet.content);
                setContentType(detectedType);

                if (snippetCode) {
                    const currentUrl = new URL(window.location.href);
                    currentUrl.searchParams.set('code', snippetCode);
                    if (currentUrl.searchParams.get('code') !== snippetCode) {
                        window.history.pushState({}, '', currentUrl);
                    }
                }
            } else if (!data.isProtected) {
                throw new Error(`Unexpected response structure received for code "${snippetCode}".`);
            }

        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'An unknown error occurred.';
            setError(message);
            showToast.error(message);
            setCode('');
            const url = new URL(window.location.href);
            url.searchParams.delete('code');
            window.history.replaceState({}, '', url.pathname);
        } finally {
            if (!showPasswordDialog) {
                setLoading(false);
            }
        }
    }, [showPasswordDialog]);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const codeParam = params.get('code');

        if (codeParam && codeParam.length === 4 && /^\d{4}$/.test(codeParam)) {
            setCode(codeParam);
            fetchSnippet(codeParam);
        }
    }, [fetchSnippet]);

    const handleAccessProtected = async () => {
        setPasswordError(undefined);
        setLoading(true);

        try {
            if (!code) {
                throw new Error("Cannot access protected snippet without code.");
            }

            const response = await fetch(`${API_BASE_URL}/api/snippets/protected/${code}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password }),
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 401) {
                    setPasswordError('Invalid password');
                } else {
                    throw new Error(data.error || 'Failed to access protected snippet');
                }
            } else {
                setShowPasswordDialog(false);
                setPassword('');

                if (data.snippet) {
                    const snippetData = {
                        content: data.snippet.content,
                        contentType: data.snippet.contentType,
                        language: data.snippet.language,
                        createdAt: formatDate(new Date(data.snippet.createdAt)),
                        expiresAt: formatDate(new Date(data.snippet.expiresAt)),
                        views: data.snippet.views ?? 0,
                    };

                    setSnippet(snippetData);

                    const detectedType = detectContentType(data.snippet.content);
                    setContentType(detectedType);
                } else {
                    throw new Error('Successfully authenticated but no snippet data received.');
                }
            }

        } catch (err: unknown) {
            if (!(err instanceof Error && err.message === 'Invalid password')) {
                const message = err instanceof Error ? err.message : 'An unknown error occurred while accessing the snippet.';
                setError(message);
                showToast.error(message);
                setShowPasswordDialog(false);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (code.length === 4) {
            fetchSnippet(code);
        } else {
            showToast.error("Please enter a valid 4-digit code.");
        }
    };

    const handleReset = () => {
        setCode('');
        setSnippet(null);
        setError(null);
        setShowPasswordDialog(false);
        setPassword('');
        setPasswordError(undefined);
        setContentType(null);
        setCountdown(null);
        setShowPdfModal(false);

        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }

        const url = new URL(window.location.href);
        url.searchParams.delete('code');
        window.history.pushState({}, '', url.pathname + url.search);
    };

    const handleCodeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 4);
        setCode(value);
        if (value.length === 4) {
            fetchSnippet(value);
        }
    };

    const cancelAutoOpen = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
        setCountdown(null);
    };

    if (snippet) {
        return (
            <>
                <SlideIn direction="up" className="mt-6">
                    <Card
                        title="Retrieved Snippet"
                        subtitle={`Created: ${snippet.createdAt}`}
                    >
                        {(contentType === 'website' || contentType === 'pdf') && countdown !== null && (
                            <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-md border border-blue-100 dark:border-blue-800">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        {contentType === 'pdf' ?
                                            <FiFileText className="mr-2 text-blue-500" /> :
                                            <FiExternalLink className="mr-2 text-blue-500" />
                                        }
                                        <span className="text-blue-700 dark:text-blue-300">
                                            Opening {contentType === 'pdf' ? 'PDF' : 'website'} in {countdown} seconds...
                                        </span>
                                    </div>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={cancelAutoOpen}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        )}

                        <div className="max-h-96 overflow-y-auto">
                            <CodeDisplay
                                content={snippet.content}
                                contentType={snippet.contentType}
                                language={snippet.language}
                            />
                        </div>

                        <div className="mt-4 flex flex-wrap justify-between items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex items-center">
                                <FiClock className="mr-1" aria-hidden="true" />
                                <span>Expires: {snippet.expiresAt}</span>
                            </div>

                            <div className="flex items-center">
                                <FiEye className="mr-1" aria-hidden="true" />
                                <span>Views: {snippet.views}</span>
                            </div>
                        </div>

                        {(contentType === 'website' || contentType === 'pdf') && (
                            <div className="mt-4">
                                <Button
                                    variant="primary"
                                    icon={contentType === 'pdf' ? <FiFileText /> : <FiExternalLink />}
                                    fullWidth
                                    onClick={openContent}
                                >
                                    Open {contentType === 'pdf' ? 'PDF' : 'Website'}
                                </Button>
                            </div>
                        )}
                    </Card>

                    <div className="mt-4">
                        <Button
                            variant="outline"
                            icon={<FiArrowLeft />}
                            fullWidth
                            onClick={handleReset}
                        >
                            Retrieve Another
                        </Button>
                    </div>
                </SlideIn>

                {contentType === 'pdf' && (
                    <PDFModal
                        isOpen={showPdfModal}
                        onClose={() => setShowPdfModal(false)}
                        pdfUrl={snippet.content.trim()}
                    />
                )}
            </>
        );
    }

    return (
        <FadeIn className="mt-6">
            <form onSubmit={handleSubmit}>
                <Card title="Retrieve a Snippet" subtitle="Enter the 4-digit code to access a shared snippet">
                    <div className="flex flex-col space-y-4">
                        <div className="flex justify-center">
                            <div className="relative w-full max-w-xs">
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    id="code"
                                    name="code"
                                    value={code}
                                    onChange={handleCodeInputChange}
                                    maxLength={4}
                                    pattern="[0-9]{4}"
                                    autoFocus={!showPasswordDialog}
                                    className="block w-full text-center tracking-widest font-bold text-3xl py-3 px-4 rounded-lg border-gray-300 dark:border-gray-700 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                                    placeholder="0000"
                                    aria-label="4-digit snippet code"
                                    aria-describedby={error ? "code-error" : undefined}
                                />
                            </div>
                        </div>

                        {error && (
                            <div
                                id="code-error"
                                className="rounded-md bg-red-50 dark:bg-red-900/30 p-4 border border-red-100 dark:border-red-800"
                                role="alert"
                            >
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <FiAlertTriangle className="h-5 w-5 text-red-400 dark:text-red-300" aria-hidden="true" />
                                    </div>
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-red-800 dark:text-red-200">{error}</h3>
                                    </div>
                                </div>
                            </div>
                        )}

                        <Button
                            type="submit"
                            icon={<FiSearch />}
                            fullWidth
                            isLoading={loading}
                            disabled={loading || code.length !== 4}
                        >
                            Retrieve Snippet
                        </Button>
                    </div>
                </Card>
            </form>

            <Dialog
                isOpen={showPasswordDialog}
                onClose={() => {
                    setShowPasswordDialog(false);
                    handleReset();
                }}
                title="Protected Snippet"
                description="This snippet is password protected. Enter the password to access it."
            >
                <form onSubmit={(e) => { e.preventDefault(); handleAccessProtected(); }}>
                    <div className="mt-4 flex items-center justify-center">
                        <div className="p-3 rounded-full bg-indigo-100 dark:bg-indigo-900/50">
                            <FiLock className="h-6 w-6 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
                        </div>
                    </div>

                    <div className="mt-4">
                        <PasswordField
                            label="Password"
                            value={password}
                            onChange={setPassword}
                            error={passwordError}
                            autoFocus
                        />
                    </div>

                    <div className="mt-6 flex justify-end space-x-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                setShowPasswordDialog(false);
                                handleReset();
                            }}
                            disabled={loading}
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            isLoading={loading}
                            disabled={loading || !password}
                        >
                            Access Snippet
                        </Button>
                    </div>
                </form>
            </Dialog>
        </FadeIn>
    );
};

export default RetrieveSnippet;