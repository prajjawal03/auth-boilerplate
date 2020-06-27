import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  USER_LOADED,
  AUTH_FAIL,
} from "./types";
import axios from "axios";
import { setAlert } from "./alert";
export const loadUser = () => async (dispatch) => {
  if (localStorage.token) {
    axios.defaults.headers.common["x-auth-token"] = localStorage.token;
  } else {
    delete axios.defaults.headers.common["x-auth-token"];
  }
  try {
    const res = await axios.get("http://localhost:5000/auth");
    dispatch({
      type: USER_LOADED,
      payload: res.data,
    });
  } catch (err) {
    console.error(err.message);
    dispatch({
      type: AUTH_FAIL,
    });
  }
};
export const register = ({ name, email, password }) => async (dispatch) => {
  const config = {
    headers: {
      "content-Type": "application/json",
    },
  };
  const body = JSON.stringify({ name, email, password });
  try {
    const res = await axios.post("http://localhost:5000/user", body, config);
    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data,
    });
    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }
    dispatch({
      type: REGISTER_FAIL,
    });
  }
};
export const login = ({ email, password }) => async (dispatch) => {
  const config = {
    headers: {
      "content-Type": "application/json",
    },
  };
  const body = JSON.stringify({ email, password });
  try {
    const res = await axios.post("http://localhost:5000/auth", body, config);
    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data,
    });
    dispatch(loadUser());
  } catch (err) {
    dispatch({
      type: LOGIN_FAIL,
    });
  }
};
