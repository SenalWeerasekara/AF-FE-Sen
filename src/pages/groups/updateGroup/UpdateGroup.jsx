import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { API_ENDPOINT } from "../../../config";
import DOMPurify from "dompurify";

function CreateGroup() {
  const history = useNavigate();

  const initialState = {
    groupName: "",
    category: "",
    description: "",
  };

  const [state, setState] = useState(initialState);

  const { groupName, category, description } = state;

  const { _id } = useParams();

  //get one item
  const data = async () => {
    const response = await axios.get(
      `${API_ENDPOINT}/api/group/getOneGroup/${_id}`
    );
    setState(response.data);
    console.log(response.data);
  };

  useEffect(() => {
    data();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setState({ ...state, [name]: value });
  };

  const updateGroup = async (e) => {
    e.preventDefault();

    const data = {
      groupName: DOMPurify.sanitize(groupName),
      category: DOMPurify.sanitize(category),
      description: DOMPurify.sanitize(description),
    };

    //update the item
    axios.patch(`http://localhost:3002/api/group/updateGroup/${_id}`, data);

    alert("Product updated successfully..");
    history("/groups");
  };

  const backgroundImage =
    "https://t4.ftcdn.net/jpg/03/98/45/23/360_F_398452372_dhh1fXfIZ7GYPJnQRwCl6IGY1sn53AUX.jpg";

  return (
    <div className="grid h-screen place-items-center">
      <div
        class="w-full object-cover"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          height: "22rem",
          opacity: 0.8,
        }}
      >
        <p class="font-bold text-4xl text-center opacity-100 text-black-700 pt-40">
          Update a Group
        </p>
      </div>

      <form className="w-full max-w-lg pt-10" onSubmit={updateGroup}>
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full px-3">
            <label
              className="block uppercase tracking-wide text-gray-700 text-sm font-bold mb-2"
              for="grid-password"
              htmlFor="groupName"
            >
              Group Name
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="groupName"
              name="groupName"
              value={state.groupName ? state.groupName : ""}
              onChange={handleInputChange}
              type="text"
              autoComplete="off"
            />
          </div>
        </div>
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full px-3">
            <label
              className="block uppercase tracking-wide text-gray-700 text-sm font-bold mb-2"
              for="grid-state"
              htmlFor="category"
            >
              Category
            </label>
            <div className="relative">
              <select
                className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="category"
                name="category"
                value={state.category ? state.category : ""}
                onChange={handleInputChange}
              >
                <option>Select</option>
                <option>Institutes</option>
                <option>Higher Education</option>
                <option>Exam Guidance</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <label
          for="message"
          className="block uppercase tracking-wide text-gray-700 text-sm font-bold mb-2"
          htmlFor="description"
        >
          Group Description
        </label>
        <textarea
          rows="4"
          id="description"
          name="description"
          value={state.description ? state.description : ""}
          onChange={handleInputChange}
          type="text"
          autoComplete="off"
          className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-5 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
        ></textarea>

        <div className="place-self-end text-right">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold mb-10 py-2 px-4 border border-blue-700 rounded mt-4 w-36"
            type="submit"
          >
            Update
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateGroup;
