import { css } from "@emotion/react";

// 부모(App.js)로부터 activeTab, setActiveTab을 props로 받음
export default function Header({activeTab, setActiveTab}) {
    return(
        <header css={headerStyle}>
            <h1 css={headerText}>숫자 카드 짝 맞추기</h1>
            <nav css={tabContainer}>
                <button 
                    css={[tabButton, activeTab === "game" && activeTabButton]}
                    onClick={() => setActiveTab("game")}
                >
                    게임
                </button>
                <button
                    css={[tabButton, activeTab === "ranking" && activeTabButton]}
                    onClick={() => setActiveTab("ranking")}
                >
                    랭킹
                </button>
            </nav>
        </header>
    );
}

const headerStyle = css`
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 2rem 0;
    padding: 1.5rem;
    border-radius: 2rem;
    background-color: #E0F8EE;
`;

const headerText = css`
    color: #006B35;
`;

const tabContainer = css `
    display: flex;
    gap: 0.8rem;
`;

const tabButton = css`
    width: 6rem;
    height: 3rem;
    padding: 0.2rem;
    font-size: 1rem;
    font-weight: bold;
    background-color: #d9d9d9;
    border: transparent;
    border-radius: 1rem;
    color: #808080;

    &:hover {
        background-color: #24D59E;
        color: white;
    }
`;

const activeTabButton = css`
    background-color: #24D59E;
    color: white;
`;
