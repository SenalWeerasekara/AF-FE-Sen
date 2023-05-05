import { useParams } from "react-router";
import { useState, useEffect } from "react";
import axios from "axios";

import GroupPosts from "../../posts/GroupPosts";
import Posts from "./Posts";
import Question from "./Questions";
import GroupQuestions from "../../questions/groupQuestions";
import GetCurrentUser from "../../../hooks/getCurrentUser";

function CustTwoTab(props) {
  const user = GetCurrentUser();
  const id = user?._id;
  const [ShowTab, setShowTab] = useState("post");
  const [postButtonColor, setPostButtonColor] = useState("#007BED");
  const [quesButtonColor, setQuesButtonColor] = useState("#2b2b2b");
  const [rc, setRc] = useState("#007aed55");
  const [qc, setQc] = useState("#f1f1f1");

  const postButton = () => {
    setShowTab("post");
    setPostButtonColor("#007BED");
    setQuesButtonColor("#2b2b2b");
    setRc("#007aed55");
    setQc("#f1f1f1");
  };

  const quesButton = () => {
    setShowTab("ques");
    setPostButtonColor("#2b2b2b");
    setQuesButtonColor("#007BED");
    setRc("#f1f1f1");
    setQc("#007aed55");
  };

  /////////// read post data

  const [PostList, setPostList] = useState(null);

  const { _id } = useParams();

  //get all groups
  useEffect(() => {
    const response = axios.get(
      `http://localhost:3002/api/post/groups/${_id}/posts`
    );
    setPostList([response.data]);
    console.log([response.data]);
  }, []);

  return (
    <div>
      <div className="pt-2 w-full items-center flex items-center justify-center ">
        <div className="flex grid-flow-row w-4/6   pb-10 ">
          <div
            className="w-full text-xl flex items-center justify-center font-bold bg-red-400 p-4 border-solid border-b-4"
            style={{ color: postButtonColor, borderColor: rc , backgroundColor : rc}}
            onClick={postButton}
          >
            Posts
          </div>
          <div
            className="w-full text-xl font-bold flex items-center justify-center p-4 border-solid border-b-4 pl-2"
            style={{ color: quesButtonColor, borderColor: qc,  backgroundColor : qc}}
            onClick={quesButton}
          >
            Questions
          </div>
        </div>
      </div>

      <div className=" p-0 w-full bg-orange-00 flex flex-col">
        {ShowTab === "post" ? (
          <GroupPosts />
        ) : (
          <GroupQuestions groupData={props.groupName} profileID={id} />
        )}
        {/* {ShowTab === "post" ? " ": <GroupQuestions groupData={props.groupName}/>} */}
      </div>
    </div>
  );
}

export default CustTwoTab;
