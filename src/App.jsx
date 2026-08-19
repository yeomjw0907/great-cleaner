import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, NavLink, Route, Routes, useLocation } from "react-router-dom";
import {
  ArrowRight,
  Check,
  ChevronDown,
  ClipboardCheck,
  Menu,
  MessageCircle,
  X,
} from "lucide-react";
import { services } from "./siteData.jsx";
import { HomePage, ReviewsPage, ServicePage } from "./pages";

export const reveal = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-70px" },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
};
export function Brand({ light = false }) {
  return (
    <Link
      className={`brand ${light ? "light" : ""}`}
      to="/"
      aria-label="위대한 청소부 홈"
    >
      <span className="brand-mark">
        <span>W</span>
        <i />
      </span>
      <span className="brand-name">
        <b>위대한 청소부</b>
        <small>공간을 되살리는 기술</small>
      </span>
    </Link>
  );
}

function Header({ onConsult }) {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => {
    setOpen(false);
  }, [pathname]);
  const links = [
    ...services.map((service) => [`/${service.slug}`, service.nav]),
    ["/reviews", "작업후기"],
  ];
  return (
    <header className="site-header">
      <Brand light />
      <nav className="desktop-nav">
        {links.map(([to, label]) => (
          <NavLink key={to} to={to}>
            {label}
          </NavLink>
        ))}
      </nav>
      <button className="header-cta" onClick={onConsult}>
        비공개 상담 <ArrowRight />
      </button>
      <button
        className="menu-button"
        aria-label="메뉴 열기"
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <X /> : <Menu />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="mobile-menu-head">
              <Brand />
              <button onClick={() => setOpen(false)}>
                <X />
              </button>
            </div>
            <nav>
              {links.map(([to, label], i) => (
                <NavLink key={to} to={to}>
                  <span>0{i + 1}</span>
                  {label}
                  <ArrowRight />
                </NavLink>
              ))}
            </nav>
            <button
              className="primary"
              onClick={() => {
                setOpen(false);
                onConsult();
              }}
            >
              상담 요청서 작성 <MessageCircle />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
function Footer({ onConsult }) {
  return (
    <footer>
      <div className="footer-main">
        <Brand light />
        <h2>
          어려운 공간을
          <br />
          다시 일상으로.
        </h2>
        <button onClick={onConsult}>
          비공개 상담 시작 <ArrowRight />
        </button>
      </div>
      <div className="footer-nav">
        <div>
          <b>서비스</b>
          {services.map((s) => (
            <Link to={`/${s.slug}`} key={s.slug}>
              {s.nav}
            </Link>
          ))}
        </div>
        <div>
          <b>안내</b>
          <Link to="/reviews">작업후기</Link>
          <button onClick={onConsult}>상담 요청서</button>
        </div>
      </div>
      <div className="footer-bottom">
        <span>상담 지역 및 일정은 요청서 확인 후 안내드립니다.</span>
        <span>© 2026 위대한 청소부. All rights reserved.</span>
      </div>
    </footer>
  );
}
function ScrollTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}
export default function App() {
  const [consult, setConsult] = useState(false);
  return (
    <>
      <ScrollTop />
      <Header onConsult={() => setConsult(true)} />
      <Routes>
        <Route
          path="/"
          element={<HomePage onConsult={() => setConsult(true)} />}
        />
        {services.map((s) => (
          <Route
            key={s.slug}
            path={`/${s.slug}`}
            element={
              <ServicePage data={s} onConsult={() => setConsult(true)} />
            }
          />
        ))}
        <Route
          path="/reviews"
          element={<ReviewsPage onConsult={() => setConsult(true)} />}
        />
        <Route
          path="*"
          element={<HomePage onConsult={() => setConsult(true)} />}
        />
      </Routes>
      <Footer onConsult={() => setConsult(true)} />
      <button className="floating-consult" onClick={() => setConsult(true)}>
        <MessageCircle />
        <span>상담하기</span>
      </button>
      <AnimatePresence>
        {consult && <ConsultModal onClose={() => setConsult(false)} />}
      </AnimatePresence>
    </>
  );
}
function ConsultModal({ onClose }) {
  const [form, setForm] = useState({
      type: "쓰레기집 청소",
      area: "",
      date: "",
      note: "",
    }),
    [copied, setCopied] = useState(false);
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "");
  }, []);
  const submit = async (e) => {
    e.preventDefault();
    const text = `[위대한 청소부 상담 요청]\n서비스: ${form.type}\n지역: ${form.area || "미입력"}\n희망 일정: ${form.date || "협의"}\n내용: ${form.note || "상담 시 전달"}`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
  };
  return (
    <motion.div
      className="modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onMouseDown={onClose}
    >
      <motion.div
        className="modal"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose}>
          <X />
        </button>
        <span className="eyebrow">PRIVATE CONSULTATION</span>
        <h2>상담 요청서</h2>
        <p>
          현재 입력 내용은 서버로 전송되지 않습니다. 요청서를 복사해 사용 중인
          문자나 메신저로 전달할 수 있습니다.
        </p>
        <form onSubmit={submit}>
          <label>
            필요한 서비스
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              {services.map((s) => (
                <option key={s.slug}>{s.nav}</option>
              ))}
            </select>
          </label>
          <div className="form-row">
            <label>
              지역
              <input
                value={form.area}
                onChange={(e) => setForm({ ...form, area: e.target.value })}
                placeholder="예: 서울 마포구"
              />
            </label>
            <label>
              희망 일정
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
            </label>
          </div>
          <label>
            상황 설명
            <textarea
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              placeholder="공간 크기, 상태, 꼭 보관할 물건을 적어주세요."
            />
          </label>
          <button className="primary" type="submit">
            {copied ? (
              <>
                <Check /> 요청서가 복사됐습니다
              </>
            ) : (
              <>
                상담 요청서 복사 <ClipboardCheck />
              </>
            )}
          </button>
          {copied && (
            <small>
              대표 연락처가 연결되면 이 버튼을 바로 전송 방식으로 변경할 수
              있습니다.
            </small>
          )}
        </form>
      </motion.div>
    </motion.div>
  );
}
export function Faq({ items }) {
  const [open, setOpen] = useState(0);
  return (
    <div className="faq-list">
      {items.map(([q, a], i) => (
        <div className={`faq-item ${open === i ? "open" : ""}`} key={q}>
          <button onClick={() => setOpen(open === i ? -1 : i)}>
            <span>0{i + 1}</span>
            <b>{q}</b>
            <ChevronDown />
          </button>
          <AnimatePresence initial={false}>
            {open === i && (
              <motion.p
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
              >
                {a}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
export function ServiceLinks({ current }) {
  return (
    <div className="service-links">
      {services
        .filter((s) => s.slug !== current)
        .map((s) => {
          const Icon = s.icon;
          return (
            <Link to={`/${s.slug}`} key={s.slug}>
              <Icon />
              <span>
                {s.nav}
                <small>{s.kicker}</small>
              </span>
              <ArrowRight />
            </Link>
          );
        })}
    </div>
  );
}
