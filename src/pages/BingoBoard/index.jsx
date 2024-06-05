import clsx from "clsx";
import { useCallback, useEffect, useState } from "react";
import ConfettiExplosion from "react-confetti-explosion";

export const BingoBoard = () => {
  const [num, setNum] = useState();
  const [boardNumber, setBoardNumber] = useState([]);
  const [active, setActive] = useState([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [start, setStart] = useState(false);

  const arr = [...Array(100).keys()];

  const generateStore = useCallback(() => {
    const dataArray = [];
    let row = [];
    const store = new Set();
    while (store.size < 100) {
      store.add(Math.floor(Math.random() * 100));
    }

    const uniqueArray = Array.from(store).filter(Boolean);

    uniqueArray.forEach((element) => {
      if (!dataArray?.flat()?.includes(element)) {
        row.push(element);

        if (row.length === 5 && dataArray.length < 5) {
          dataArray.push(row);
          row = [];
        }
      }
    });
    return dataArray;
  }, []);

  const generateNumber = useCallback(async () => {
    while (start) {
      const random = Math.floor(Math.random() * arr.length);
      const n = arr[random];
      arr.splice(random, 1);
      setNum(n);
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }, [start]);

  const handleSelected = useCallback(
    (num) => {
      const elementArr = boardNumber?.flat();
      if (elementArr?.includes(num)) {
        setActive((prev) => (prev.length ? [...prev, num] : [num]));
      }
    },
    [boardNumber]
  );

  useEffect(() => {
    const t = generateStore();
    setBoardNumber(t);
  }, [generateStore]);

  useEffect(() => {
    if (start) {
      generateNumber();
    }
  }, [generateNumber, start]);

  useEffect(() => {
    if (num) {
      handleSelected(num);
    }
  }, [handleSelected, num]);

  useEffect(() => {
    if (active.length === 25) {
      setIsCompleted(true);
      setStart(false);
    }
  }, [active]);

  return (
    <div className="container">
      <h1>Bingo Board {isCompleted ? "Completed" : num}</h1>
      <div className="board-container">
        <table className="">
          {boardNumber?.map((x, i) => (
            <tr key={i}>
              {x?.map((y, index) => (
                <td
                  key={index}
                  className={clsx("", [{ active: active?.includes(y) }])}
                >
                  {y}
                </td>
              ))}
            </tr>
          ))}
        </table>
      </div>
      {isCompleted && (
        <ConfettiExplosion
          force={2}
          duration={3000}
          particleCount={500}
          width={2500}
        />
      )}
      <div className="bottom-button">
        <button className="primary-button" onClick={() => setStart(true)}>
          Start
        </button>
        <button
          className="secondary-button"
          onClick={() => {
            window.location.reload();
          }}
        >
          Refresh
        </button>
      </div>
    </div>
  );
};
