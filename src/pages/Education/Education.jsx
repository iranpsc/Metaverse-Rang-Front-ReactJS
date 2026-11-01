import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLocation } from "react-router";
import styled from "styled-components";
import Content from "./Content";
import Footer from "./Footer";
import Header from "../../components/Education/Header";
import Video from "./Video";

const DraggableContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.newColors.otherColors.menuBg};
  border-radius: 10px;
  padding: ${({ $size }) => ($size ? "0" : "15px 20px 8px 20px")};
  z-index: 2147483647;
  position: fixed;
  top: ${({ $position }) => $position.y}px;
  left: ${({ $position }) => $position.x}px;
  width: 550px;
  cursor: ${({ $dragging }) => ($dragging ? "grabbing" : "grab")};
`;

const Education = ({ setOpenEducation, adviserData }) => {
  const [size, setSize] = useState(false);
  const [show, setShow] = useState(false);
  const { pathname } = useLocation();
  const [position, setPosition] = useState({
    x: pathname === "/profit" || pathname === "/challenge" ? -200 : 40,
    y: 0,
  });
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const draggableRef = useRef(null);

  const startDrag = (clientX, clientY) => {
    const rect = draggableRef.current.getBoundingClientRect();
    setOffset({ x: clientX - rect.left, y: clientY - rect.top });
    setDragging(true);
  };

  const moveDrag = (clientX, clientY) => {
    setPosition({ x: clientX - offset.x, y: clientY - offset.y });
  };

  const stopDrag = () => setDragging(false);

  const handleMouseDown = (e) => {
    startDrag(e.clientX, e.clientY);
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (!dragging) return;
    moveDrag(e.clientX, e.clientY);
    e.preventDefault();
  };

  const handleTouchStart = (e) => {
    const { clientX, clientY } = e.touches[0];
    startDrag(clientX, clientY);
    e.preventDefault();
  };

  const handleTouchMove = (e) => {
    if (!dragging) return;
    const { clientX, clientY } = e.touches[0];
    moveDrag(clientX, clientY);
    e.preventDefault();
  };

  return createPortal(
    <DraggableContainer
      $size={size}
      $position={position}
      $dragging={dragging}
      ref={draggableRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={stopDrag}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={stopDrag}
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
    </DraggableContainer>,
    document.body,
  );
};

export default Education;
