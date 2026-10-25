// انیمیشن لودینگ چرخشی 
import styled, { keyframes } from "styled-components";

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const SpinnerWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: ${(props) => (props.fullScreen ? "100%" : "100%")};
  width: 100%;
  gap: 5px;
`;

const SpinnerContainer = styled.div`
  width: ${(props) => {
    switch (props.size) {
      case "small":
        return "20px";
      case "large":
        return "48px";
      default:
        return "32px";
    }
  }};
  height: ${(props) => {
    switch (props.size) {
      case "small":
        return "20px";
      case "large":
        return "48px";
      default:
        return "32px";
    }
  }};
  position: relative;
`;

const Spinner = styled.div`
  width: 100%;
  height: 100%;
  border: 3px solid ${(props) => props.backgroundColor || "#f3f3f3"};
  border-top: 3px solid ${(props) => props.color || "#3498db"};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const LoadingText = styled.p`
  margin-top: 10px;
  color: ${(props) => props.textColor || "#666"};
  font-size: ${(props) => (props.size === "small" ? "12px" : "14px")};
`;

const LoadingSpinner = ({
  size = "medium",
  color = "#3498db",
  backgroundColor = "#f3f3f3",
  textColor = "#666",
  text = "  loading",
  fullScreen = false,
}) => {
  return (
    <SpinnerWrapper fullScreen={fullScreen}>
      {text && (
        <LoadingText size={size} textColor={textColor}>
          {text}
        </LoadingText>
      )}
      <SpinnerContainer size={size}>
        <Spinner color={color} backgroundColor={backgroundColor} />
      </SpinnerContainer>
    </SpinnerWrapper>
  );
};

export default LoadingSpinner;
