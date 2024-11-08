import styled from "styled-components";
import { FurryFriend } from "./useGetImgCards";

type SelectFurryProps = {
  value: FurryFriend
  onChange: (value: FurryFriend) => void
};

const SelectFurryContainer = styled.div`
  margin: 4px 0;
`;

const FurryLabel = styled.label`
  margin-right: 10px;
`

const SelectFurryStyled = styled.select`
  height: 100%;
  width: 100px;
  text-align: center;
`;

export const SelectFurry = ({ value, onChange}: SelectFurryProps) => {
  return <SelectFurryContainer>
      <FurryLabel>Furry:</FurryLabel>
      <SelectFurryStyled value={value} onChange={(evt) => onChange(evt.target.value as FurryFriend)}>
      {Object.values(FurryFriend).map(key => (
        <option key={key} value={key}>
          {key}
        </option>
      ))}
    </SelectFurryStyled>
  </SelectFurryContainer>
}