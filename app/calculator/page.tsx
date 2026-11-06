"use client";

import { Badge } from "@/components/tailgrids/core/badge";
import { checklogin } from "@/utils/login";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Calculator() {
  const router = useRouter();

  useEffect(() => {
    checklogin(router, "/calculator");
  }, [router]);

  const disabledBtn =
    "w-15 h-15 rounded-lg border bg-green-500 text-2xl flex justify-center items-center font-bold text-black opacity-50 cursor-not-allowed";
  const activeBtn =
    "w-15 h-15 rounded-lg border border-gray-400 bg-green-500 text-2xl flex justify-center items-center font-bold text-black cursor-pointer hover:bg-yellow-300 hover:scale-105 transition-transform";

  const [state, setState] = useState<"first" | "operator" | "second">("first");
  const [display, setDisplay] = useState("0");
  const [firstNum, setFirstNum] = useState(0);
  const [secondNum, setSecondNum] = useState(0);
  const [op, setOp] = useState("?");
  const [lastNum, setLastNum] = useState(0);

  const handleDigit = (digit: number) => {
    switch (state) {
      case "first":
      case "second":
        if (display.length < 9) {
          if (display === "0") {
            setDisplay(String(digit));
          } else {
            setDisplay(display + digit);
          }
        }
        break;
      case "operator":
        setDisplay(String(digit));
        setState("second");
        break;
    }
  };

  const handleOperator = (nextOp: string) => {
    switch (state) {
      case "first":
        setLastNum(Number(display));
        setFirstNum(Number(display));
        setOp(nextOp);
        setState("operator");
        break;
      case "operator":
        setOp(nextOp);
        break;
      case "second":
        if (op === "+") {
          setLastNum(Number(display));
          setFirstNum(firstNum + Number(display));
          setDisplay(String(firstNum + Number(display)));
        } else {
          setLastNum(Number(display));
          setFirstNum(firstNum - Number(display));
          setDisplay(String(firstNum - Number(display)));
        }
        setState("operator");
        setOp(nextOp);
        break;
    }
  };

  const handleEqual = () => {
    switch (state) {
      case "first":
        if (op === "?") {
          setFirstNum(Number(display));
          setDisplay(display);
        } else if (op === "+") {
          setDisplay(String(firstNum + lastNum));
          setFirstNum(firstNum + lastNum);
        } else {
          setDisplay(String(firstNum - lastNum));
          setFirstNum(firstNum - lastNum);
        }
        break;
      case "operator":
        if (op === "+") {
          setFirstNum(firstNum + lastNum);
          setDisplay(String(firstNum + lastNum));
        } else {
          setFirstNum(firstNum - lastNum);
          setDisplay(String(firstNum - lastNum));
        }
        setState("first");
        setSecondNum(0);
        break;
      case "second":
        if (op === "+") {
          setDisplay(String(firstNum + Number(display)));
          setLastNum(Number(display));
          setFirstNum(firstNum + Number(display));
        } else {
          setDisplay(String(firstNum - Number(display)));
          setLastNum(Number(display));
          setFirstNum(firstNum - Number(display));
        }
        setState("first");
        setSecondNum(0);
        break;
    }
  };

  const handleClear = () => {
    setState("first");
    setDisplay("0");
    setFirstNum(0);
    setSecondNum(0);
    setOp("?");
    setLastNum(0);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= "0" && e.key <= "9") {
        handleDigit(Number(e.key));
      } else if (e.key === "Enter") {
        handleEqual();
      } else if (e.key === "Escape") {
        handleClear();
      } else if (e.key === "-") {
        handleOperator("-");
      } else if (e.key === "=" || e.key === "+") {
        handleOperator("+");
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [state, firstNum, secondNum, op, lastNum, display]);

  // Format with thousands separator
  const formatDisplay = (str: string) => {
    let res = "";
    let count = 0;
    for (let i = str.length - 1; i >= 0; i--) {
      res = str[i] + res;
      if (i !== 0 && count++ % 3 === 2) {
        res = " " + res;
      }
    }
    return res;
  };

  return (
    <div className="mt-4 w-fit mx-auto border rounded-2xl border-slate-300 bg-white shadow-md p-2">
      {/* Screen */}
      <div
        id="screen"
        className="px-4 py-2 rounded-lg m-2 bg-cyan-200 flex justify-end items-center font-bold text-3xl shadow-inner text-black font-mono tracking-wider min-h-[56px]"
      >
        {formatDisplay(display)}
      </div>

      {/* Button Grid (5 columns) */}
      <div className="p-2 pt-0 grid grid-cols-5 gap-1.5 select-none">
        <Badge className={disabledBtn}>MC</Badge>
        <Badge className={disabledBtn}>MR</Badge>
        <Badge className={disabledBtn}>M+</Badge>
        <Badge className={disabledBtn}>M-</Badge>
        <Badge onClick={handleClear} className={`${activeBtn} bg-orange-400 hover:bg-orange-500`}>
          CE
        </Badge>

        <Badge onClick={() => handleDigit(7)} className={`${activeBtn} bg-sky-300 hover:bg-sky-400`}>
          7
        </Badge>
        <Badge onClick={() => handleDigit(8)} className={`${activeBtn} bg-sky-300 hover:bg-sky-400`}>
          8
        </Badge>
        <Badge onClick={() => handleDigit(9)} className={`${activeBtn} bg-sky-300 hover:bg-sky-400`}>
          9
        </Badge>
        <Badge className={disabledBtn}>÷</Badge>
        <Badge className={disabledBtn}>√</Badge>

        <Badge onClick={() => handleDigit(4)} className={`${activeBtn} bg-sky-300 hover:bg-sky-400`}>
          4
        </Badge>
        <Badge onClick={() => handleDigit(5)} className={`${activeBtn} bg-sky-300 hover:bg-sky-400`}>
          5
        </Badge>
        <Badge onClick={() => handleDigit(6)} className={`${activeBtn} bg-sky-300 hover:bg-sky-400`}>
          6
        </Badge>
        <Badge className={disabledBtn}>×</Badge>
        <Badge className={disabledBtn}>1/×</Badge>

        <Badge onClick={() => handleDigit(1)} className={`${activeBtn} bg-sky-300 hover:bg-sky-400`}>
          1
        </Badge>
        <Badge onClick={() => handleDigit(2)} className={`${activeBtn} bg-sky-300 hover:bg-sky-400`}>
          2
        </Badge>
        <Badge onClick={() => handleDigit(3)} className={`${activeBtn} bg-sky-300 hover:bg-sky-400`}>
          3
        </Badge>
        <Badge onClick={() => handleOperator("-")} className={activeBtn}>
          −
        </Badge>
        <Badge className={disabledBtn}>%</Badge>

        <Badge onClick={() => handleDigit(0)} className={`${activeBtn} bg-sky-300 hover:bg-sky-400`}>
          0
        </Badge>
        <Badge className={disabledBtn}>.</Badge>
        <Badge className={disabledBtn}>+/-</Badge>
        <Badge onClick={() => handleOperator("+")} className={activeBtn}>
          +
        </Badge>
        <Badge onClick={handleEqual} className={activeBtn}>
          =
        </Badge>
      </div>
    </div>
  );
}
