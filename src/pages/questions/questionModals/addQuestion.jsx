import React, { useState } from "react";
import axios from "axios";
import { API_ENDPOINT } from "../../../config";
import GetCurrentUser from "../../../hooks/getCurrentUser";
import cover from "../../../images/questions/qqq.png";
import DOMPurify from "dompurify";

function AddQuestionModal({ setAddQuestionModal, groupData, updater }) {
  const user = GetCurrentUser();
  const [question, setQuestion] = useState("");
  const [group, setGroup] = useState(groupData);
  const [error, setError] = useState("");
  const userID = user?._id;

  const isValidInput = (input) => {
    return /^[a-zA-Z0-9!@#$%^&*()\-_=+[{\]}|;:'",./?\s]*$/.test(input);
  };

  function validation() {
    if (!question) {
      setError("You need to ask something to continue. Duh!");
    } else {
      setError(null);
      add();
    }
  }

  async function add() {
    const data = {
      id: "",
      UserId: userID,
      UserName: user?.username,
      Question: DOMPurify.sanitize(question),
      Group: group,
      Answers: [],
    };
    try {
      const response = await axios.post(
        `${API_ENDPOINT}/api/question/addQuestionAnswer`,
        data
      );
      console.log(response.data);
      setTimeout(() => {
        updater.setUpdate(updater.update + 1);
      }, 500);
    } catch (error) {
      console.error(error);
    }
    setAddQuestionModal(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-gradient-to-br from-cyan-700 to-blue-900 opacity-70"></div>
      <div className="relative bg-gray-200 rounded-lg w-3/6">
        <h1 className=" text-center pt-4 text-2xl">Ask a new Question</h1>
        <div className="pt-4 pb-4 pl-8 pr-8">
          <textarea
            onChange={(event) => setQuestion(event.target.value)}
            type="text"
            className="w-full bg-no-repeat h-64 rounded-md py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="What do you wanna ask?"
            style={{
              backgroundImage: `url(${cover})`,
              backgroundSize: "35%",
              backgroundPosition: "right bottom",
              // width: "100%",
              height: "375px",
            }}
          />
          {error && <h1 className="text-red-500">{error}</h1>}
          {isValidInput(question) || !question ? null : (
           <h1 className="text-red-500"> Invalid Input Characters Detected! </h1>
          )}
        </div>
        <div className="flex justify-end px-4 pb-4">
          <button
            onClick={() => setAddQuestionModal(false)}
            className="px-4 py-2 rounded-md mr-2 text-white bg-gray-400 hover:bg-gray-500 focus:outline-none focus:bg-gray-600"
          >
            Go back
          </button>
          <button
            disabled={!isValidInput(question)}
            onClick={validation}
            className="px-4 py-2 rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:bg-blue-700"
          >
            Add Question
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddQuestionModal;
