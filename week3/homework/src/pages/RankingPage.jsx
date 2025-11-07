import { useEffect, useState } from "react";
import { css } from "@emotion/react";
import { loadRanking, clearRanking } from "../ranking/rankingStorage";


export default function RankingPage() {
    const [records, setRecords] = useState([]);

    useEffect(() => {
        setRecords(loadRanking());
    }, []);

    const recordFormat = (iso) => {
        const d = new Date(iso);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() +1).padStart(2, "0");
        const dd = String(d.getDate()).padStart(2, "0");
        const hh = String(d.getHours()).padStart(2, "0");
        const mi = String(d.getMinutes()).padStart(2, "0");
        const ss = String(d.getSeconds()).padStart(2, "0");
        return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
    };

    const handleClear = () => {
        const ok = confirm("랭킹을 모두 삭제힐끼요?");
        if (!ok) return;
        clearRanking();
        setRecords([]);
    }

    return(
        <div css={rankingPageWrapper}>
            <section css={rankingPageHeader}>
                <h4> 랭킹 보드 </h4>
                <button css={rankingResetButton} onClick={handleClear}>
                    기록 초기화
                </button>
            </section>

            <section css={rankingBoard}>
                {records.length === 0 ? (
                    <p> 아직 기록이 없습니다. </p>
                ) : (
                    <table css={rankingTable}>
                        <thead>
                            <tr>
                                <th> # </th>
                                <th> 레벨 </th>
                                <th> 클리어 시간(초) </th>
                                <th> 기록 시각 </th>
                            </tr>
                        </thead>

                        <tbody>
                            {records.map((r, idx) => (
                                <tr key={`${r.timestamp}-${idx}`}>
                                    <td> {idx+1} </td>
                                    <td>{r.level}</td>
                                    <td> {r.clearedTime.toFixed(2)} </td>
                                    <td>{recordFormat(r.timeStamp)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </section>
            
        </div>
    );
}

const rankingPageWrapper = css`
    background-color: #E0F8EE;
`;

const rankingPageHeader = css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
`;

const rankingResetButton = css`
    width: 6rem;
    padding: 0.5rem;
    background-color: red;
    border-radius: 1rem;
    border: none;
    color: white;
    cursor: pointer;
`;

const rankingBoard = css`
    display: flex;
    justify-content: center;
`;

const rankingTable = css`
    width: 90%;
    padding: 1rem 2rem;
    border-collapse: collapse;
    border: none;
    th, td { padding: 1rem 2rem; text-align: center; }
    thead th {background-color: #24D59E; color: #006B35;}
`;
