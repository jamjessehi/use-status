import React, { useEffect, useState } from "react";
import useStatus from "useStatus";
import classNames from "classnames";
import delay from "utils/delay";
import "./App.css";

const randomError = (n = 0.5) => Math.random() < n;

function App() {
  const {
    state: { data: src, error: errorFetchDog },
    status: statusFetchDog,
    request: requestFetchDog,
    receive: receiveFetchDog,
    fail: failFetchDog,
    init: initFetchDog
  } = useStatus();

  const {
    state: { error: errorImg },
    status: statusImg,
    request: requestImg,
    receive: receiveImg,
    fail: failImg,
    init: initImg
  } = useStatus();

  const [retry, setRetry] = useState(0);

  async function fetchDog() {
    const url = randomError()
      ? "https://dog.ceo/api/breeds/image/random"
      : "https://no";

    try {
      await delay(3000);
      const json = await fetch(url).then(res => res.json());

      let { message } = json;

      if (randomError()) {
        throw new Error("server's data is wrong!");
      }

      if (randomError()) {
        message = "no"; // 改变 让 img url 无效, 从而除非 onError
      }

      return message;
    } catch (error) {
      throw error;
    }
  }

  useEffect(() => {
    requestFetchDog();
    fetchDog()
      .then(data => {
        receiveFetchDog(data);
        requestImg();
      })
      .catch(error => {
        failFetchDog(error);
        failImg(error);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [retry]);

  function handleNextDog() {
    initFetchDog();
    initImg();
    setRetry(retry + 1);
  }

  function handleImgOnLoad() {
    receiveImg();
  }

  function handleImgOnError() {
    failImg(new Error("Whoops, invalid image or image is loading error"));
  }

  if (statusFetchDog.isLoading && retry === 0) {
    return "loading...";
  }

  return (
    <>
      <NextBtn
        retry={retry}
        isLoading={statusFetchDog.isLoading || statusImg.isLoading}
        isRejected={statusFetchDog.isRejected || statusImg.isRejected}
        handleNextDog={handleNextDog}
      />
      <Img
        src={src}
        onLoad={handleImgOnLoad}
        onError={handleImgOnError}
        isLoadingImg={statusImg.isLoading}
        isLoadingFetchDog={statusFetchDog.isLoading}
        isResolvedFetchDog={statusFetchDog.isResolved}
        isRejectedImg={statusImg.isRejected}
        isRejectedFetchDog={statusFetchDog.isRejected}
      />
      <ErrorContent error={errorFetchDog || errorImg} />
    </>
  );
}

function NextBtn({ isLoading, retry, isRejected, handleNextDog }) {
  if (isLoading && retry === 0) {
    return null;
  }

  let btnText = "next dog";

  if (isRejected) {
    btnText = "retry";
  }

  return (
    <div className={classNames("next-btn-wrap", { failed: isRejected })}>
      <button onClick={handleNextDog} disabled={isLoading}>
        {isLoading ? "waiting" : btnText}
      </button>
    </div>
  );
}

function Img({
  isLoadingFetchDog,
  isLoadingImg,
  isResolvedFetchDog,
  isRejectedFetchDog,
  isRejectedImg,
  ...imgProps
}) {
  if (isLoadingFetchDog) {
    return null;
  }

  if (isRejectedFetchDog || isRejectedImg) {
    return null;
  }

  return (
    <div className={classNames("img-wrap", { loading: isLoadingImg })}>
      {isResolvedFetchDog && <img alt="dog" {...imgProps} />}
    </div>
  );
}

function ErrorContent({ error }) {
  if (error?.message) {
    return <div className={classNames("error-wrap")}>{error?.message}</div>;
  }
  return null;
}

export default App;
