import { ReactElement } from "react";
import styled from "styled-components";

const MsgContainer = styled.div`
  position:absolute;
  top:0;
  left:0;
  right:0;
  bottom:0;
  background-color: rgba(220,220,220, 0.7);
  z-index:9999;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MsgBody = styled.div`
  color: black;
  font-size: 2rem;
  background-color: lightgreen;
  border-radius: 2px;
  padding: 1rem;
`

type MsgProps = {
  show: boolean
  children: ReactElement
}

export const Msg = (props: MsgProps) => {
  if (!props.show) {
    return null;
  }

  return <MsgContainer>
    <MsgBody>
      {props.children}
    </MsgBody>
  </MsgContainer>
}