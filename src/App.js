import React, { useEffect, useMemo, useState } from "react";
import useStatus from "useStatus";
// import delay from "utils/delay";
import "./App.css";

function App() {
  const {
    state: { data: src, error: errorFetchDog },
    status: statusFetchDog,
    request: requestFetchDog,
    receive: receiveFetchDog,
    fail: failFetchDog
  } = useStatus();

  const [updating, setUpdating] = useState(false);

  const {
    state: { error: errorImg },
    status: statusImg,
    request: requestImg,
    receive: receiveImg,
    fail: failImg
  } = useStatus();

  const containerClass = useMemo(() => {
    if (statusImg.isLoading) {
      return "container loading";
    }
    return "container";
  }, [statusImg]);

  async function fetchDog() {
    const url = "https://dog.ceo/api/breeds/image/random";

    try {
      const json = await fetch(url).then(res => res.json());

      const { message } = json;

      requestImg();
      receiveFetchDog(message);
    } catch (error) {
      console.log("❌", error);
      failFetchDog(error);
    }
  }

  useEffect(() => {
    requestFetchDog();
    fetchDog();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleNextDog() {
    setUpdating(true);
    await fetchDog();
    setUpdating(false);
  }

  function handleImgOnLoad() {
    console.log("img is completed! 🌄");
    receiveImg();
  }

  function handleImgOnError() {
    failImg(new Error("Whoops, dog is missing"));
  }

  if (statusFetchDog.isLoading) {
    return "loading...";
  }

  if (statusFetchDog.isRejected) {
    return errorFetchDog?.message || null;
  }

  if (statusFetchDog.isResolved) {
    let imgContent = (
      <img
        alt="dog"
        src={src}
        onLoad={handleImgOnLoad}
        onError={handleImgOnError}
      />
    );

    if (statusImg.isRejected) {
      imgContent = errorImg?.message || null;
    }

    let nextBtn = null;

    // 不是isPending状态下都显示
    if (!statusImg.isPending) {
      let btnText = "next dog";
      if (statusImg.isRejected) {
        btnText = "retry";
      }
      nextBtn = (
        <div className="next-btn-wrap">
          <button onClick={handleNextDog} disabled={updating}>
            {updating ? "waiting" : btnText}
          </button>
        </div>
      );
    }

    return (
      <>
        {nextBtn}
        <div className={containerClass}>{imgContent}</div>
      </>
    );
  }

  return null;
}

export default App;
