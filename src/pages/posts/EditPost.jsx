import React, { useEffect, useRef, useState } from "react";
import { getStorage, ref, deleteObject } from "firebase/storage";
import { uploadFile } from "../../firebase";
import { genRandFileName } from "../../utils/random";
import { IoCloseSharp } from "react-icons/io5";
import { RiImageAddLine } from "react-icons/ri";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import NavBar from "./../../components/Navbar/Navbar";
import Footer from "../../components/Navbar/Footer";
import LoadingMod from "./loadingModal";
import cover from "../../images/post.png";
import { API_ENDPOINT } from "../../config";
import DOMPurify from "dompurify";

function EditPost() {
  const myRefname = useRef(null);
  const [selectedfile, setSelectedfile] = useState(null);
  const [selectedfileIndex, setSelectedfileIndex] = useState(-1);
  const [imagesList, setimagesList] = useState([]);
  const [imagesUrlList, setImagesUrlList] = useState([]);
  const [imagesUrls, setImagesUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const post = useSelector((state) => state.post).selectedPost;
  const [postId, setPostId] = useState(undefined);
  const [contentText, setContentText] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (post) {
      setPostId(post._id);
      setContentText(post.contentText);
      setImagesUrls(post.images);
      let data = [];
      let dataUrls = [];
      post.images.forEach((image) => {
        data.push(image[0]);
        dataUrls.push(image[1]);
      });
      setimagesList(data);
      setImagesUrlList(dataUrls);
    }
  }, [post]);

  function handleChange(e) {
    console.log(e.target.files);

    let temUrlparr = [...imagesUrlList];
    temUrlparr.unshift(URL.createObjectURL(e.target.files[0]));
    setImagesUrlList(temUrlparr);

    let temparr = [...imagesList];
    temparr.unshift(e.target.files[0]);
    setimagesList(temparr);

    setSelectedfile(URL.createObjectURL(e.target.files[0]));
    setSelectedfileIndex(0);
  }

  const handleClick = () => {
    myRefname.current.click();
  };

  function imgClicked(index) {
    setSelectedfile(imagesUrlList[index]);
    setSelectedfileIndex(index);
  }

  function imgRemoveClicked() {
    let temparr = [...imagesUrlList];
    let tempar2 = [...imagesList];
    temparr.splice(selectedfileIndex, 1);
    tempar2.splice(selectedfileIndex, 1);
    if (temparr.length === 0) {
      setSelectedfile(null);
      setSelectedfileIndex(-1);
    } else {
      setSelectedfile(temparr[0]);
      setSelectedfileIndex(0);
    }

    setImagesUrlList(temparr);
    setimagesList(tempar2);
  }

  async function deleteOldPhotos(name) {
    const storage = getStorage();

    // Create a reference to the file to delete
    const desertRef = ref(storage, `test/${name}`);

    // Delete the file
    deleteObject(desertRef)
      .then(() => {
        console.log(name + " deleted");
      })
      .catch((error) => {
        console.log(name + " not deleted");
      });
  }
  async function sendData(e) {
    e.preventDefault();
    setLoading(true);
    // if (!validations()) return 0;
    let newImagesUrls = [];
    let newImageList = imagesList;
    let count = 0;
    imagesUrls.forEach((image) => {
      let val = newImageList.indexOf(image[0]);
      if (val === -1) {
        console.log(
          image[0] + " !!!!!!!!!" + imagesList[0] + " not found! gonna delete!"
        );
        deleteOldPhotos(image[0]);
      } else {
        console.log(image + " found! gonna add");
        newImagesUrls.push(imagesUrls[count]);
        newImageList.splice(val, 1);
      }
      count = count + 1;
    });
    // setLoading(true);
    let newArray = newImageList.map((image) =>
      uploadFile(image, genRandFileName(), "test")
    );
    let fileDetails = await Promise.all(newArray);
    console.log(fileDetails);
    fileDetails.forEach((item) => {
      newImagesUrls.push(item);
    });
    console.log("newImagesUrls", newImagesUrls);
    const newItem = {
      contentText : DOMPurify.sanitize(contentText),
      images: newImagesUrls,
    };
    console.log(newItem);
    fetch(`${API_ENDPOINT}/api/post/posts/${postId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newItem),
    })
      .then((response) => response.json())
      .then((data) => {
        navigate(-1);
      })
      .catch((error) => console.error(error));
  }
  return (
    <>
      <NavBar />
      <div>
        <div className="w-full mb-4 text-3xl font-bold text-center mt-8">
          Update your post
        </div>
        {/* image upload and inputs set */}
        <div className="flex items-center justify-center mb-10">
          <div
            className="w-5/6 flex flex-wrap  2xl:flex-row items-center justify-center bg-gray-100 pt-12 rounded-xl bg-left-bottom bg-center bg-no-repeat "
            style={{
              backgroundImage: `url(${cover})`,
              backgroundSize: "17%",
              backgroundPosition: "left bottom",
            }}
          >
            {/* image upload */}
            <div className=" w-[600px] m-8 flex flex-row ">
              {/* selected image */}
              <div
                className={
                  "relative w-[330px] h-[415px] overflow-hidden ml-14 border-2 flex flex-row justify-center items-center " +
                  (selectedfileIndex === -1 ? "border-dashed" : "border-solid")
                }
              >
                {selectedfileIndex !== -1 && (
                  <img
                    src={selectedfile}
                    className={
                      "w-[330px]" +
                      (selectedfileIndex === -1 ? "hidden" : "inline")
                    }
                    alt="selected cloath"
                  />
                )}
                <span
                  onClick={imgRemoveClicked}
                  className={
                    "absolute top-2 right-2 bg-gray-50/75 rounded-sm cursor-pointer hover:bg-gray-50" +
                    (selectedfileIndex === -1 ? "hidden" : "block")
                  }
                >
                  <IoCloseSharp
                    className={selectedfileIndex === -1 ? "hidden" : "block"}
                    color="black"
                  />
                </span>
                <span
                  className={
                    "text-zinc-500 w-full text-center " +
                    (selectedfileIndex === -1 ? "block" : "hidden")
                  }
                >
                  Selected image will be displayed here
                </span>
              </div>

              {/* image list */}
              <div className="h-[470px] w-[134px] flex flex-col">
                <div
                  className={
                    " h-[268px] w-[134px] snap-y overflow-x-hidden mb-2 mx-5 ml-5" +
                    (selectedfileIndex === -1
                      ? "overflow-y-hidden overflow-hidden"
                      : "overflow-y-scroll")
                  }
                >
                  {imagesUrlList.map((imgItem, index) => (
                    <div
                      key={index}
                      onClick={() => imgClicked(index)}
                      className="mb-5 w-[130px] hover:cursor-pointer flex flex-row items-center overflow-hidden"
                    >
                      <img src={imgItem} alt={index + " items"} />{" "}
                    </div>
                  ))}
                </div>

                <div
                  className="hover:cursor-pointer mx-5 mt-2 w-[130px] h-[130px] border-dashed border-2 flex flex-col justify-center items-center"
                  onClick={handleClick}
                >
                  <input
                    ref={myRefname}
                    className="hidden"
                    type="file"
                    accept="image/png, image/jpeg"
                    onChange={handleChange}
                  />
                  <RiImageAddLine color="gray" className="h-10 w-10" />
                  <span className="text-sm text-zinc-500">Add New Image</span>
                </div>
              </div>
            </div>
            {/* input field set */}
            <div className="flex flex-col">
              <div className="flex flex-col">
                <div className="mb-6">
                  <label
                    for="first_name"
                    class="block ml-2 mb-2 text-gray-900 dark:text-gray-300 font-bold text-md"
                  >
                    Description
                  </label>
                  <textarea
                    type="text"
                    id="first_name"
                    name="descrition"
                    class=" border-2 align-middle h-32 border-gray-300 text-gray-900  rounded-lg focus:outline-none block w-96 p-2.5 dark:placeholder-gray-400 text-black dark:focus:outline-none text-md"
                    placeholder="Description"
                    value={contentText}
                    onChange={(e) => setContentText(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end items-end">
                <div className="flex flex-row">
                  <div
                    onClick={() => {
                      navigate(-1);
                    }}
                    className="bg-gray-500 h-10 w-32 rounded hover:cursor-pointer hover:bg-gray-700 active:gray-800 flex flex-row justify-center items-center mr-4  mb-20 text-white text-center"
                  >
                    CANCLE
                  </div>
                  <input
                    onClick={(e) => sendData(e)}
                    type="submit"
                    value={"UPDATE"}
                    className="bg-blue-500 text-white h-10 w-32 cursor-pointer hover:bg-blue-600 active:blue-700 rounded mb-20 "
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        {loading && <LoadingMod />}
        <Footer />
      </div>
    </>
  );
}

export default EditPost;
