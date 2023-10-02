import React, { useState } from 'react';
import axios from 'axios';
import { API_ENDPOINT } from '../../../config';
import cover from "../../../images/questions/qq.png"
import DOMPurify from "dompurify";

function AddAnswerModal({ data }) {
  const userID = data.id 
  const answerPersonName = data.answerPersonName
  const answerPersonID = data.answerPersonID
  const [answer, setAnswer] = useState("")
  const [group, setGroup] = useState("")
  const [error, setError] = useState("")

  const isValidInput = (input) => {
    return /^[a-zA-Z0-9!@#$%^&*()\-_=+[{\]}|;:'",./?\s]*$/.test(input);
  };

  function validation(){
    if (!answer) {
      setError("You need to type something to continue. Duh!")
    }else {
      setError(null)
      add()
    }
  }

  async function add(){
    const array = {
        answerPersonID : answerPersonID,  
        answerPersonName : answerPersonName,
        answer: DOMPurify.sanitize(answer),
    }
    const dataProps = {
    id: userID,
    Answers: array,
    }

    try {
      const response = await axios.post(
        `${API_ENDPOINT}/api/question/addQuestionAnswer`,
        dataProps,
      )
      console.log(response.data)
    } catch (error) {
      console.error(error)
    }
    setTimeout(() => {
        data.setUpdate(data.update + 1);
      }, 1000);
    data.setAnswerModal(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" data-testid="Q001">
      <div className="fixed inset-0 bg-gradient-to-br from-cyan-700 to-blue-900 opacity-70" ></div>
      <div className="relative bg-gray-200 rounded-lg w-3/6">
        <h1 className=" text-center pt-4 text-2xl">Add an answer</h1>
        <div className="pt-4 pb-4 pl-8 pr-8">
          <textarea onChange={event => setAnswer(event.target.value)} type="text" className="w-full bg-no-repeat  h-64 rounded-md py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="Tell what you know about this question?" 
            style={{
              backgroundImage: `url(${cover})`,
              backgroundSize: "25%",
              backgroundPosition: "right bottom",
              // width: "100%",
              height: "375px",
            }}
          />
          {error && (<h1 className='text-red-500'>{error}</h1>) }
          {isValidInput(answer) || !answer ? null : (
           <h1 className="text-red-500"> Invalid Input Characters Detected! </h1>
          )}
        </div> 
        <div className="flex justify-end px-4 pb-4">
          <button onClick={()=> data.setAnswerModal(false)} className="px-4 py-2 rounded-md mr-2 text-white bg-gray-400 hover:bg-gray-500 focus:outline-none focus:bg-gray-600">Go back</button>
          <button disabled={!isValidInput(answer)} onClick={validation} className="px-4 py-2 rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:bg-blue-700">Add Answer</button>
        </div>
      </div>
    </div>
  );
}

export default AddAnswerModal;