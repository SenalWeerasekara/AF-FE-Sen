import React, { useState } from 'react';
import axios from 'axios';
import { API_ENDPOINT } from '../../../config';

function ModifyAnsModal({ data }) {
  const userID = data.id 
  const answerPersonName = data.answerPersonName
  const [answer, setAnswer] = useState(data.answer)
  const [group, setGroup] = useState("")
  const [error, setError] = useState("")

  function validation(){
    if (!answer) {
      setError("You need to ask something to continue. Duh!")
    }else {
      setError(null)
      add()
    }
  }

  async function add(){
    const array = {
        _id: data.answerID,
        answerPersonName : data.name,
        answer: answer,
    }
    const dataProps = {
    id: data.id,
    Answers: array,
    }

    try {
      const response = await axios.put(
        `${API_ENDPOINT}/api/question/updateAnswer`,
        dataProps,
      )
      console.log(response.data)
    } catch (error) {
      console.error(error)
    }
    setTimeout(() => {
        data.setUpdate(data.update + 1);
      }, 500);
    data.setModifyModal(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-gradient-to-br from-cyan-700 to-blue-900 opacity-70" ></div>
      <div className="relative bg-gray-200 rounded-lg w-3/6">
        <h1 className=" text-center pt-4 text-2xl">Modify answer</h1>
        <div className="pt-4 pb-4 pl-8 pr-8">
          <textarea onChange={event => setAnswer(event.target.value)} value={answer} type="text" className="w-full  h-64 rounded-md py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="What do you wanna ask?" />
          {error && (<h1 className='text-red-500'>{error}</h1>) }
        </div> 
        <div className="flex justify-end px-4 pb-4">
          <button onClick={()=> data.setModifyModal(false)} className="px-4 py-2 rounded-md mr-2 text-white bg-gray-400 hover:bg-gray-500 focus:outline-none focus:bg-gray-600">Go back</button>
          <button onClick={validation} className="px-4 py-2 rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:bg-blue-700">Add Answer</button>
        </div>
      </div>
    </div>
  );
}

export default ModifyAnsModal;