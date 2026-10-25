import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import shortid from "shortid";
import styled from "styled-components";

const Container = styled.div`
  height: 90.5%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const BtnContainer = styled.div`
  width: 17.6%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  background-color: ${(props) => props.theme.colors.primary};
  border-radius: 5px;
  padding: 15px 0;
`;

const MainContainer = styled.div`
  width: 80%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
`;

const BtnProperty = styled.button`
  border: none;
  width: 80%;
  height: 48px;
  background-color: transparent;
  font-weight: 600;
  font-size: 18px;
  color: ${(props) => props.theme.colors.primary};
  &.active {
    border-right: 2px solid ${(props) => props.theme.colors.primary};
    color: ${(props) => props.theme.colors.primary};
  }
`;

// const tabs = [
//     {name: 'کف قیمت', component: <p>hello world</p>}
// ]

// This is a custom hook named useActivity which takes two arguments
// `tabs`: an array of objects containing information about tabs and their corresponding components
// `style`: an object containing styles to be applied to the container

export default function useActivity(tabs, style) {
  const location = useLocation();
  const [activity, setActivity] = useState(location.state?.activeTab || 0);
  const [current, setCurrent] = useState(tabs[activity]?.component);

  useEffect(() => {
    setCurrent(tabs[activity]?.component);
  }, [activity]);
  return (
    <Container>
      <BtnContainer>
        {tabs.map((tab, index) => (
          <BtnProperty
            key={shortid.generate()}
            onClick={() => setActivity(index)}
            className={`${activity === index && "active"}`}
          >
            {tab.name}
          </BtnProperty>
        ))}
      </BtnContainer>
      <MainContainer style={{ ...style }}>{current}</MainContainer>
    </Container>
  );
}
