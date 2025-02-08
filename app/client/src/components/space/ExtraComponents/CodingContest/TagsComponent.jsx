import React from "react";
import classes from "./codingContest.module.css";
import { slugData } from "../../../../assets/SlugData.js";

const TagsComponent = ({ setTags, tags }) => {
  const handleSelectTag = (ele) => {
    const alreadyPresent = tags.includes(ele.slug);
    if (alreadyPresent) {
      // Remove the tag if already selected
      setTags(tags.filter((tag) => tag !== ele.slug));
    } else {
      // Add the tag if not present
      setTags([...tags, ele.slug]);
    }
  };

  return (
    <div className={classes["tags-div"]}>
      {slugData.map((ele) => (
        <span
          key={ele.slug}
          onClick={() => handleSelectTag(ele)}
          className={`${classes["tags-span"]} ${
            tags.includes(ele.slug) ? classes["selectedTag"] : ""
          }`}
        >
          {ele.name}
        </span>
      ))}
    </div>
  );
};

export default TagsComponent;
