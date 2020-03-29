import React, { useEffect, useMemo } from "react";
import useStatus from "useStatus";
// import delay from "utils/delay";
import "./App.css";

export default () => {
  const {
    data: src,
    error: errorFetchDog,
    pending: pendingFetchDog,
    resolve: resolveFetchDog,
    reject: rejectFetchDog,
    status: statusDog
  } = useStatus();

  const {
    pending: pendingImg,
    resolve: resolveImg,
    reject: rejectImg,
    status: statusImg,
    error: errorImg
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

      pendingFetchDog();

      try {
        const json = await fetch(url).then(res => res.json());

        const { url: imgUrl } = json;

        pendingImg();
        resolveFetchDog(imgUrl);
      } catch (error) {
        console.log("❌", error);
        rejectFetchDog(error);
      }
    };

    fetchDog();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleImgOnLoad() {
    console.log("img is completed! 🌄");
    resolveImg();
  }

  function handleImgOnError() {
    rejectImg("Whoops, dog is missing");
  }

  if (statusDog.isLoading) {
    return "loading...";
  }

  if (statusDog.isRejected) {
    return errorFetchDog?.message || null;
  }

  if (statusDog.isResolved) {
    let imgContent = (
      <img
        alt="dog"
        src={src}
        onLoad={handleImgOnLoad}
        onError={handleImgOnError}
      />
    );

    if (statusImg.isRejected) {
      imgContent = errorImg;
    }

    return <div className={containerClass}>{imgContent}</div>;
  }

  return null;
};
