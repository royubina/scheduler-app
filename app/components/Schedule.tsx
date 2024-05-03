'use client'

import React, { FormEvent, Fragment, useEffect, useState } from 'react'
import { FaEye, FaEdit, FaTrash, FaRegCheckCircle } from 'react-icons/fa';
import ModalMain from './ModalMain';
import ModalContent from './ModalContent';

const Schedule = () => {
    const [showModal, setShowModal] = useState(false)
    const [action, setAction] = useState("")
    const [search, setSearch] = useState("")
    const [row, setRow] = useState({})
    const [items, setItems] = useState<any[]>([])
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(1)
    const [message, setMessage] = useState("")

    const timer = setTimeout(() => { setMessage(""); }, 10000);

    let limit = 10;
    const pageTotal = Math.ceil(total/limit)

    const getSchedules = async (page: any) => {
        const result = await fetch(`http://localhost:8000/api/scheduler/pagination?page=${page}&perPage=${limit}`)
        const data = await result.json()

        setItems(data.body.rows)
        setTotal(data.body.total)
        setPage(page) 
    }

    const getSearchSchedules = async (page: any) => {
        const result = await fetch(`http://localhost:8000/api/scheduler/search?value=${search}&page=${page}&perPage=${limit}`)
        const data = await result.json()

        setItems(data.body.rows)
        setTotal(data.body.total)
        setPage(page) 
    }

    const postSchedule = async (formData: any) => {
        const body = {
            "task": formData.get('task'),
            "every": formData.get('every')
        }
        const result = await fetch(`http://localhost:8000/api/scheduler`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
          })

        const data = await result.json()

        return data
    }

    const putSchedule = async (formData: any, uuid: string) => {
        const body = {
            "task": formData.get('task'),
            "every": formData.get('every')
        }
        const result = await fetch(`http://localhost:8000/api/scheduler/find/${uuid}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
          })

        const data = await result.json()

        return data
    }

    const deleteSchedule = async (uuid: string) => {
        const result = await fetch(`http://localhost:8000/api/scheduler/find/${uuid}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
          })

        const data = await result.json()

        return data
    }

    useEffect(() => {
        let skip = 1

        getSchedules(skip).catch(console.error);
    }, [showModal])

    const handlePrevious = () => {
        let skip = (page - 1)

        getSchedules(skip).catch(console.error);
    }

    const handleNext = () => {
        let skip = (page + 1)

        getSchedules(skip).catch(console.error);
    }

    const handleSearch = async () => {
        if(search === "" || search === null)
            return

        let skip = 1

        getSearchSchedules(skip).catch(console.error);
    }

    const handleKeypress = async (e: any) => {
        if (e.keyCode === 13) {
            await handleSearch()
        }
    };

    const handleOpenModal = (action: string) => {
        setRow({})
        setAction(action)
        setShowModal(true)
    }

    const handleOpenModalWithData = (action: string, uuid: string, task: string, every: string) => {
        setRow({
            uuid,
            task,
            every
        })
        setAction(action)
        setShowModal(true)
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>, uuid: string) => {
        e.preventDefault();
    
        const formData = new FormData(e.currentTarget)
        let result = null

        switch(action) {
            case "Add": 
                result = await postSchedule(formData)
            case "Edit":
                result = await putSchedule(formData, uuid)
            case "Delete":
                result = await deleteSchedule(uuid)
            default:
                // DO NOTHING
        }
        
        setMessage(result.message)
        setShowModal(false)
    }

    return (
        <Fragment>
            {/* SEARCH */}
            <div className='flex flex-row justify-between'>
                <div>
                    <button 
                        className="font-bold cursor-pointer rounded-3xl bg-green-400 hover:bg-green-600 border border-slate-500 btn-sm"
                        onClick={() => handleOpenModal("Add")}
                    >
                        New Schedule
                    </button>
                </div>
                <div className="join mb-2">
                    <div>
                        <input className="input input-bordered join-item input-sm" placeholder="Search" onKeyDown={handleKeypress} onChange={(e) => setSearch(e.target.value)}/>
                    </div>
                    <div className="indicator">
                        <button className="btn join-item btn-sm bg-black text-white" onClick={handleSearch}>Search</button>
                    </div>
                </div>
            </div>
                
            {/* TABLE */}
            <div className="overflow-x-auto mb-2">
                <table className="table">
                    <thead>
                        <tr className="text-black text-sm border border-slate-500">
                            <th>Task</th>
                            <th>Every</th>
                            <th className="flex flex-row space-x-2 place-content-end">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item) => (
                            <tr key={item.uuid} className="text-black text-xs border border-slate-500">
                                <td>{item.task}</td>
                                <td>{item.every}</td>
                                <td className="flex flex-row space-x-2 place-content-end">
                                    <button onClick={() => handleOpenModalWithData("View", item.uuid, item.task, item.every)}><FaEye size={20} /></button>
                                    <button onClick={() => handleOpenModalWithData("Edit", item.uuid, item.task, item.every)}><FaEdit size={20} color="#42A5F5" /></button>
                                    <button onClick={() => handleOpenModalWithData("Delete", item.uuid, item.task, item.every)}><FaTrash size={20} color="#EF5350" /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* PAGINATION AND RECORD TOTAL */}
            <div className="flex flex-row justify-evenly">
                <div className="w-full">
                    <h3 className="font-bold text-sm px-2 py-1">Total: {total}</h3>
                </div>
                <div className="flex w-full place-content-end">
                    <button disabled={page === 1} className="font-bold cursor-pointer rounded-l-3xl bg-blue-400 hover:bg-blue-600 border border-slate-500 btn-sm" onClick={handlePrevious}>Previous</button>
                    <h3 className="font-bold bg-blue-400 border border-slate-500 text-sm px-2 py-1">Page {page} of {pageTotal}</h3>
                    <button disabled={total <= (page * limit)}  className="font-bold cursor-pointer rounded-r-3xl bg-blue-400 hover:bg-blue-600 border border-slate-500 btn-sm" onClick={handleNext}>Next</button>
                </div>
            </div>

            {/* MODAL */}
            <div>
                <ModalMain isVisible={showModal} onClose={() => setShowModal(false)}>
                    <ModalContent action={action} item={row} handleSubmit={handleSubmit} />
                </ModalMain>
            </div>

            {/* MESSAGE MODAL */}
            { message !== "" &&
                <div className="toast toast-top toast-center font-bold">
                    <div className="alert alert-success">
                        <FaRegCheckCircle size={20} />
                        <span>{message}</span>
                    </div>
                </div>
            }
            
        </Fragment>
    )
}

export default Schedule