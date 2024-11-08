import styled from "styled-components"
import { AspectRatioBox } from "./AspectRatioBox"
import { ImageCard } from "./useGetImgCards"

const CardWrap = styled.div`
  padding: 1rem;
`

const CardInner = styled.div`
  background: #edede9;
  height: 100%;
  width: 100%;

  > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`
type CardProps = {
  flipped: boolean
  image: ImageCard
  onFlipped: () => void
}

export const Card = ({flipped, image, onFlipped}: CardProps) => {
  return <CardWrap onClick={() => !flipped && onFlipped()}>
    <AspectRatioBox>
      <CardInner>
        { flipped && <img src={image.url} /> }
      </CardInner>
    </AspectRatioBox>
  </CardWrap>
}
