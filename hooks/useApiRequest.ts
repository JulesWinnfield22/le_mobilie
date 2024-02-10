import { useState, createContext, useContext, Context } from "react";

export function useApiRequest(provideValues = true) {
  const [response, setResponse] = useState<any>();
  const [pending, setPending] = useState<boolean>(false);
  const [error, setError] = useState("");

  function send(
    request = (f?: any) => f,
    cb = (f?: any) => f,
    remove = false,
    beforeResolve = false) {
    if (typeof request != "function")
      return console.error("can not be called. not a function");

    setPending(true);
    setError("");

    if (remove) {
      setResponse(null);
    }

    try {
      request().then((res: any) => {

        if(beforeResolve) cb(res)

        setTimeout(() => {
          setPending(false)
          if (!(typeof cb == "function")) return;
          if (res.success) {
            setResponse(res.data)
          } else {
            setError(res.error)
            setResponse(res.data)
          }
          cb(res);
        }, 1000);
      });
    } catch (err: any) {
      setPending(false)
      setError(err.message)
    }
  }

  return {
    pending,
    error,
    response,
    send
  }  
}
