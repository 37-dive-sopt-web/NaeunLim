import { useEffect, useState, useRef } from "react";
import { buildDeck } from "../game/deck";
import { css } from "@emotion/react";
import Card from "../components/Card";
import { appendRanking } from "../ranking/rankingStorage";

export default function GamePage() {
    const TIME_LIMIT = 45;
    const LEVEL = 1;
    const startTimeRef = useRef(0);
    const restartTimeoutRef = useRef(null);

    const [deck, setDeck] = useState([]);
    const [flipped, setFlipped] = useState([]);
    const [matched, setMatched] = useState(new Set());
    const [lockCard, setLockCard] = useState(false);

    const timer = useRef(null);
    const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
    const [isPlaying, setIsPlaying] = useState(false);
    const [status, setStatus] = useState("idle") // idle, playing, win, lose
    const [history, setHistory] = useState([]);

    // 게임 초기화
    const startGame = () => {
        if(timer.current) {
            clearInterval(timer.current);
            timer.current = null;
        }

        if(restartTimeoutRef.current) {
            clearTimeout(restartTimeoutRef.current);
            restartTimeoutRef.current = null;
        }

        const newDeck = buildDeck(LEVEL);
        setDeck(newDeck);
        setFlipped([]);
        setMatched(new Set());
        setHistory([]);
        setTimeLeft(TIME_LIMIT);

        // 리셋 버튼으로 초기화 시, 타이머가 정상작동하지 않아
        // 한번 세팅을 멈춘 다음 다시 초기화했어요
        setIsPlaying(false);
        setStatus("idle");

        setTimeout(() => {
            setStatus("playing");
            setIsPlaying(true);
            startTimeRef.current = performance.now();
        }, 0);
        
    };

    // 게임 타이머
    useEffect(() => {
        if (!isPlaying) return;

        timer.current = setInterval(() => {
            setTimeLeft((prev) => {
                if(prev <= 1) {
                    clearInterval(timer.current);
                    timer.current = null;
                    setStatus("lose");
                    setIsPlaying(false);
                    return 0;
                }
                return prev-1;
            });
        }, 1000);

        return () =>{
            if(timer.current) {
                clearInterval(timer.current)
                timer.current = null;
            }
        } ;
    }, [isPlaying]);

    // 시간 포맷
    const formatTime = (sec) => {
        const m = Math.floor(sec/60);
        const s = sec%60;
        return `${String(m).padStart(2, "0")}: ${String(s).padStart(2, "0")}`;
    };

    // 카드 클릭 처리
    const handleCardClick = (id) => {
        if (lockCard) return; // 카드 두 장이 열려 있는 동안은 클릭 불가
        if (matched.has(id)) return; // 이미 매치된 카드인 경우 클릭 불가
        if (flipped.includes(id)) return; // 같은 카드인 경우 클릭 불가

        // flipped[0]과 flipped[1]의 value(숫자)가 같으면 매치 성공
        if (flipped.length === 0) {
            setFlipped([id]);
            return;
        }

        if (flipped.length === 1) {
            const firstId = flipped[0];
            const secondId = id;
            const firstCard = deck.find((card) => card.id === firstId);
            const secondCard = deck.find((card) => card.id === secondId);

            setFlipped([firstId, secondId]);
            setLockCard(true);

            if (firstCard.value === secondCard.value) {
                setMatched((prev) => {
                    const next = new Set(prev);
                    next.add(firstId);
                    next.add(secondId);
                    return next;
                });

                setHistory((prev) => [
                    { pair: [firstCard.value, secondCard.value], success: true, ts:Date.now() },
                    ...prev,
                ]);

                setTimeout(() => {
                    setFlipped([]);
                    setLockCard(false);
                }, 250);
                
            }
            else {
                setHistory((prev) => [
                    { pair: [firstCard.value, secondCard.value], success: false, ts: Date.now()},
                    ...prev,
                ]);

                setTimeout(() => {
                    setFlipped([]);
                    setLockCard(false);
                }, 400);
            }
        }
    };

    // 승리 조건 체크 및 기록
    useEffect(() => {
        if(deck.length>0 && matched.size === deck.length) {
            setStatus("win");
            setIsPlaying(false);
            clearInterval(timer.current);

            const clearedTime = Number((performance.now() - startTimeRef.current / 1000).toFixed(2));
            appendRanking({
                timeStamp: new Date().toString(), // 현재 시간
                level: LEVEL,
                clearedTime,
            })
        }
    }, [matched, deck]);

    // 승패 조건에 따른 메시지 출력, 게임 리셋
    useEffect(() => {
        if( status !== "win" && status !== "lose") return;
        const message = status === "win" 
            ? "축하합니다! 게임을 클리어하셨습니다."
            : "제한시간이 초과되었습니다.";

        alert(message);

        if(timer.current) {
            clearInterval(timer.current);
            timer.current = null;
        }
        setIsPlaying(false);

        restartTimeoutRef.current = setTimeout(() => {
            startGame();
        }, 3000);

        return () => {
            if(restartTimeoutRef.current) {
                clearTimeout(restartTimeoutRef.current);
                restartTimeoutRef.current = null;
            }
        };

     }, [status]);



    // 최초 시작
    useEffect(() => {
        startGame();
    }, []);


    // 리셋 버튼
    const handleButtonClick = () => {
        startGame();
    };

    return(
        <div css={gamePageWrapper}>

            <section css={gameBoard}>
                <div css={gameBoardHeader}>
                    <h3 css={gameBoardHeaderText}> 게임 보드 </h3>
                    <button
                        css={gameResetButton}
                        onClick={handleButtonClick}
                    >                        
                        게임 리셋
                    </button>
                </div>

                <div css={gameBoardCardDeck}>
                    {deck.map((card) => {
                        const isMatched = matched.has(card.id);
                        const isFlipped = isMatched || flipped.includes(card.id);

                        return (
                            <Card
                                key={card.id}
                                id={card.id}
                                value={card.value}
                                isFlipped={isFlipped}
                                isMatched={isMatched}
                                disabled={lockCard}
                                onClick={handleCardClick}
                            />
                        );
                    })}
                </div>
            </section>
            

            <section css={gameBoardInfo}>

               <div css={levelInfo}> level {LEVEL} </div> 

               <div css={progressInfoWrapper}>
                    <div css={progressInfo}>
                        <p css={progressInfoTitle}> 남은 시간 </p>
                        <p css={progressInfoText}> {formatTime(timeLeft)} </p>
                    </div>

                   <div css={progressInfo}>
                        <p css={progressInfoTitle}> 성공한 짝 </p>
                        <p css={progressInfoText}> {matched.size/2} </p>
                    </div>

                    <div css={progressInfo}>
                        <p css={progressInfoTitle}> 남은 짝 </p>
                        <p css={progressInfoText}> {(deck.length/2) - (matched.size/2)} </p>
                    </div>
               </div>
                
                {/* <h4> 안내 메시지 </h4>
                <div css={progressInfoMessage}>
                     추가 예정...
                </div> */}

               <div>
                    <h4> 최근 히스토리 </h4>
                    <div css={historyInfoWrapper}>
                        <ol css={historyList}>
                            {history.map((item) => (
                                <li key={item.ts} css={historyItem(item.success)}>
                                    <p> {item.pair[0]}, {item.pair[1]} </p>
                                    <p> {item.success ? "성공" : "실패"} </p>
                                </li>
                            ))}
                        </ol>

                    </div>
               </div>
            </section>

        </div>
    );
}


// 게임 보드
const gamePageWrapper = css`
    display: flex;
    background-color: #E0F8EE;
    border-radius: 3rem;
`;

const gameBoard = css`
    width: 60%;
`

const gameBoardHeader = css`
    display: flex;
    padding: 1rem 2rem;
    justify-content: space-between;
    align-items: center;
`;

const gameBoardHeaderText = css`
    color: #006B35;
`;

const gameResetButton = css`
    width: 5rem;
    height: 2rem;
    border: none;
    border-radius: 0.5rem;
    background-color: red;
    text-align: center;
    color: white;
`;

const gameBoardCardDeck = css`
    width: 100%;
    display: grid;
    grid-template-columns: repeat(4, 7rem);
    margin: 2rem 0;
    gap: 1rem;
    justify-content: center;
`;


// 게임 진행상황
const gameBoardInfo = css `
    width: 40%;
    margin: 2rem;
    padding: 1rem 2rem;
    background-color: #8fe0b7;;
    border-radius: 1rem;
`;

const levelInfo = css`
    padding: 1rem;
    background-color: #E0F8EE;
    color: #006B35;
`;

const progressInfoWrapper = css`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    margin-top: 1rem;
`;

const progressInfo = css`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1rem;
    background-color: #E0F8EE;
    border-radius: 1rem;
`;

const progressInfoTitle = css`
    color: gray;
    font-size: 1rem;
`;

const progressInfoText = css`
    color: #006B35;
    font-size: 1rem;
    font-weight: bold;
`;

const historyInfoWrapper = css`
    background-color: #E0F8EE;
`;

const historyList = css`
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: 1rem;
`;

const historyItem = (success) => css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.2rem 0.5rem;
    border-radius: 1rem;
    border: none;
    color: ${success ? "#006B35" : "red"};

    & > p {
    margin: 0;
    }
`;