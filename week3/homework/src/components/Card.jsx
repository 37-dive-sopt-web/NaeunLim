import { css, keyframes } from "@emotion/react";

export default function Card({
    id,
    value,
    isFlipped, // 카드가 뒤집혔을 때
    isMatched,// 카드 두 장이 매치되었을 때
    disabled, // 두 장을 이미 뒤집었을 때, 다른 카드의 클릭을 막음
    onClick,
}) {
    const handleClick = () => {
        if (disabled) return; // 카드가 잠긴 경우 무시
        if (isMatched) return; // 이미 매치된 카드인 경우 무시
        onClick?.(id);
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            disabled={disabled}
            css={cardButton(isFlipped, isMatched, disabled)}
            title={id}
        >
            <div css={cardInner(isFlipped)}>
                <div css={cardFaceFront(isMatched, isFlipped)}> {value} </div>
                <div css={cardFaceBack}> ? </div>
            </div>
        </button>
    );
    
}

const flipIn = keyframes`
  from { transform: rotateY(180deg); }
  to   { transform: rotateY(0deg); }
`;

const flipOut = keyframes`
  from { transform: rotateY(0deg); }
  to   { transform: rotateY(180deg); }
`;

const cardButton = (isFlipped, isMatched, disabled) => css`
    position: relative;
    display: block;
    overflow: hidden;
    width: 7rem;
    height: 7rem;
    border: none;
    cursor: ${disabled ? "not-allowed" : "pointer"};
    background: none;
`;

// 카드 전체의 회전을 위한 Wrapper
const cardInner = (isFlipped) => css`
    width: 100%;
    height: 100%;
    transform-style: preserve-3d;
    transition: transform 0.25s ease-int-out;
    transform: ${isFlipped ? "rotateY(0deg)" : "rotateY(180deg)"};
    animation: ${isFlipped ? flipIn : flipOut} 0.25s ease-in-out;
`;

// 공통 카드 스타일
const baseFace = () => css`
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    border-radius: 1rem;
    font-size: 1rem;
    font-weight: bold;
    backface-visibility: hidden;
`;

const cardFaceFront = (isMatched, isFlipped) => css`
    ${baseFace()};
    transform: rotateY(0deg);
    background-color: ${isMatched ? "#006B35" : isFlipped ? "none" : "#24D59E"};
    border: ${isFlipped ? "1px solid gray" : "none"};
    color: ${isMatched ? "white" : "black"};
`;

const cardFaceBack = css`
    ${baseFace()};
    transform: rotateY(180deg);
    background-color: #24D59E;
    color: white;
`;