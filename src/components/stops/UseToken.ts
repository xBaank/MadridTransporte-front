import {useEffect, useState} from "react";
import {token as tokenFCM} from "../../notifications";

export default function useToken() {
  const [token, setToken] = useState<string>();
  useEffect(() => {
    if (tokenFCM !== undefined) setToken(tokenFCM);
  });
  return token;
}
