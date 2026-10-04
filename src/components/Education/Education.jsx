import { useRef, useState } from "react";
import styled from "styled-components";
import Content from "./Content";
import Footer from "./Footer";
import Header from "./Header";
import Video from "./Video";
import { useLocation } from "react-router";

const DraggableContainer = styled.div`
  background-color: ${(props) =>
    props.theme.colors.newColors.otherColors.menuBg};
  border-radius: 10px;
  padding: ${(props) => (props.size ? "0" : "15px 20px 8px 20px")};
  z-index: 999;
  position: absolute;
  top: ${(props) => props.position.y}px;
  left: ${(props) => props.position.x}px;
  width: 550px;
  cursor: ${(props) => (props.dragging ? "grabbing" : "grab")};
`;

const Education = ({ setOpenEducation, adviserData }) => {
  const [size, setSize] = useState(false);
  const [show, setShow] = useState(false);
  const location = useLocation();
  const path = location.pathname;
  const [position, setPosition] = useState({
    x: path === "/profit" ? -200 : path === "/challenge" ? -200 : 40,
    y: 0,
  });
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const draggableRef = useRef(null);

  const handleMouseDown = (e) => {
    setDragging(true);
    const offsetX = e.clientX - draggableRef.current.offsetLeft;
    const offsetY = e.clientY - draggableRef.current.offsetTop;
    setOffset({ x: offsetX, y: offsetY });
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (dragging) {
      const newX = e.clientX - offset.x;
      const newY = e.clientY - offset.y;
      setPosition({ x: newX, y: newY });
      e.preventDefault();
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  const handleTouchStart = (e) => {
    setDragging(true);
    const touch = e.touches[0];
    const offsetX = touch.clientX - draggableRef.current.offsetLeft;
    const offsetY = touch.clientY - draggableRef.current.offsetTop;
    setOffset({ x: offsetX, y: offsetY });
    e.preventDefault();
  };

  const handleTouchMove = (e) => {
    if (dragging) {
      const { clientX, clientY } = e.touches[0];
      setPosition({
        x: clientX - offset.x,
        y: clientY - offset.y,
      });
      e.preventDefault();
    }
  };

  const handleTouchEnd = () => {
    setDragging(false);
  };

  return (
    <DraggableContainer
      $size={size}
      position={position}
      dragging={dragging}
      ref={draggableRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {!size && (
        <Header
          show={show}
          setSize={setSize}
          setOpenEducation={setOpenEducation}
        />
      )}
      <Video
        setSize={setSize}
        size={size}
        show={show}
        video={adviserData?.video}
      />
      {!size && (
        <>
          <Content show={show} setShow={setShow} data={adviserData} />
          <Footer show={show} data={adviserData} />
        </>
      )}
    </DraggableContainer>
  );
};

export default Education;
