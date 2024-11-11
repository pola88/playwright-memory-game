import styled from "styled-components";
import { useEffect, useState } from "react";
import shuffle from "lodash/shuffle";

import { Card } from "./Card";
import { Msg } from "./Msg";
import { useGetImgCards, FurryFriend, ImageCard } from "./useGetImgCards";
import { SelectFurry } from "./SelectFurry";
import { Loading } from './Loading';

const GameContainer = styled.main`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const BodyGamer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;


const CardsContainer = styled.div<{$isLoading: boolean}>`
  height: 100%;
  flex-direction: row;
  flex-wrap: wrap;
  display: ${props => props.$isLoading ? 'none' : 'flex'};

  > * {
    flex-basis: 25%;
  }
`

const GameHeader = styled.div`
  display: flex;
  gap: 48px;
  > * {
    flex-basis: 50%;
  }
`;

const FooterGame = styled.div`
  display: flex;
  justify-content: center;
  padding: 20px;
`;

const Counter = styled.div`
`;

const RestartBtnContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const RestartButton = styled.button`
  background-color: #04AA6D;
  border: none;
  color: white;
  padding: 10px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 4px;
`;

const MsgBtn = styled.div`
  padding-top: 10px;
  display: flex;
  justify-content: center;
`;

const LoadingContainer = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
`;

type flippedCard = {
  cardId: number
  imageId: string
}

export const Game = () => {
  const [ currentFurryFriend, setCurrentFurryFriend ] = useState<FurryFriend>(FurryFriend.dog)
  const [ cards, setCards ] = useState<ImageCard[]>([])
  const [ counter, setCounter ] = useState<number>(0)
  const [ totalImages, setTotalImages ] = useState<number>(0)
  const [ isLoading, setIsLoading ] = useState<boolean>(true)
  const [ matchedCards, setMatchedCars ] = useState<string[]>([])
  const [ flippedCards, setFlippedCars ] = useState<flippedCard[]>([])

  const getImgCards = useGetImgCards();

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const { images, total } = await getImgCards({ furryFriend: currentFurryFriend});
      const newCards = [ ...images, ...images ]
      setIsLoading(false);
      setCards(shuffle(newCards))
      setTotalImages(total);
    })()
  }, [currentFurryFriend, getImgCards])

  const onFlipped = (imageId: string, cardId: number) => {
    flippedCards.push({ imageId, cardId });
    setFlippedCars([ ...flippedCards ])
    const [firstCard, secondCard] = flippedCards
    if (firstCard && secondCard) {
      setCounter(counter => counter + 1)
      if (firstCard.imageId === secondCard.imageId) {
        matchedCards.push(imageId)
        setMatchedCars([...matchedCards])
        setFlippedCars([])
      } else {
        setTimeout( () => {
          setFlippedCars([])
        }, 500)
      }
    } 
  }

  const handleFurryChange = (value: FurryFriend) => {
    restartGame()
    setCurrentFurryFriend(value);
  } 

  const restartGame = () => {
    setCounter(0)
    setMatchedCars([])
    setFlippedCars([])
    setCards(shuffle(cards))
  }

  return <GameContainer>
    <GameHeader>
      <RestartBtnContainer>
        <SelectFurry value={currentFurryFriend} onChange={handleFurryChange} />
      </RestartBtnContainer>
      <div>
        <RestartButton onClick={restartGame}>Restart</RestartButton>
      </div>
      
    </GameHeader>
    <BodyGamer>
      { isLoading && <LoadingContainer>
          <Loading />
        </LoadingContainer> }
      <CardsContainer data-testid="cards-container" $isLoading={isLoading}>
          { cards.map((image, i) => (
            <Card
              flipped={!!flippedCards.find( flippedCard => flippedCard.cardId === i) || matchedCards.indexOf(image.id) !== -1 }
              key={i}
              image={image}
              onFlipped={() => onFlipped(image.id, i)}
            />
          ))}
        </CardsContainer>
      <Msg show={!!totalImages && totalImages === matchedCards.length}>
        <>
          <div>
            Congrats! You Won!
          </div>
          <MsgBtn>
            <RestartButton onClick={restartGame}>Restart</RestartButton>
          </MsgBtn>
        </>
      </Msg>
    </BodyGamer>
    <FooterGame>
      <Counter data-testid="counter">Counter: {counter}</Counter>
    </FooterGame>
  </GameContainer>
}
