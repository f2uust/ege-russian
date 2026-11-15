"""Проверка данных тренажёра: python tools/check.py

Каждый data/*.js имеет вид  EGE.load({ ...JSON... });
Скрипт вырезает JSON, проверяет структуру и выводит счётчики по номерам.
"""
import json, re, sys, pathlib
from collections import Counter, defaultdict

ROOT = pathlib.Path(__file__).resolve().parent.parent
VOW = set("аеёиоуыэюя")
TARGET = {4: 0, 5: 40, 6: 20, 7: 20, 8: 10, 21: 20}
for n in list(range(9, 21)): TARGET[n] = 15
for n in (1, 2, 3, 22, 23, 24, 25, 26): TARGET[n] = 12

errors, warns = [], []
Q = defaultdict(list); texts = {}; acc = []

def err(msg): errors.append(msg)

for f in sorted((ROOT / "data").glob("*.js")):
    src = f.read_text(encoding="utf-8").strip()
    m = re.fullmatch(r"EGE\.load\((.*)\);?", src, re.S)
    if not m:
        err(f"{f.name}: файл должен быть ровно EGE.load({{...}});"); continue
    try:
        d = json.loads(m.group(1))
    except json.JSONDecodeError as e:
        err(f"{f.name}: невалидный JSON: {e}"); continue
    acc += d.get("accents", [])
    for k, v in d.get("texts", {}).items():
        if k in texts: err(f"текст {k} определён дважды")
        texts[k] = v
    for n, arr in d.get("q", {}).items():
        for q in arr: Q[int(n)].append((f.name, q))

# --- ударения ---
seen = Counter(w.lower() for w in acc)
for w, c in seen.items():
    if c > 1: err(f"ударения: дубль «{w}»")
for w in acc:
    caps = [ch for ch in w if ch.lower() in VOW and ch.isupper()]
    if len(caps) != 1: err(f"ударения: в «{w}» должна быть ровно одна заглавная гласная")
    if any(ch.isupper() and ch.lower() not in VOW for ch in w): err(f"ударения: заглавная согласная в «{w}»")
    if "ё" in w and not ("Ё" in w): err(f"ударения: «{w}» — есть ё, но ударение не на ней")

# --- тексты ---
for k, t in texts.items():
    if not t.get("s") or not all(isinstance(s, str) and s.strip() for s in t["s"]): err(f"текст {k}: пустые предложения")

# --- задания ---
def loc(n, i, f): return f"№{n} [{f} #{i+1}]"
sigs = set()
for n, arr in sorted(Q.items()):
    for i, (f, q) in enumerate(arr):
        L = loc(n, i, f); t = q.get("t")
        if not q.get("q"): err(f"{L}: нет формулировки")
        if not q.get("e"): err(f"{L}: нет пояснения (e)")
        if "txt" in q and q["txt"] not in texts: err(f"{L}: нет текста {q['txt']}")
        a = q.get("a")
        if t == "c":
            o = q.get("o", [])
            if len(o) < 2 or not isinstance(a, int) or not 0 <= a < len(o): err(f"{L}: c — a должен быть индексом 0..{len(o)-1}")
            if len(set(o)) != len(o): err(f"{L}: повтор вариантов")
        elif t == "m":
            o = q.get("o", [])
            if not isinstance(a, list) or not all(isinstance(x, int) and 1 <= x <= len(o) for x in a): err(f"{L}: m — a должен быть списком номеров 1..{len(o)}")
            elif len(set(a)) != len(a) or a != sorted(a): err(f"{L}: m — номера в a по возрастанию, без повторов")
            if len(o) < 4: err(f"{L}: m — меньше 4 вариантов")
        elif t == "n":
            s, k = q.get("s", ""), q.get("k")
            nums = [int(x) for x in re.findall(r"\((\d+)\)", s)]
            if nums != list(range(1, (k or 0) + 1)): err(f"{L}: n — цифры в тексте {nums} не совпадают с k={k}")
            if not isinstance(a, list) or not all(isinstance(x, int) and 1 <= x <= (k or 0) for x in a): err(f"{L}: n — a вне диапазона")
            elif a != sorted(set(a)): err(f"{L}: n — номера в a по возрастанию, без повторов")
        elif t == "i":
            if not isinstance(a, list) or not a or not all(isinstance(x, str) and x.strip() for x in a): err(f"{L}: i — a должен быть непустым списком строк")
        elif t == "x":
            Ls, R = q.get("L", []), q.get("R", [])
            if not isinstance(a, list) or len(a) != len(Ls): err(f"{L}: x — длина a != длине L")
            elif not all(isinstance(x, int) and 1 <= x <= len(R) for x in a): err(f"{L}: x — a вне 1..{len(R)}")
            elif len(set(a)) != len(a): err(f"{L}: x — один номер предложения на две ошибки")
        else:
            err(f"{L}: неизвестный тип {t!r}")
        sig = (n, q.get("q"), json.dumps(q.get("o") or q.get("l") or q.get("s") or q.get("R"), ensure_ascii=False))
        if sig in sigs: err(f"{L}: дубль задания")
        sigs.add(sig)

# --- итог ---
print(f"Ударения: {len(acc)} слов")
total = 0
for n in range(1, 27):
    if n == 4: continue
    c = len(Q.get(n, [])); total += c
    flag = "" if c >= TARGET.get(n, 0) else f"  < цель {TARGET[n]}"
    if flag: warns.append(f"№{n}: {c}{flag}")
    print(f"№{n:>2}: {c:>3}{flag}")
print(f"Всего заданий: {total}; текстов: {len(texts)}")
for w in warns: print("ВНИМАНИЕ:", w)
for e in errors: print("ОШИБКА:", e)
sys.exit(1 if errors else 0)
