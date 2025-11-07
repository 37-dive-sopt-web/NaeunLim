import { useState } from 'react'
import { Global, css } from "@emotion/react";
import Header from './components/Header';
import GamePage from './pages/GamePage';
import RankingPage from './pages/RankingPage';

function App() {
  const GlobalStyle = css`
    * { box-sizing: border-box };
    body {
      margin: 0;
      padding: 0;
      background-color: #c6ecdd;
    }
  `;

  
  const [activeTab, setActiveTab] = useState("game");

  return (
    <>
      <Global styles={GlobalStyle}/>
      <div css={appContainer}>
        <div css={contentWrapper}>
          <Header activeTab={activeTab} setActiveTab={setActiveTab}/>
          <main>
            {activeTab === "game" ? <GamePage/> : <RankingPage/>}
          </main>
        </div>
      </div>
    </>
  );
}

export default App;

const appContainer = css`
  display: flex;
  flex-direction: column;
  justify-contents: center;
  align-items: center;
`;

const contentWrapper = css`
  width: 80%;
`