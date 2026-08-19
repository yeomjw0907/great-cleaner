import React, { useEffect, useMemo, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Camera,
  Check,
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  EyeOff,
  MessageCircle,
  MoveHorizontal,
  PackageCheck,
  ScanSearch,
  ShieldCheck,
} from "lucide-react";
import { Faq, ServiceLinks, reveal } from "./App";
import { homeServices, sampleRecords, services } from "./siteData.jsx";

function PageTitle({ title, description }) {
  useEffect(() => {
    document.title = title;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", description);
  }, [title, description]);
  return null;
}

function BeforeAfterSlider() {
  const [position, setPosition] = useState(50);

  return (
    <div className="comparison-wrap">
      <div
        className="before-after"
        style={{ "--position": `${position}%` }}
      >
        <img
          className="comparison-image comparison-after"
          src="/images/trash-home-after.webp"
          alt="쓰레기집 청소를 마친 깨끗한 거실"
          draggable="false"
        />
        <div className="comparison-before" aria-hidden="true">
          <img
            className="comparison-image"
            src="/images/trash-home-before.webp"
            alt=""
            draggable="false"
          />
        </div>
        <span className="comparison-label label-before">청소 전</span>
        <span className="comparison-label label-after">청소 후</span>
        <input
          className="comparison-range"
          type="range"
          min="0"
          max="100"
          value={position}
          onChange={(event) => setPosition(Number(event.target.value))}
          aria-label="청소 전후 이미지 비교 위치"
        />
        <div className="comparison-handle" aria-hidden="true">
          <MoveHorizontal />
        </div>
      </div>
      <div className="comparison-copy">
        <span>쓰레기집 청소 · 아파트</span>
        <h3>쌓여 있던 생활폐기물부터 공간 세척까지</h3>
        <p>가운데 손잡이를 좌우로 움직여 청소 전후를 비교해 보세요.</p>
      </div>
    </div>
  );
}

function RecordBeforeAfter({ record }) {
  const [position, setPosition] = useState(50);

  return (
    <div
      className="record-comparison before-after"
      style={{ "--position": `${position}%` }}
    >
      <img
        className="comparison-image comparison-after"
        src={record.afterImage}
        alt={record.afterAlt}
        loading="lazy"
        draggable="false"
      />
      <div className="comparison-before" aria-hidden="true">
        <img
          className="comparison-image"
          src={record.beforeImage}
          alt=""
          loading="lazy"
          draggable="false"
        />
      </div>
      <span className="comparison-label label-before">청소 전</span>
      <span className="comparison-label label-after">청소 후</span>
      <input
        className="comparison-range"
        type="range"
        min="0"
        max="100"
        value={position}
        onChange={(event) => setPosition(Number(event.target.value))}
        aria-label={`${record.title} 청소 전후 비교 위치`}
      />
      <div className="comparison-handle" aria-hidden="true">
        <MoveHorizontal />
      </div>
    </div>
  );
}

const trustPoints = [
  [Camera, "사진 기반 1차 확인", "노출 부담 없이 필요한 범위를 먼저 살핍니다."],
  [PackageCheck, "보관 물품 우선", "남길 물건의 기준부터 확인합니다."],
  [ClipboardCheck, "작업 범위 합의", "분류·반출·세척 범위를 시작 전에 나눕니다."],
  [CheckCircle2, "마무리 함께 확인", "합의한 범위가 끝났는지 확인합니다."],
];

const plannerServices = [
  {
    id: "trash",
    label: "쓰레기집 청소",
    estimates: [[50, 90], [90, 160], [140, 240], [200, 350]],
    steps: ["보관 물품 분류", "생활폐기물 반출", "공간 기본 세척"],
  },
  {
    id: "waste",
    label: "폐기물 처리",
    estimates: [[30, 50], [50, 80], [80, 120], [120, 180]],
    steps: ["품목·물량 확인", "반출 동선 계획", "폐기물 분류·운반"],
  },
  {
    id: "move-in",
    label: "이사·입주청소",
    estimates: [[18, 25], [20, 32], [30, 48], [42, 68]],
    steps: ["공간·오염 상태 점검", "창틀·수납장 분진 제거", "주방·욕실·바닥 세척"],
  },
  {
    id: "heritage",
    label: "유품정리",
    estimates: [[40, 90], [80, 140], [120, 200], [180, 280]],
    steps: ["중요 물품 탐색", "보관·확인·정리 분류", "공간 마무리"],
  },
  {
    id: "special",
    label: "특수청소",
    estimates: [[70, 130], [110, 200], [170, 300], [260, 450]],
    steps: ["오염 범위 확인", "오염원 제거", "전문 세척·표면 처리"],
  },
];

const spaceLabels = ["10평 미만", "10~20평", "20~30평", "30평 이상"];
const conditionLabels = ["정리 위주", "분류·반출 필요", "오염까지 심함"];
const conditionRates = [0.75, 1, 1.45];
const extraPrices = {
  odor: [20, 40],
  deep: [15, 30],
  stairs: [10, 25],
};

const roundEstimate = (value) => Math.max(5, Math.round(value / 5) * 5);

function ScopePlanner({ onConsult }) {
  const [service, setService] = useState("trash");
  const [space, setSpace] = useState(1);
  const [condition, setCondition] = useState(1);
  const [extras, setExtras] = useState({ odor: false, deep: false, stairs: false });
  const selected = plannerServices.find((item) => item.id === service);
  const selectedExtras = Object.entries(extras).filter(([, active]) => active);
  const extraPrice = selectedExtras.reduce(
    (total, [key]) => [total[0] + extraPrices[key][0], total[1] + extraPrices[key][1]],
    [0, 0],
  );
  const baseEstimate = selected.estimates[space];
  const estimate = [
    roundEstimate(baseEstimate[0] * conditionRates[condition] + extraPrice[0]),
    roundEstimate(baseEstimate[1] * conditionRates[condition] + extraPrice[1]),
  ];
  const steps = [
    ...selected.steps,
    ...(extras.odor ? ["악취 원인 확인·탈취"] : []),
    ...(extras.deep ? ["집중 세척 범위 협의"] : []),
    ...(extras.stairs ? ["계단·반출 동선 추가 확인"] : []),
  ];
  const toggleExtra = (key) =>
    setExtras((current) => ({ ...current, [key]: !current[key] }));

  return (
    <section className="scope-planner section-pad" id="scope-planner">
      <motion.header {...reveal}>
        <span className="eyebrow">ESTIMATE · 01</span>
        <h2>
          1분이면 예상 비용을
          <br />
          <em>미리 확인할 수 있습니다.</em>
        </h2>
        <p>
          서비스와 공간 상태를 선택하면 공개 가격 자료를 기준으로 예상 견적 범위를 계산합니다.
        </p>
      </motion.header>
      <motion.div className="planner-shell" {...reveal}>
        <div className="planner-form">
          <fieldset>
            <legend>01. 어떤 도움이 필요한가요?</legend>
            <div className="planner-options service-options">
              {plannerServices.map((item) => (
                <button
                  type="button"
                  className={service === item.id ? "active" : ""}
                  aria-pressed={service === item.id}
                  onClick={() => setService(item.id)}
                  key={item.id}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend>02. 공간 크기는 어느 정도인가요?</legend>
            <div className="planner-options compact-options">
              {spaceLabels.map((label, index) => (
                <button
                  type="button"
                  className={space === index ? "active" : ""}
                  aria-pressed={space === index}
                  onClick={() => setSpace(index)}
                  key={label}
                >
                  {label}
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend>03. 현재 상태에 가장 가까운 단계는?</legend>
            <div className="planner-options compact-options condition-options">
              {conditionLabels.map((label, index) => (
                <button
                  type="button"
                  className={condition === index ? "active" : ""}
                  aria-pressed={condition === index}
                  onClick={() => setCondition(index)}
                  key={label}
                >
                  {label}
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend>04. 추가로 해당하는 항목이 있나요?</legend>
            <div className="planner-options extra-options">
              {[
                ["odor", "악취가 남아 있음"],
                ["deep", "주방·욕실 집중 세척"],
                ["stairs", "엘리베이터 없음"],
              ].map(([key, label]) => (
                <button
                  type="button"
                  className={extras[key] ? "active" : ""}
                  aria-pressed={extras[key]}
                  onClick={() => toggleExtra(key)}
                  key={key}
                >
                  <span className="option-indicator">
                    {extras[key] && <Check />}
                  </span>
                  {label}
                </button>
              ))}
            </div>
          </fieldset>
        </div>
        <aside className="planner-result" aria-live="polite">
          <div>
            <span>예상 견적 범위</span>
            <small>2026년 공개 가격 자료 기준</small>
          </div>
          <strong className="estimate-total">
            {estimate[0]}만 <i>~</i> {estimate[1]}만원
          </strong>
          <p>부가세 및 현장 확인 전 참고 금액입니다.</p>
          <dl className="estimate-facts">
            <div>
              <dt>서비스</dt>
              <dd>{selected.label}</dd>
            </div>
            <div>
              <dt>공간</dt>
              <dd>{spaceLabels[space]}</dd>
            </div>
            <div>
              <dt>상태</dt>
              <dd>{conditionLabels[condition]}</dd>
            </div>
            <div>
              <dt>추가 항목</dt>
              <dd>{selectedExtras.length ? `${selectedExtras.length}개 선택` : "없음"}</dd>
            </div>
          </dl>
          <span className="included-label">예상 작업 범위</span>
          <ol>
            {steps.map((step, index) => (
              <li key={step}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                {step}
              </li>
            ))}
          </ol>
          <div className="planner-notice">
            <ScanSearch />
            <p>
              실제 금액은 폐기물량·오염 범위·지역·주차 및 반출 동선을 사진 또는 방문으로 확인한 뒤 확정합니다.
            </p>
          </div>
          <button className="primary" type="button" onClick={onConsult}>
            사진으로 정확히 상담하기 <ArrowRight />
          </button>
        </aside>
      </motion.div>
    </section>
  );
}

export function HomePage({ onConsult }) {
  const { scrollY } = useScroll(),
    y = useTransform(scrollY, [0, 800], [0, 90]);
  return (
    <main>
      <PageTitle
        title="위대한 청소부 | 공간을 되살리는 기술"
        description="쓰레기집 청소, 이사·입주청소, 특수청소, 유품정리, 폐기물 처리까지 공간 회복을 위한 전문 서비스."
      />
      <section className="hero home-hero">
        <motion.div className="hero-image" style={{ y }} />
        <div className="hero-shade" />
        <motion.div
          className="hero-copy"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
        >
          <span className="eyebrow light">GREAT CLEANER · SPECIAL CARE</span>
          <h1>
            공간이 다시
            <br />
            <em>일상이 되도록.</em>
          </h1>
          <p>
            말하기 어려운 상황일수록 조용하고 정확하게.
            <br />
            필요한 서비스부터 차분히 안내합니다.
          </p>
          <div className="hero-actions">
            <button className="primary" onClick={onConsult}>
              비공개 상담 시작 <ArrowRight />
            </button>
            <a href="#find-service">
              서비스 찾기 <ChevronDown />
            </a>
          </div>
        </motion.div>
        <div className="hero-index">
          <span>01</span>
          <i />
          <b>HOME</b>
        </div>
      </section>
      <section className="proof-strip" aria-label="상담과 작업 진행 원칙">
        {trustPoints.map(([Icon, title, description]) => (
          <div key={title}>
            <Icon />
            <span>
              <b>{title}</b>
              <small>{description}</small>
            </span>
          </div>
        ))}
      </section>
      <section className="home-intro section-pad">
        <motion.div {...reveal}>
          <span className="eyebrow">ONE TEAM, ONE STANDARD</span>
          <h2>
            한 번의 설명으로,
            <br />
            <em>정리부터 회복까지.</em>
          </h2>
        </motion.div>
        <motion.div {...reveal}>
          <p>
            쓰레기집 정리, 유품 분류, 폐기물 반출, 특수 세척은 서로 분리된 일이
            아닙니다. 위대한 청소부는 공간의 현재 상태를 보고 필요한 순서를 함께
            설계합니다.
          </p>
          <div className="trust-line">
            <ShieldCheck />
            <b>상담 내용 보호</b>
            <span>현장 사진과 개인 상황을 조심스럽게 다룹니다.</span>
          </div>
        </motion.div>
      </section>
      <section id="find-service" className="home-services section-pad">
        <motion.header {...reveal}>
          <span className="eyebrow light">FIND YOUR SERVICE</span>
          <h2>
            어떤 도움이
            <br />
            필요하신가요?
          </h2>
          <p>
            상황에 가까운 서비스를 선택하면 작업 범위와 과정을 자세히 볼 수
            있습니다.
          </p>
        </motion.header>
        <div className="home-service-grid">
          {homeServices.map((s, i) => {
            const Icon = s.icon;
            const active = services.some((x) => x.slug === s.slug);
            return active ? (
              <motion.div {...reveal} key={s.slug}>
                <Link to={`/${s.slug}`}>
                  <span>0{i + 1}</span>
                  <Icon />
                  <h3>{s.nav}</h3>
                  <p>{s.intro}</p>
                  <b>
                    자세히 보기 <ArrowRight />
                  </b>
                </Link>
              </motion.div>
            ) : (
              <motion.div {...reveal} className="coming" key={s.slug}>
                <div>
                  <span>0{i + 1}</span>
                  <Icon />
                  <h3>{s.nav}</h3>
                  <p>{s.intro}</p>
                  <b>
                    상담으로 안내 <MessageCircle />
                  </b>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>
      <ScopePlanner onConsult={onConsult} />
      <section className="home-standard">
        <div className="standard-image">
          <img
            src="/images/detail-sanitation.png"
            alt="전문 장비로 세척 중인 작업자"
          />
        </div>
        <div className="standard-copy">
          <motion.div {...reveal}>
            <span className="eyebrow light">OUR STANDARD</span>
            <h2>
              보이지 않는 곳까지
              <br />
              <em>기준 있게.</em>
            </h2>
            <p>현장마다 상태는 달라도 지키는 원칙은 같습니다.</p>
          </motion.div>
          {[
            [
              "01",
              "먼저 듣습니다",
              "버릴 것보다 남겨야 할 것을 먼저 확인합니다.",
            ],
            [
              "02",
              "범위를 나눕니다",
              "정리, 반출, 세척, 탈취가 필요한 곳을 구분합니다.",
            ],
            [
              "03",
              "과정을 공유합니다",
              "작업 전후 확인할 내용을 고객과 약속합니다.",
            ],
            [
              "04",
              "끝을 확인합니다",
              "요청 범위가 마무리됐는지 함께 확인합니다.",
            ],
          ].map((x) => (
            <motion.div {...reveal} className="standard-row" key={x[0]}>
              <span>{x[0]}</span>
              <b>{x[1]}</b>
              <p>{x[2]}</p>
              <Check />
            </motion.div>
          ))}
        </div>
      </section>
      <section className="review-preview section-pad">
        <motion.div {...reveal}>
          <span className="eyebrow">FIELD NOTES</span>
          <h2>
            결과만이 아니라,
            <br />
            과정을 기록합니다.
          </h2>
          <p>
            현재는 홈페이지 구성을 확인할 수 있는 샘플 작업 기록입니다. 실제
            후기는 고객 동의를 받은 콘텐츠로 교체합니다.
          </p>
          <Link className="line-link" to="/reviews">
            작업후기 페이지 보기 <ArrowRight />
          </Link>
        </motion.div>
        <BeforeAfterSlider />
      </section>
      <FinalCta onConsult={onConsult} />
    </main>
  );
}
export function ServicePage({ data, onConsult }) {
  return (
    <main>
      <PageTitle
        title={`${data.nav} | 위대한 청소부`}
        description={data.intro}
      />
      <section
        className="service-hero"
        style={{ "--hero": `url(${data.image})` }}
      >
        <div className="service-hero-shade" />
        <motion.div
          className="service-hero-copy"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85 }}
        >
          <span className="eyebrow light">{data.kicker}</span>
          <h1>{data.title}</h1>
          <p>{data.intro}</p>
          <button className="primary" onClick={onConsult}>
            이 서비스 상담하기 <ArrowRight />
          </button>
        </motion.div>
        <div className="service-number">
          SERVICE /{" "}
          {String(services.findIndex((x) => x.slug === data.slug) + 1).padStart(
            2,
            "0",
          )}
        </div>
      </section>
      <section className="situation section-pad">
        <motion.header {...reveal}>
          <span className="eyebrow">YOU ARE NOT ALONE</span>
          <h2>
            이런 상황이라면,
            <br />
            상담할 수 있습니다.
          </h2>
          <p>
            현재 상태를 평가하지 않습니다. 필요한 일을 정리하는 것부터
            시작합니다.
          </p>
        </motion.header>
        <div className="situation-list">
          {data.situations.map((s, i) => (
            <motion.div {...reveal} key={s}>
              <span>0{i + 1}</span>
              <p>{s}</p>
              <Check />
            </motion.div>
          ))}
        </div>
      </section>
      <section className="scope section-pad">
        <motion.header {...reveal}>
          <span className="eyebrow light">WORK SCOPE</span>
          <h2>
            {data.nav},<br />
            어디까지 하나요?
          </h2>
        </motion.header>
        <div className="scope-grid">
          {data.scope.map(([title, copy], i) => (
            <motion.article {...reveal} key={title}>
              <span>0{i + 1}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </motion.article>
          ))}
        </div>
      </section>
      <section className="service-process section-pad">
        <motion.header {...reveal}>
          <span className="eyebrow">SERVICE PROCESS</span>
          <h2>
            복잡한 상황을
            <br />네 단계로 나눕니다.
          </h2>
        </motion.header>
        <div className="process-track">
          {data.process.map(([title, copy], i) => (
            <motion.article {...reveal} key={title}>
              <span>{String(i + 1).padStart(2, "0")}</span>
              <i />
              <h3>{title}</h3>
              <p>{copy}</p>
            </motion.article>
          ))}
        </div>
      </section>
      <section className="quote-band">
        <div>
          <EyeOff />
          <span>PRIVACY FIRST</span>
          <h2>
            말하기 어려운 이유까지
            <br />
            설명하지 않아도 괜찮습니다.
          </h2>
        </div>
        <p>
          작업에 필요한 내용만 확인합니다.
          <br />
          상담 기록과 현장 상황은 조심스럽게 다룹니다.
        </p>
      </section>
      <section className="factors section-pad">
        <motion.div {...reveal}>
          <span className="eyebrow">ESTIMATE GUIDE</span>
          <h2>
            견적은 무엇에 따라
            <br />
            달라지나요?
          </h2>
          <p>
            사진 한 장의 숫자로 단정하지 않습니다. 아래 조건을 함께 보고 실제
            필요한 작업 범위를 안내합니다.
          </p>
        </motion.div>
        <div className="factor-list">
          {data.factors.map((x, i) => (
            <motion.div {...reveal} key={x}>
              <span>0{i + 1}</span>
              <b>{x}</b>
              <Check />
            </motion.div>
          ))}
        </div>
      </section>
      <section className="service-faq section-pad">
        <motion.header {...reveal}>
          <span className="eyebrow">BEFORE YOU ASK</span>
          <h2>
            상담 전<br />
            많이 묻는 질문
          </h2>
        </motion.header>
        <Faq items={data.faqs} />
      </section>
      <section className="other-services section-pad">
        <span className="eyebrow">EXPLORE SERVICES</span>
        <h2>
          다른 서비스도
          <br />
          확인해 보세요.
        </h2>
        <ServiceLinks current={data.slug} />
      </section>
      <FinalCta onConsult={onConsult} />
    </main>
  );
}
export function ReviewsPage({ onConsult }) {
  const [filter, setFilter] = useState("전체");
  const types = ["전체", "쓰레기집", "폐기물", "이사·입주", "유품정리", "특수청소"];
  const records = useMemo(
    () =>
      filter === "전체"
        ? sampleRecords
        : sampleRecords.filter((r) => r.type === filter),
    [filter],
  );
  return (
    <main>
      <PageTitle
        title="작업후기 | 위대한 청소부"
        description="위대한 청소부의 서비스별 작업 과정과 현장 기록을 확인하세요."
      />
      <section className="reviews-hero">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="eyebrow light">FIELD NOTES & REVIEWS</span>
          <h1>
            공간이 회복되는
            <br />
            <em>과정을 기록합니다.</em>
          </h1>
          <p>
            실제 후기와 현장 기록은 반드시 고객의 공개 동의를 받은 뒤
            게시합니다.
          </p>
        </motion.div>
        <div className="review-hero-image">
          <img
            src="/images/hero-restoration.png"
            alt="깨끗하게 복원된 공간을 마무리하는 작업자"
          />
        </div>
      </section>
      <section className="reviews-content section-pad">
        <div className="review-heading">
          <div>
            <span className="eyebrow">WORK ARCHIVE</span>
            <h2>
              서비스별
              <br />
              작업 기록
            </h2>
          </div>
          <p>
            <b>안내</b> 현재 보이는 콘텐츠는 홈페이지 레이아웃 확인을 위한 샘플
            작업 기록이며 실제 고객 후기가 아닙니다. 실제 운영 시 동의받은
            사진과 후기만 등록합니다.
          </p>
        </div>
        <div className="review-filter" role="tablist">
          {types.map((t) => (
            <button
              className={filter === t ? "active" : ""}
              onClick={() => setFilter(t)}
              key={t}
            >
              {t}
            </button>
          ))}
        </div>
        <motion.div layout className="record-grid">
          {records.map((r) => (
            <motion.article
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              key={r.title}
            >
              <RecordBeforeAfter record={r} />
              <div className="record-copy">
                <small>{r.meta}</small>
                <h3>{r.title}</h3>
                <p>{r.text}</p>
                <button onClick={onConsult}>
                  비슷한 상황 상담하기 <ArrowRight />
                </button>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </section>
      <section className="review-policy section-pad">
        <motion.div {...reveal}>
          <ShieldCheck />
          <h2>
            후기는 신뢰를 위해
            <br />세 가지를 지킵니다.
          </h2>
        </motion.div>
        <div>
          {[
            ["01", "고객 동의", "사진과 후기의 공개 범위를 사전에 확인합니다."],
            [
              "02",
              "개인정보 보호",
              "이름, 주소, 식별 가능한 물건은 가리거나 제외합니다.",
            ],
            [
              "03",
              "과장 없는 기록",
              "확인되지 않은 수치나 결과를 후기처럼 만들지 않습니다.",
            ],
          ].map((x) => (
            <div key={x[0]}>
              <span>{x[0]}</span>
              <b>{x[1]}</b>
              <p>{x[2]}</p>
            </div>
          ))}
        </div>
      </section>
      <FinalCta onConsult={onConsult} />
    </main>
  );
}
function FinalCta({ onConsult }) {
  return (
    <section className="final-cta">
      <div className="final-bg" />
      <motion.div {...reveal}>
        <span className="eyebrow light">START YOUR RESTORATION</span>
        <h2>
          사진 몇 장이면
          <br />
          시작할 수 있습니다.
        </h2>
        <p>
          정확한 서비스 이름을 몰라도 괜찮습니다.
          <br />
          현재 상황을 보고 필요한 순서부터 안내합니다.
        </p>
        <button className="primary inverse" onClick={onConsult}>
          상담 요청서 작성 <MessageCircle />
        </button>
      </motion.div>
    </section>
  );
}
