import envalid from "envalid";

const { str } = envalid;

export default envalid.cleanEnv(process.env, {
  REACTION_ADMIN_PUBLIC_ACCOUNT_REGISTRATION_URL: str({ devDefault: "http://localhost:4080" })
}, {
  dotEnvPath: null
});
