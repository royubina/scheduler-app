'use client'

import React, { FormEvent, Fragment } from 'react'

interface ModalContentProps {
    action: string; 
    item: any;
    handleSubmit: any;
}

const ModalContent: React.FC<ModalContentProps> = ({ action, item, handleSubmit }) => {
    return (
        <Fragment>
            <div className="p-6">
                <div>
                    <h1 className="text-xl font-bold my-4">{action} Schedule</h1>
                </div>
                <form className="space-y-2" onSubmit={(e) => {handleSubmit(e, item.uuid)}}>
                    <div className="space-y-0.5">
                        <label className="block text-black text-sm font-small">
                            Task
                        </label>
                        <input
                        type="text"
                        name="task"
                        id="task"
                        className="bg-gray-50 border border-gray-300 rounded-lg text-gray-900 text-xs focus:ring-blue-500 focus:border-blue-500 w-full p-2"
                        // placeholder={item ? item.task : "Task"}
                        defaultValue={item ? item.task : "Task"}
                        readOnly={action==="View" || action==="Delete"}
                        required
                        />
                    </div>
                    <div className="space-y-0.5">
                        <label className="block text-black text-sm font-small">
                            Every
                        </label>
                        <input
                            type="text"
                            name="every"
                            id="every"
                            className="bg-gray-50 border border-gray-300 rounded-lg text-gray-900 text-xs focus:ring-blue-500 focus:border-blue-500 w-full p-2"
                            // placeholder={item ? item.every : "Every"}
                            defaultValue={item ? item.every : "Every"}
                            readOnly={action==="View" || action==="Delete"}
                            required
                        />
                    </div>
                    { action !== "View" &&
                        <div className="flex flex-row justify-end">
                            <button 
                                type="submit"
                                className="bg-blue-400 hover:bg-blue-600 focus:outline-none text-center text-white font-medium text-sm rounded-lg px-5 py-0.5 place-self-end"
                            >
                                { action === "Delete" ? "Delete" : "Save" }
                            </button>
                        </div>
                    }
                </form>
            </div>
        </Fragment>
    )
}

export default ModalContent