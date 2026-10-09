import { useSpring } from "@react-spring/web";
import { Container } from "./Styles";
import Header from "../Header/Header";
import { useLanguage } from "../../services/reducers/LanguageContext";
import { useScrollDirectionContext } from "../../services/reducers/ScrollDirectionContext";
const ModalPosition = ({ children, title, position, action }) => {
  const { isGlobalFullScreenMap } = useScrollDirectionContext();
  const springs = useSpring({
    from: { opacity: 0, transform: "scale(0.8)" },
    to: { opacity: 1, transform: "scale(1)" },
    config: { duration: 200 },
  });
  const isPersian = useLanguage();

  return (
    <Container
      position={position}
      style={springs}
      $isPersian={isPersian}
      $show={isGlobalFullScreenMap}
    >
      <Header title={title} action={action} />
      {children}
    </Container>
  );
};

export default ModalPosition;
