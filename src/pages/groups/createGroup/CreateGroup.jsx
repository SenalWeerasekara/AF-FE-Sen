import React, { useState, useRef } from "react";
import axios from "axios";
import { uploadFile } from "../../../firebase";
import { useNavigate } from "react-router-dom";
import GetCurrentUser from "../../../hooks/getCurrentUser";
import { API_ENDPOINT } from "../../../config";
import DOMPurify from "dompurify";

function CreateGroup() {
  const file_input_ref = useRef(null);
  const [state, setState] = useState("Ready.");

  const [groupName, setGroupName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  //get current user
  const currentUser = GetCurrentUser();

  const history = useNavigate();

  function handlesubmit(e) {
    e.preventDefault();

    setState("Uploading...");
    if (file_input_ref.current) {
      // Get the file dom reference
      let file_input = file_input_ref.current;

      // Check if file is set
      if (!file_input.files || file_input.files.length <= 0) {
        setState("You don't have a file selected.");
        return;
      }
      // Get file object
      let file = file_input.files[0];
      console.log(file);
      // Check the image size - 2MB for example
      if (file.size > 2 * 1024 * 1024) {
        setState(
          "You exceed the max file size. " +
            "Consider learning IT" +
            "So you can learn yourself how to code a image scaler. " +
            "Do it in C++ with web assembly, " +
            "So you can run it on a browser. " +
            "Now you can scale this image" +
            "To fit the requirement. " +
            "If you figure it out, " +
            "Hatsune miku will personally come to your home and" +
            "Give you a kiss. "
        );
        return;
      }

      try {
        uploadFile(file).then((res) => {
          const newGroup = {
            groupName : DOMPurify.sanitize(groupName),
            category : DOMPurify.sanitize(category),
            description : DOMPurify.sanitize(description),
            groupIcon: res,
            adminId: currentUser._id,
          };

          axios
            .post(`${API_ENDPOINT}/api/group/addgroup`, newGroup)
            .then(() => {
              alert("Group Created Successfully!!");
              history("/groups");
            })
            .catch((err) => {
              console.log(err.message);
            });
        });
      } catch (e) {
        alert("firbase save failed");
      }
    }
  }

  const backgroundImage =
    "https://t4.ftcdn.net/jpg/03/98/45/23/360_F_398452372_dhh1fXfIZ7GYPJnQRwCl6IGY1sn53AUX.jpg";

  return (
    <div className="grid h-screen place-items-center">
      <div
        className="w-full object-cover"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          height: "22rem",
          opacity: 0.8,
        }}
      >
        <p className="font-bold text-4xl text-center opacity-100 text-black-700 pt-40">
          Create a Group
        </p>
      </div>
      <form
        className="w-full max-w-lg pt-10"
        onSubmit={handlesubmit}
        encType="multipart/form-data"
      >
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full px-3">
            <label
              className="block uppercase tracking-wide text-gray-700 font-bold mb-2 text-sm"
              //for="grid-password"
              htmlFor="groupName"
            >
              Group Name
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="groupName"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              type="text"
              autoComplete="off"
              name="groupName"
              required
            />
          </div>
        </div>
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full px-3">
            <label
              className="block uppercase tracking-wide text-gray-700 text-sm font-bold mb-2"
              for="category"
            >
              Category
            </label>
            <div className="relative">
              <select
                className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="category"
                value={category}
                name="category"
                onChange={(e) => setCategory(e.target.value)}
              >
                <option>Select</option>
                <option>Institutes</option>
                <option>Higher Education</option>
                <option>Exam Guidance</option>
                <option>Career Guidance</option>
                <option>Other</option>
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
          htmlFor="description"
          className="block uppercase tracking-wide text-gray-700 text-sm font-bold mb-2"
        >
          Group Description
        </label>
        <textarea
          rows="4"
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          type="text"
          name="description"
          autoComplete="off"
          className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-5 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
        ></textarea>
        <label
          className="block uppercase tracking-wide text-gray-700 text-sm font-bold mb-2"
          for="grid-state"
        >
          Add a Cover Photo
        </label>
        <input type="file" ref={file_input_ref} />
        <div className="place-self-end text-right">
          <button
            className="bg-blue-500 text-white font-bold mb-10 py-2 px-4 border border-blue-700 rounded mt-4 w-36"
            type="submit"
          >
            Create Group
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateGroup;
