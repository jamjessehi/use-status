import React, { useEffect, useMemo } from "react";
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

  useEffect(() => {
    const fetchDog = async () => {
      const url = "https://random.dog/woof.json";

      requestFetchDog();

      try {
        const json = await fetch(url).then(res => res.json());

        const { url: imgUrl } = json;

        requestImg();
        receiveFetchDog(imgUrl);
      } catch (error) {
        console.log("❌", error);
        failFetchDog(error);
      }
    };

    fetchDog();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

    return <div className={containerClass}>{imgContent}</div>;
  }

  return null;
}

export default App;
