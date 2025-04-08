'use client';

import React, { Fragment } from 'react';
import { Dialog as HeadlessDialog, Transition } from '@headlessui/react';

interface DialogProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    description?: string;
    children: React.ReactNode;
}

const Dialog: React.FC<DialogProps> = ({
    isOpen,
    onClose,
    title,
    description,
    children,
}) => {
    return (
        <Transition appear show={isOpen} as={Fragment}>
            <HeadlessDialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <HeadlessDialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all border border-gray-200 dark:border-gray-700">
                                {title && (
                                    <HeadlessDialog.Title
                                        as="h3"
                                        className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100"
                                    >
                                        {title}
                                    </HeadlessDialog.Title>
                                )}
                                {description && (
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {description}
                                        </p>
                                    </div>
                                )}
                                <div className="mt-4">{children}</div>
                            </HeadlessDialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </HeadlessDialog>
        </Transition>
    );
};

export default Dialog;