import after from "lodash/after";
import { useCallback } from "react";

export enum FurryFriend {
  dog = "Dog",
  cat = "Cat"
};

export type ImageCard = {
  url: string
  id: string
}

type useGetImgCardsOpt = {
  furryFriend: FurryFriend
};

type getImgCardsResult = {
  images: ImageCard[]
  total: number
};

const getApiUrl = (furryFriend: FurryFriend) => {
  if (furryFriend === FurryFriend.cat) {
    return 'https://api.thecatapi.com/'
  } else {
    return 'https://api.thedogapi.com/'
  }
}

export const useGetImgCards = () => {
  const getImgs = useCallback(({ furryFriend }: useGetImgCardsOpt): Promise<getImgCardsResult> => {
    return new Promise(async (resolve) => {
      const response = await fetch(`${getApiUrl(furryFriend)}v1/images/search?limit=8`)
      const images = await response.json()
      const allLoaded = after(images.length, () => {
        resolve({
          images,
          total: images.length
        });
      });

      for (let image of images) {
        const img = new Image();
        img.onload = allLoaded;
        img.src = image.url;
      }
    });

  }, []);

  return getImgs;
}