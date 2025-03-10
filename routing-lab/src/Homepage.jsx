import { ImageEditForm } from "./images/ImageEditForm.jsx";
import PropTypes from "prop-types";

export function Homepage(props) {
  return (
    <>
      <h2>Welcome, {props.userName}</h2>
      <p>This is the content of the home page.</p>
      <ImageEditForm authToken = {props.authToken}/>
    </>
  );
}

Homepage.propTypes = {
  userName: PropTypes.string,
  authToken: PropTypes.string,
};