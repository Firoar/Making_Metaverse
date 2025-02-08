import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import TagsComponent from "./TagsComponent";
import classes from "./codingContest.module.css";
import { notify } from "../../../../utils/toasts.js";
import axios from "axios";
import { ThreeDots } from "react-loader-spinner";

const GiveMeAQuestion = () => {
  const { playerLeetcodeUsername } = useSelector((state) => state.movement);
  const [tags, setTags] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [questionFound, setQuestionFound] = useState(false);

  const randomIndex = () => {
    return Math.floor(Math.random() * 10);
  };
  const clickedGiveMeAQuestion = async () => {
    try {
      if (currentQuestion) setLoading(true);

      let URL = `${import.meta.env.VITE_LEETCODE_URL}problems`;

      if (tags.length > 0) {
        URL += `?tags=${tags.join("+")}&limit=10`;
      } else {
        URL += "?limit=10";
      }

      const response = await axios.get(URL);

      if (response.data.problemsetQuestionList.length > 0) {
        setCurrentQuestion(response.data.problemsetQuestionList[randomIndex()]);
        setQuestionFound(true);
      } else {
        setCurrentQuestion("No questions found. Try with some other tags!!");
        setQuestionFound(false);
      }
    } catch (error) {
      notify("Error fetching a question. Try again later", "error");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const constructionQuestionlink = (info) => {
    if (info.titleSlug) {
      return `https://leetcode.com/problems/${info.titleSlug}/description/`;
    }
    return "";
  };

  const handleLinkClick = (e) => {
    if (!questionFound) {
      e.preventDefault();
    }
  };

  if (!playerLeetcodeUsername) return null;

  return (
    <div className={classes["givemequestion-div"]}>
      <h2>Leetcode Username : {playerLeetcodeUsername}</h2>
      <button
        className={classes["givemequestion-btn"]}
        onClick={clickedGiveMeAQuestion}
        disabled={loading}
      >
        {loading
          ? "Loading..."
          : currentQuestion
          ? "Give me another question"
          : "Give me a question"}
      </button>

      {loading ? (
        <ThreeDots
          visible={true}
          height="80"
          width="80"
          color="black"
          radius="9"
          ariaLabel="three-dots-loading"
        />
      ) : currentQuestion ? (
        <a
          className={classes["question-link"]}
          href={questionFound ? constructionQuestionlink(currentQuestion) : ""}
          target={questionFound ? "_blank" : ""}
          rel={questionFound ? "noopener noreferrer" : ""}
          onClick={handleLinkClick}
        >
          {questionFound ? "Question link!!!" : `${currentQuestion}`}
        </a>
      ) : null}

      <TagsComponent tags={tags} setTags={setTags} />
    </div>
  );
};

export default GiveMeAQuestion;
