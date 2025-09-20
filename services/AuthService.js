import axios from "axios";

const API_URL = "http://localhost:8080/auth";

const login = (email, password) => {
  return axios.post(`${API_URL}/login`, {
    email,
    password
  });
};

const AuthService = {
  login,
};

export default AuthService;
