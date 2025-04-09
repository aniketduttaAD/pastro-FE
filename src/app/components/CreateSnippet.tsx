'use client';

import { useState } from 'react';
import { ExpirationTime, formatDate } from '@/app/lib/util';
import SnippetEditor from './SnippetEditor';
import Button from './ui/Button';
import Card from './ui/Card';
import Dialog from './ui/Dialog';
import PasswordField from './ui/PasswordField';
import FadeIn from './animations/FadeIn';
import { SlideIn } from './animations/SlideIn';
import {
    FiShare2,
    FiPlus,
    FiCopy,
    FiLink,
    FiLock,
    FiAlertTriangle,
    FiCheck
} from 'react-icons/fi';
import { showToast } from './ui/Toast';
import { motion } from 'framer-motion';
type ContentType = 'plain' | 'markdown' | 'code';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001';

const CreateSnippet = () => {
    const [content, setContent] = useState('');
    const [contentType, setContentType] = useState<ContentType>('plain');
    const [language, setLanguage] = useState('');
    const [expirationDays, setExpirationDays] = useState<ExpirationTime>(1);
    const [isProtected, setIsProtected] = useState(false);
    const [password, setPassword] = useState('');
    const [code, setCode] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [expiresAt, setExpiresAt] = useState<string | null>(null);
    const [showPasswordDialog, setShowPasswordDialog] = useState(false);
    const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
    const isValidContent = content.trim().length > 0 && content.trim().length <= 100000;
    const isValidPassword = !isProtected || (password.length >= 4);
    const isFormValid = isValidContent && isValidPassword;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isFormValid) {
            if (!isValidContent) {
                showToast.warning('Please add content between 1 and 100,000 characters');
            } else if (!isValidPassword) {
                showToast.warning('Password must be at least 4 characters');
            }
            return;
        }

        if (isProtected && !password) {
            setShowPasswordDialog(true);
            return;
        }

        await createSnippet();
    };

    const createSnippet = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/api/snippets`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    content,
                    contentType,
                    language,
                    expirationDays,
                    isProtected,
                    password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to create snippet');
            }

            setCode(data.code);
            setExpiresAt(formatDate(new Date(data.expiresAt)));
            // showToast.success('Snippet created successfully!');

            // Copy link to clipboard after successful creation
            const baseUrl = window.location.origin;
            navigator.clipboard.writeText(baseUrl + '?code=' + data.code);
            showToast.copySuccess('Snippet created and link copied to clipboard!');

        } catch (err) {
            const message =
                err instanceof Error ? err.message : 'An unexpected error occurred';
            setError(message);
            showToast.error(message);
        }
        finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setCode(null);
        setExpiresAt(null);
        setError(null);
        setContent('');
        setContentType('plain');
        setLanguage('');
        setExpirationDays(1);
        setIsProtected(false);
        setPassword('');
        setShowAdvancedOptions(false);
        // showToast.info('Ready to create a new snippet');
    };

    const copyLinkToClipboard = () => {
        const baseUrl = window.location.origin;
        navigator.clipboard.writeText(baseUrl + '?code=' + code);
        showToast.copySuccess('Link copied to clipboard!');
    };

    if (code) {
        return (
            <SlideIn direction="up" className="mt-6">
                <Card
                    title="Snippet Created!"
                    subtitle="Share this snippet using the code or link below"
                >
                    <div className="flex flex-col items-center space-y-6">
                        <div className="w-full max-w-md p-6 bg-gray-800/40 rounded-xl border border-gray-700 shadow-lg">
                            <div className="text-center">
                                <div className="mb-2 text-sm font-medium text-gray-300">
                                    {isProtected ? 'Password Protected' : 'Access with Code'}
                                </div>
                                <div className="text-4xl font-bold tracking-widest bg-gray-900 p-5 rounded-lg border border-gray-700 mb-3 text-gray-100">
                                    {code}
                                </div>

                                <div className="flex justify-center space-x-3 mt-4">
                                    <Button
                                        size="sm"
                                        icon={<FiCopy />}
                                        onClick={() => {
                                            navigator.clipboard.writeText(code);
                                            showToast.copySuccess('Code copied to clipboard!');
                                        }}
                                    >
                                        Copy Code
                                    </Button>

                                    <Button
                                        size="sm"
                                        variant="outline"
                                        icon={<FiLink />}
                                        onClick={copyLinkToClipboard}
                                    >
                                        Copy Link
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="w-full flex flex-col space-y-3">
                            {isProtected && (
                                <div className="flex items-center text-amber-400 text-sm bg-amber-900/20 p-4 rounded-lg border border-amber-800/40">
                                    <FiLock className="flex-shrink-0 mr-2 h-5 w-5" />
                                    <span>
                                        This snippet is password protected. Recipients will need both the code and password to access it.
                                    </span>
                                </div>
                            )}
                            <div className="flex items-center space-x-2 text-gray-300 text-sm">
                                <FiCheck className="h-4 w-4 text-green-500" />
                                <span>Expires: {expiresAt}</span>
                            </div>
                        </div>

                        <div className="flex space-x-3 w-full">
                            <Button
                                variant="outline"
                                icon={<FiShare2 />}
                                onClick={() => {
                                    if (navigator.share) {
                                        navigator.share({
                                            title: 'Pastro Snippet',
                                            text: isProtected
                                                ? 'I\'ve shared a password-protected snippet with you'
                                                : `Access my shared text with code: ${code}`,
                                            url: window.location.origin + '?code=' + code,
                                        })
                                            .then(() => showToast.success('Shared successfully!'))
                                            .catch(err => {
                                                console.error('Error sharing:', err);
                                                copyLinkToClipboard();
                                            });
                                    } else {
                                        copyLinkToClipboard();
                                    }
                                }}
                                className="flex-1"
                            >
                                Share
                            </Button>

                            <Button
                                fullWidth
                                icon={<FiPlus />}
                                onClick={handleReset}
                                className="flex-1"
                            >
                                Create New
                            </Button>
                        </div>
                    </div>
                </Card>
            </SlideIn>
        );
    }

    return (
        <FadeIn className="mt-6">
            <form onSubmit={handleSubmit}>
                <Card>
                    <SnippetEditor
                        content={content}
                        setContent={setContent}
                        contentType={contentType}
                        setContentType={setContentType}
                        language={language}
                        setLanguage={setLanguage}
                        expirationDays={expirationDays}
                        setExpirationDays={setExpirationDays}
                    />
                    <div className="mt-6">
                        <button
                            type="button"
                            onClick={() => {
                                setShowAdvancedOptions(!showAdvancedOptions);
                                if (!showAdvancedOptions) {
                                    // showToast.info('Advanced options displayed');
                                }
                            }}
                            className="text-sm text-indigo-400 hover:text-indigo-300 focus:outline-none focus:underline transition duration-200"
                        >
                            {showAdvancedOptions ? 'Hide' : 'Show'} advanced options
                        </button>
                        {showAdvancedOptions && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="mt-4 space-y-4 bg-gray-800/50 p-5 rounded-lg border border-gray-700 shadow-inner"
                            >
                                <div className="flex items-start">
                                    <div className="flex items-center h-5">
                                        <input
                                            id="protected"
                                            name="protected"
                                            type="checkbox"
                                            checked={isProtected}
                                            onChange={(e) => {
                                                setIsProtected(e.target.checked);
                                                if (e.target.checked) {
                                                    // showToast.info('Password protection enabled');
                                                } else {
                                                    // showToast.info('Password protection disabled');
                                                }
                                            }}
                                            className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-600 rounded"
                                        />
                                    </div>
                                    <div className="ml-3 text-sm">
                                        <label htmlFor="protected" className="font-medium text-gray-200">
                                            Password protect
                                        </label>
                                        <p className="text-gray-400">
                                            Require a password to access this snippet
                                        </p>
                                    </div>
                                </div>
                                {isProtected && (
                                    <div className="pl-7">
                                        <PasswordField
                                            label="Snippet password"
                                            value={password}
                                            onChange={(value) => {
                                                setPassword(value);
                                                if (value.length < 4 && value.length > 0) {
                                                    showToast.warning('Password must be at least 4 characters');
                                                }
                                            }}
                                            placeholder="Enter a secure password"
                                            error={password && password.length < 4 ? "Password must be at least 4 characters" : undefined}
                                        />
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </div>
                    {error && (
                        <div className="mt-4 rounded-md bg-red-900/30 p-4 border border-red-800">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <FiAlertTriangle className="h-5 w-5 text-red-400" />
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-red-300">{error}</h3>
                                </div>
                            </div>
                        </div>
                    )}
                </Card>
                <div className="mt-4">
                    <Button
                        type="submit"
                        fullWidth
                        isLoading={loading}
                        disabled={loading || !isFormValid}
                    >
                        Create Snippet
                    </Button>
                </div>
            </form>
            <Dialog
                isOpen={showPasswordDialog}
                onClose={() => setShowPasswordDialog(false)}
                title="Set Password"
                description="Enter a password to protect your snippet"
            >
                <div className="mt-4">
                    <PasswordField
                        label="Password"
                        value={password}
                        onChange={(value) => {
                            setPassword(value);
                            if (value.length < 4 && value.length > 0) {
                                showToast.warning('Password must be at least 4 characters');
                            }
                        }}
                        autoFocus
                        error={password && password.length < 4 ? "Password must be at least 4 characters" : undefined}
                    />

                    <div className="text-sm text-gray-400 mt-2">
                        <p>Recipients will need both the code and this password to access your snippet.</p>
                    </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                    <Button
                        variant="outline"
                        onClick={() => setShowPasswordDialog(false)}
                    >
                        Cancel
                    </Button>

                    <Button
                        disabled={password.length < 4}
                        onClick={() => {
                            if (password.length >= 4) {
                                setShowPasswordDialog(false);
                                createSnippet();
                            } else {
                                showToast.warning('Password must be at least 4 characters');
                            }
                        }}
                    >
                        Set Password
                    </Button>
                </div>
            </Dialog>
        </FadeIn>
    );
};

export default CreateSnippet;