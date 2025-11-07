
/**
 * Fisher–Yates 셔플 함수
 *
 * - 매개변수 array는 섞고 싶은 배열입니다.
 * - 예시: shuffle([1, 2, 3, 4])
 *
 * 원본 배열을 직접 바꾸지 않도록 얕은 복사본을 만든 뒤 섞어 반환해요.
 * 내부 로직이나 네이밍을 바꾸셔도 전혀 상관없습니다 🙂
 */
export function shuffle(array, rng = Math.random) {
  const arr = array.slice();
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * 레벨별 덱을 만들어주는 함수
 *
 * - 매개변수 level은 보드 크기를 결정 (1, 2, 3 중 하나)
 * - 예시: buildDeck(2)
 *
 * 규칙
 * 1) level에 따라 rows x cols 크기의 보드를 가정
 * 2) 각 숫자 값이 2장씩 존재
 * 3) 렌더링 안정성을 위해 카드마다 고유 id를 붙입니다 (예: "3-a", "3-b")
 *
 * 반환값은 섞인 카드 배열입니다. 형식: { id: string, value: number }[]
 * 제공 코드 그대로 사용하셔도 되고, 파일 분리/네이밍 변경 모두 자유입니다.
 */
export function buildDeck(level = 1) {
  const LEVEL_TO_GRID = { 1: [4, 4], 2: [4, 6], 3: [6, 6] };
  
  const [rows, cols] = LEVEL_TO_GRID[level] ?? [4, 4];
  const total = rows * cols;

  // 카드 총 개수는 짝수여야 합니다 (짝 맞추는 게임이니까)
  if (total % 2 !== 0) throw new Error('카드 개수는 짝수여야 해요.');

  const pairs = total / 2;
  const base = Array.from({ length: pairs }, (_, i) => i + 1);

  // 각 숫자 값을 2장씩 생성하고, 고유 id를 부여
  const duplicated = [];
  for (let i = 0; i < base.length; i += 1) {
    const v = base[i];
    duplicated.push({ id: `${v}-a`, value: v });
    duplicated.push({ id: `${v}-b`, value: v });
  }

  // 매 게임마다 다른 배치를 위해 마지막에 셔플
  return shuffle(duplicated);
}
