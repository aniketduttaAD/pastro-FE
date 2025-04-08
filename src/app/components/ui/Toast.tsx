'use client';

import { toast, ToastOptions } from 'react-toastify';
import { FiCheck, FiInfo, FiAlertTriangle, FiX, FiCopy } from 'react-icons/fi';

const defaultOptions: ToastOptions = {
    position: 'bottom-right',
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
};

const createToast = (
    type: 'success' | 'error' | 'info' | 'warning',
    message: string,
    options?: ToastOptions
) => {
    const icons = {
        success: <FiCheck className="text-green-500 w-5 h-5" />,
        error: <FiX className="text-red-500 w-5 h-5" />,
        info: <FiInfo className="text-blue-500 w-5 h-5" />,
        warning: <FiAlertTriangle className="text-yellow-500 w-5 h-5" />,
    };

    return toast[type](
        <div className="flex items-center">
            <span className="mr-2">{icons[type]}</span>
            <span>{message}</span>
        </div>,
        {
            ...defaultOptions,
            ...options,
            className: `bg-gray-800 text-gray-100 dark:bg-gray-900 rounded-lg shadow-lg border border-gray-700 ${options?.className || ''}`,
        }
    );
};

export const showToast = {
    success: (message: string, options?: ToastOptions) => createToast('success', message, options),
    error: (message: string, options?: ToastOptions) => createToast('error', message, options),
    info: (message: string, options?: ToastOptions) => createToast('info', message, options),
    warning: (message: string, options?: ToastOptions) => createToast('warning', message, options),
    copySuccess: (message: string = 'Copied to clipboard!', options?: ToastOptions) => {
        return toast.success(
            <div className="flex items-center">
                <FiCopy className="text-green-500 w-5 h-5 mr-2" />
                <span>{message}</span>
            </div>,
            {
                ...defaultOptions,
                ...options,
                className: `bg-gray-800 text-gray-100 dark:bg-gray-900 rounded-lg shadow-lg border border-gray-700 ${options?.className || ''}`,
            }
        );
    },
};