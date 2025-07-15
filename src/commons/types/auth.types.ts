export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "admin" | "user";
};

export type JWTInputType = {
  name: string;
  email: string;
  role: "admin" | "user";
};
export type JWTOutputType = {
  token: string;
};
export type DecodedUserType = {
  name: string;
  email: string;
  role: "admin" | "user";
};
