import axios from "axios";



const signUpAPI = async (user) => {
  const api = axios.create({baseURL: "http://api.nocodi.ir"})
  const response = await api.post(
    "/iam/signup/",
    user
  );

  if (response.status !== 201) {
    console.log(response.status);
    throw response.status;
  }
  console.log(response.status);

};

export default signUpAPI;